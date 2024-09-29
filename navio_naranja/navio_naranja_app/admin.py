from django.contrib import admin

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