const categories = document.querySelectorAll('.category');
const products = document.querySelectorAll('.products');

document.querySelector('.products.active').classList.add('active');

categories.forEach(category => {
    category.addEventListener('mouseenter', (e) => {
        const categoryId = e.target.getAttribute('data-category');
        products.forEach(product => {
            if (product.id === categoryId) {
                product.classList.add('active');
            } else {
                product.classList.remove('active');
            }
        });
    });
});
