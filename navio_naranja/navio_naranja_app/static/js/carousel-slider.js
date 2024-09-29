document.addEventListener("DOMContentLoaded", function() {
    const carrusel = document.querySelector('.carruseles'); 
    const images = document.querySelectorAll('.slider-section'); 
    const leftButton = document.querySelector('.btn-left'); 
    const rightButton = document.querySelector('.btn-right'); 

    let currentIndex = 0; 
    const totalImages = images.length; 

    let startX = 0; 
    let endX = 0;  

    function updateSlider() {
        const width = images[0].clientWidth;
        const offset = -(currentIndex * width);
        carrusel.style.transform = `translateX(${offset}px)`; 
        carrusel.style.transition = 'transform 0.5s ease'; 
    }

    function autoSlide() {
        if (currentIndex < totalImages - 1) {
            currentIndex++; 
        } else {
            currentIndex = 0;
        }
        updateSlider(); 
    }

    let slideInterval = setInterval(autoSlide, 3000);

    rightButton.addEventListener('click', function() {
        clearInterval(slideInterval); 
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; 
        }
        updateSlider(); 
        slideInterval = setInterval(autoSlide, 3000); 
    });

    leftButton.addEventListener('click', function() {
        clearInterval(slideInterval); 
        if (currentIndex > 0) {
            currentIndex--; 
        } else {
            currentIndex = totalImages - 1; 
        }
        updateSlider();
        slideInterval = setInterval(autoSlide, 3000); 
    });

    carrusel.addEventListener('touchstart', function(e) {
        clearInterval(slideInterval); 
        startX = e.touches[0].clientX;
    });

    carrusel.addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX; 
    });

    carrusel.addEventListener('touchend', function() {
        const threshold = 50; 
        const swipeDistance = startX - endX; 

        if (swipeDistance > threshold) {
            if (currentIndex < totalImages - 1) {
                currentIndex++; 
            } else {
                currentIndex = 0; 
            }
        } else if (swipeDistance < -threshold) {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalImages - 1;
            }
        }

        updateSlider();
        slideInterval = setInterval(autoSlide, 3000);
    });
});
