const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay3 = document.querySelector('.overlay3');

cartIcon.addEventListener('click', function (event) {
    event.preventDefault(); 
    cartSidebar.classList.add('open'); 
    overlay3.classList.add('visible'); 
});

function closeSidebar() {
    cartSidebar.classList.remove('open'); 
    overlay3.classList.remove('visible'); 
}

closeSidebarBtn.addEventListener('click', closeSidebar);

overlay3.addEventListener('click', closeSidebar);

document.addEventListener('click', function (event) {
    if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
        closeSidebar(); 
    }
});

//notificación de cantidad total de items en el carrito

function updateCartCount() {
    const cartItems = document.querySelectorAll('.product-item-cart'); 
    const cartCount = document.getElementById('cartCount'); 
    cartCount.textContent = cartItems.length; 
}

document.querySelector('.cart-icon').addEventListener('click', function () {
    updateCartCount(); 
});

document.addEventListener('DOMContentLoaded', updateCartCount);

//Total a pagar

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.product-price-cart');
    let total = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.textContent.replace('$', '')); 
        total += price; 
    });

    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = `$${total.toFixed(2)}`; 
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount(); 
    updateCartTotal(); 
});
