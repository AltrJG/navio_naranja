from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, StockNotification

@receiver(post_save, sender='navio_naranja_app.Product')
def create_low_stock_notification(sender, instance, **kwargs):
    if instance.stock < 10:
        existing_notification = StockNotification.objects.filter(product=instance, resolved=False).first()
        if not existing_notification:
            StockNotification.objects.create(product=instance, threshold=10)
    else:
        StockNotification.objects.filter(product=instance, resolved=False).update(resolved=True)
