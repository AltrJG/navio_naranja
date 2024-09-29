from django.shortcuts import render
from .models import CarouselImage, Product, Genre

# Create your views here.
def index(request):
    return render(request, 'index.html')

def home(request):
    images = CarouselImage.objects.all()  
    featured = Product.objects.filter(is_featured=True)  
    genres = Genre.objects.all() 
    products_by_genre = {genre.name: Product.objects.filter(songs__genres=genre).distinct() for genre in genres}
    
    context = {
        'images': images,
        'featured': featured,
        'genres': genres,
        'products_by_genre': products_by_genre,
    }
    
    return render(request, 'home.html', context)

