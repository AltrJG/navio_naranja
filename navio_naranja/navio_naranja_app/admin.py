from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
import json
from .models import Purchase, PurchasedItem
from django.core.exceptions import ValidationError
from django import forms

# Register your models here.
from .models import CarouselImage
from .models import Genre, Song, Product

admin.site.register(CarouselImage)

class GenreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  
    search_fields = ('name',)  

class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'duration') 
    search_fields = ('title', 'artist') 
    list_filter = ('genres',) 
    filter_horizontal = ('genres',)  

class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'product_type', 'price', 'stock', 'release_date', 'is_featured')  
    search_fields = ('title', 'artist')  
    list_filter = ('product_type', 'release_date', 'is_featured')  
    filter_horizontal = ('songs',)  
    readonly_fields = ('upload_date',)  

admin.site.register(Genre, GenreAdmin)
admin.site.register(Song, SongAdmin)
admin.site.register(Product, ProductAdmin)

class PurchasedItemForm(forms.ModelForm):
    class Meta:
        model = PurchasedItem
        fields = ('product', 'quantity')

    def clean_quantity(self):
        quantity = self.cleaned_data.get('quantity')
        product = self.cleaned_data.get('product')

        if product and quantity:
            if quantity > product.stock:
                raise ValidationError(f"No hay suficiente stock. Solo hay {product.stock} unidades disponibles.")
        return quantity

class PurchasedItemInline(admin.TabularInline):
    model = PurchasedItem
    extra = 0
    fields = ('product', 'quantity')
    readonly_fields = ('purchase',)
    form = PurchasedItemForm

class PurchaseAdmin(admin.ModelAdmin):
    change_list_template = "admin/qr_code_scanner.html"
    list_display = ('serial_number', 'created_at')
    search_fields = ('serial_number',)
    list_filter = ('created_at',)
    inlines = [PurchasedItemInline]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('scan/', self.admin_site.admin_view(self.scan_qr_code), name='scan_qr_code'),
        ]
        return custom_urls + urls

    def scan_qr_code(self, request):
        if request.method == "POST":
            data = json.loads(request.body)
            serial_number = data.get("serial_number", "").strip()

            sanitized_serial_number = serial_number.replace('-', '')

            try:
                purchase = Purchase.objects.get(serial_number=sanitized_serial_number)
                items = PurchasedItem.objects.filter(purchase=purchase)
                response_data = {
                    "purchase": {
                        "serial_number": purchase.serial_number,
                        "created_at": purchase.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    },
                    "items": [
                        {
                            "product_title": item.product.title,
                            "quantity": item.quantity,
                            "price": item.product.price,
                        }
                        for item in items
                    ],
                }
                return JsonResponse(response_data)
            except Purchase.DoesNotExist:
                return JsonResponse({"error": "No se encontró una compra con este número de serie."}, status=404)
        return JsonResponse({"error": "Método no permitido."}, status=405)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['serial_number']
        return []

    def save_model(self, request, obj, form, change):
        if change:
            for item in obj.items.all():
                product = item.product
                old_quantity = item.quantity
                new_quantity = form.cleaned_data.get('quantity')

                difference = new_quantity - old_quantity
                product.stock -= difference
                product.save()

        super().save_model(request, obj, form, change)

admin.site.register(Purchase, PurchaseAdmin)