const categories = document.querySelectorAll('.category');
const products = document.querySelectorAll('.products');

const defaultCategory = "destacados";
const defaultCategoryElement = document.querySelector(`.category[data-category="${defaultCategory}"]`);

if (defaultCategoryElement) {
    defaultCategoryElement.classList.add('category-active');
}

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

        categories.forEach(cat => cat.classList.remove('category-active'));
        e.target.classList.add('category-active');
    });
});

const dropdownProducts = document.querySelector('.dropdown-products');
dropdownProducts.addEventListener('mouseenter', () => {
    const activeProduct = document.querySelector('.products.active');

    if (activeProduct) {
        const activeCategory = document.querySelector(`.category[data-category="${activeProduct.id}"]`);
        if (activeCategory) {
            categories.forEach(cat => cat.classList.remove('category-active'));
            activeCategory.classList.add('category-active');
        }
    }
});

