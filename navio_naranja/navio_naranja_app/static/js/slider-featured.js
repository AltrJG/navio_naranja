document.addEventListener("DOMContentLoaded", function () {
    const customCarousel = document.querySelector('.custom-carousel'); 
    const leftButton = document.querySelector('.custom-btn-left'); 
    const rightButton = document.querySelector('.custom-btn-right'); 

    let currentIndex = 0; 
    let cardsToShow = getCardsToShow(); 
    const totalImages = document.querySelectorAll('.custom-slider-section').length; 


    function getCardsToShow() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return 1;
        } else if (screenWidth <= 768) {
            return 2; 
        } else {
            return 4; 
        }
    }

    function updateSlider() {
        const offset = -(currentIndex * (100 / cardsToShow)); 
        customCarousel.style.transform = `translateX(${offset}%)`; 
    }

    rightButton.addEventListener('click', function () {
        if (currentIndex < Math.ceil(totalImages / cardsToShow) - 1) {
            currentIndex++; 
        } else {
            currentIndex = 0; 
        }
        updateSlider(); 
    });

    leftButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.ceil(totalImages / cardsToShow) - 1; 
        }
        updateSlider(); 
    });

    window.addEventListener('resize', function () {
        cardsToShow = getCardsToShow(); 
        updateSlider(); 
    });

    let touchStartX = 0;
    let touchEndX = 0;

    customCarousel.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    customCarousel.addEventListener('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            if (currentIndex < Math.ceil(totalImages / cardsToShow) - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
        } else if (touchEndX > touchStartX) {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = Math.ceil(totalImages / cardsToShow) - 1;
            }
        }
        updateSlider();
    }
});
