# navio_naranja_app/middleware.py
from django.utils.deprecation import MiddlewareMixin
from django.utils.crypto import get_random_string
from .models import Cart

class GuestCartMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.user.is_authenticated:
            guest_id = request.session.get('guest_id')
            if not guest_id:
                guest_id = get_random_string(32)
                request.session['guest_id'] = guest_id
            
            cart, created = Cart.objects.get_or_create(guest_id=guest_id)
            request.cart = cart
        else:
            cart, created = Cart.objects.get_or_create(user=request.user)
            request.cart = cart
