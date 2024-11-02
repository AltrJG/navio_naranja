document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const sections = document.querySelectorAll('.slider-section');
    const numSections = sections.length;
    slider.style.width = `${numSections * 100}%`;
    sections.forEach(section => {
        section.style.width = `${100 / numSections}%`;
    });
});
