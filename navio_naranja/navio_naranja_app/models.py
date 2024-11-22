from django.db import models
from django.conf import settings
import uuid  # Para generar identificadores únicos
import qrcode  # Asegúrate de instalar la librería qrcode
import os

# Create your models here.

#Hay un modelo en PSD para crearlos al milimetro(creo)
class CarouselImage(models.Model):
    desktop_image = models.ImageField(upload_to='carousel/')  # Imagen de escritorio
    mobile_image = models.ImageField(upload_to='carousel/mobile/', blank=True)  # Imagen móvil opcional(detalles)
    alt_text = models.CharField(max_length=255, blank=True)
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.alt_text or f"Image {self.id}"
    

class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    duration = models.TimeField()
    genres = models.ManyToManyField('Genre', related_name='songs')

    def __str__(self):
        return self.title
    

class Product(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    product_type = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    stock = models.IntegerField()
    release_date = models.DateField()
    upload_date = models.DateField(auto_now_add=True)
    songs = models.ManyToManyField('Song', related_name='products')
    description = models.TextField()
    cover_image = models.ImageField(upload_to='album_covers/')
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class CartItem(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    guest_id = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        else:
            return f"Cart for guest {self.guest_id}"

    def total_price(self):
        return sum(item.product.price * item.quantity for item in self.items.all())

    def item_count(self):
        return sum(item.quantity for item in self.items.all())

class Purchase(models.Model):
    serial_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Purchase {self.serial_number}"

    def generate_qr_code(self):
        qr_data = str(self.serial_number)
        qr_image = qrcode.make(qr_data)

        qr_codes_dir = os.path.join(settings.MEDIA_ROOT, 'qr_codes')
        if not os.path.exists(qr_codes_dir):
            os.makedirs(qr_codes_dir)

        qr_image_path = os.path.join(qr_codes_dir, f"{self.serial_number}.png")
        qr_image.save(qr_image_path)

        return os.path.join(settings.MEDIA_URL, 'qr_codes', f"{self.serial_number}.png")


class PurchasedItem(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} (Purchase: {self.purchase.serial_number})"