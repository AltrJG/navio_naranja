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

function updateCartCount() {
    const cartItems = document.querySelectorAll('.product-item-cart'); 
    const cartCount = document.getElementById('cartCount'); 
    cartCount.textContent = cartItems.length;
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.product-item-cart');
    let total = 0;

    cartItems.forEach(item => {
        const priceElement = item.querySelector('.product-price-cart');
        const quantityInput = item.querySelector('.quantity-input');
        const price = parseFloat(priceElement.textContent.replace('$', '')); 
        const quantity = parseInt(quantityInput.value);
        total += price * quantity;
    });

    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount(); 
    updateCartTotal(); 
});

document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.closest('.quantity-controls').querySelector('.quantity-input');
        const productId = this.closest('.product-item-cart').dataset.productId;
        input.value = parseInt(input.value) + 1;

        updateCartItemQuantity(productId, input.value);
    });
});

document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.closest('.quantity-controls').querySelector('.quantity-input');
        const productId = this.closest('.product-item-cart').dataset.productId;
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
            updateCartItemQuantity(productId, input.value);
        }
    });
});

function updateCartItemQuantity(productId, quantity) {
    fetch('/update-cart-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCSRFToken()
        },
        body: new URLSearchParams({
            'product_id': productId,
            'quantity': quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            updateCartTotal();
        }
    })
    .catch(error => console.error('Error al actualizar el carrito:', error));
}

document.querySelectorAll('.remove-product').forEach(button => {
    button.addEventListener('click', function () {
        const productItem = this.closest('.product-item-cart');
        const productId = productItem.dataset.productId;

        removeCartItem(productId, productItem);
    });
});

function removeCartItem(productId, productItem) {
    fetch('/remove-cart-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCSRFToken()
        },
        body: new URLSearchParams({
            'product_id': productId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            productItem.remove(); 
            updateCartCount();    
            updateCartTotal();   
        }
    })
    .catch(error => console.error('Error al eliminar el producto:', error));
}
