from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from .models import CarouselImage, Product, Genre, Song, Cart, CartItem
import uuid
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return render(request, 'index.html')

def home(request):
    images = CarouselImage.objects.all()  
    featured = Product.objects.filter(is_featured=True)  
    genres = Genre.objects.all()
    products = Product.objects.all() 
    products_by_genre = {genre.name: Product.objects.filter(songs__genres=genre).distinct() for genre in genres}
    
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
    else:
        guest_id = request.session.get('guest_id')
        cart = Cart.objects.filter(guest_id=guest_id).first()

    cart_items = cart.items.all() if cart else []

    context = {
        'images': images,
        'featured': featured,
        'genres': genres,
        'all_products': products,
        'products_by_genre': products_by_genre,
        'cart_items': cart_items,
    }
    
    return render(request, 'home.html', context)


def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    featured = Product.objects.filter(is_featured=True)
    genres = Genre.objects.all()
    product_genres = Genre.objects.filter(songs__products=product).distinct()
    products_by_genre = {genre.name: Product.objects.filter(songs__genres=genre).distinct() for genre in genres}


    context = {
        'product': product,
        'featured': featured,
        'genres': genres,
        'product_genres': product_genres,
        'products_by_genre': products_by_genre,
    }

    return render(request, 'product_detail.html', context)

def search_suggestions(request):
    query = request.GET.get('q', '').strip()

    if query:
        products = Product.objects.filter(Q(title__icontains=query) | Q(artist__icontains=query))
        songs = Song.objects.filter(Q(title__icontains=query) | Q(artist__icontains=query))
        genres = Genre.objects.filter(name__icontains=query)
        artists = Song.objects.filter(artist__icontains=query).distinct().values('artist')
    else:
        products = songs = genres = artists = []

    results = {
        'products': list(products.values('title', 'artist', 'cover_image')),
        'songs': list(songs.values('title', 'artist')),
        'genres': list(genres.values('name')),
        'artists': list(artists),
    }

    return JsonResponse(results)

def search_result(request):
    query = request.GET.get('q', '')
    selected_genres = request.GET.getlist('genre')
    selected_types = request.GET.getlist('type')

    products_result = Product.objects.filter(
        Q(title__icontains=query) | Q(artist__icontains=query) |
        Q(songs__title__icontains=query) | Q(songs__artist__icontains=query) | 
        Q(songs__genres__name__icontains=query)
    ).distinct()

    if selected_genres:
        products_result = products_result.filter(songs__genres__in=selected_genres).distinct()

    if selected_types:
        products_result = products_result.filter(product_type__in=selected_types).distinct()

    featured = Product.objects.filter(is_featured=True)
    genres = Genre.objects.all()
    products_by_genre = {genre.name: Product.objects.filter(songs__genres=genre).distinct() for genre in genres}

    product_types = Product.objects.values_list('product_type', flat=True).distinct()

    context = {
        'query': query,
        'products': products_result,
        'featured': featured,
        'genres': genres,
        'products_by_genre': products_by_genre,
        'selected_genres': selected_genres,
        'selected_types': selected_types,
        'product_types': product_types,
    }

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'partials/products.html', context)

    return render(request, 'search_result.html', context)

def add_to_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            guest_id = request.session.get('guest_id')
            if not guest_id:
                guest_id = str(uuid.uuid4())
                request.session['guest_id'] = guest_id
            cart, created = Cart.objects.get_or_create(guest_id=guest_id)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += 1
            cart_item.save()

        product_html = render_to_string('partials/cart_item.html', {'item': cart_item})

        return JsonResponse({
            'message': 'Producto añadido al carrito',
            'cart_item_count': cart.items.count(),
            'product_html': product_html,
            'new_item': created,
            'item_id': cart_item.id,
            'item_quantity': cart_item.quantity
        })

    return JsonResponse({'error': 'Método no permitido'}, status=405)




def update_cart_item_quantity(request):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity', 1)
        
        try:
            quantity = max(1, int(quantity))
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Cantidad no válida.'})

        print(f"ID del producto recibido: {product_id}")
        print(f"Cantidad recibida: {quantity}")

        product = get_object_or_404(Product, id=product_id)
        cart = request.cart

        cart_item = cart.items.filter(product=product).first()

        if cart_item:
            print(f"Cantidad actual antes de actualizar: {cart_item.quantity}")
            cart_item.quantity = quantity
            cart_item.save()
            print(f"Cantidad actualizada a: {cart_item.quantity}")

            return JsonResponse({
                'success': True,
                'total': cart.total_price(),
                'cart_count': cart.item_count(),
            })

        else:
            print(f"El producto con ID {product_id} no está en el carrito.")
            return JsonResponse({'success': False, 'error': 'El producto no está en el carrito.'})

    return JsonResponse({'success': False, 'error': 'Método no permitido o datos faltantes.'})



def remove_cart_item(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        
        if request.user.is_authenticated:
            cart = Cart.objects.get(user=request.user)
        else:
            guest_id = request.session.get('guest_id')
            cart = Cart.objects.get(guest_id=guest_id)
        
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        cart_item.delete()

        return JsonResponse({'message': 'Producto eliminado correctamente'})

    return JsonResponse({'error': 'Método no permitido'}, status=405)

def cart_sidebar(request):
    if request.user.is_authenticated:
        cart = Cart.objects.get(user=request.user)
    else:
        guest_id = request.session.get('guest_id')
        cart = Cart.objects.filter(guest_id=guest_id).first()

    cart_items = cart.items.all() if cart else []
    
    return render(request, 'partials/cart_sidebar.html', {'cart_items': cart_items})