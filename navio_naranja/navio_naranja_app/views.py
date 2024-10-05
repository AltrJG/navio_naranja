from django.shortcuts import render, get_object_or_404
from .models import CarouselImage, Product, Genre

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