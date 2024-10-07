from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from .models import CarouselImage, Product, Genre, Song

# Create your views here.
def index(request):
    return render(request, 'index.html')

def home(request):
    images = CarouselImage.objects.all()  
    featured = Product.objects.filter(is_featured=True)  
    genres = Genre.objects.all()
    products = Product.objects.all() 
    products_by_genre = {genre.name: Product.objects.filter(songs__genres=genre).distinct() for genre in genres}
    
    context = {
        'images': images,
        'featured': featured,
        'genres': genres,
        'all_products': products,
        'products_by_genre': products_by_genre,
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
