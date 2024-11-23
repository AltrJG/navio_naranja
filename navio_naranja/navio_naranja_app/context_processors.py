from .models import StockNotification

def low_stock_notifications(request):
    if request.user.is_authenticated:
        notifications = StockNotification.objects.filter(resolved=False)
        return {'low_stock_notifications': notifications}
    return {}
