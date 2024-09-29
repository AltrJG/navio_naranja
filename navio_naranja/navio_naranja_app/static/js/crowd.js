document.addEventListener("DOMContentLoaded", function () {
    const transitionScreen = document.querySelector('.transition-screen');

    let numPeople;
    if (window.innerWidth <= 768) { 
        numPeople = Math.floor(Math.random() * 5) + 3; 
    } else {
        numPeople = Math.floor(Math.random() * 10) + 5; 
    }

    const maxVisibleWalkers = window.innerWidth <= 768 ? 5 : 10; 
    let visibleWalkers = 0; 

    const images = [
        '/static/crowd/person1.png',
        '/static/crowd/person2.png',
        '/static/crowd/person3.png',
        '/static/crowd/person4.png',
        '/static/crowd/person5.png',
        '/static/crowd/person6.png',
        '/static/crowd/person7.png',
        '/static/crowd/person8.png',
        '/static/crowd/person9.png',
        '/static/crowd/person10.png',
        '/static/crowd/person11.png',
        '/static/crowd/person12.png',
        '/static/crowd/person13.png',
        '/static/crowd/person14.png',
        '/static/crowd/person15.png',
        '/static/crowd/person16.png',
        '/static/crowd/person17.png',
        '/static/crowd/person18.png',
        '/static/crowd/person19.png',
        '/static/crowd/person20.png',
        '/static/crowd/person21.png',
        '/static/crowd/person22.png',
        '/static/crowd/person23.png',
        '/static/crowd/person24.png',
        '/static/crowd/person25.png',
        '/static/crowd/person26.png',
        '/static/crowd/person27.png',
        '/static/crowd/person28.png',
        '/static/crowd/person29.png',
        '/static/crowd/person30.png'
    ];

    function createWalker(index, sizeOverride) {
        if (visibleWalkers >= maxVisibleWalkers) return;

        const img = document.createElement('img');
        img.src = images[Math.floor(Math.random() * images.length)];
        img.classList.add('walker');

        const size = sizeOverride || (Math.random() * (1 - 0.2) + 0.4);
        img.style.height = `${size * 100}vh`;
        
        const speed = Math.random() * (10 - 5) + 5;
        img.style.animationDuration = `${speed}s`;
        img.style.bottom = '0';
        img.style.zIndex = Math.floor(size * 100);

        transitionScreen.appendChild(img);
        visibleWalkers++; 

        let walkStep = 0;
        const amplitude = 10;
        const frequency = 0.1;

        function animateStep() {
            walkStep += frequency;
            const stepOffset = Math.sin(walkStep) * amplitude;
            img.style.transform = `translateY(${stepOffset}px)`;
            requestAnimationFrame(animateStep);
        }

        animateStep();

        img.addEventListener('animationend', function () {
            img.remove(); 
            visibleWalkers--; 
        });
    }

    let peopleGenerated = 0;
    function generatePeopleContinuously() {
        if (peopleGenerated < numPeople) {
            createWalker(peopleGenerated);
            peopleGenerated++;
            setTimeout(generatePeopleContinuously, Math.random() * 1500 + 500);
        }
    }

    function startInfiniteWalkers() {
        generatePeopleContinuously(); 
    }

    startInfiniteWalkers();
});
