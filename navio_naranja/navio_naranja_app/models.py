from django.db import models
from django.conf import settings

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

