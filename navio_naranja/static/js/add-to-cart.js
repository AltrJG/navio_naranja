document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.custom-buy-button');
    const cartCount = document.getElementById('cartCount'); 
    const cartSidebarContent = document.querySelector('.cart-sidebar-content');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            
            fetch('/add-to-cart/', {
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
                    alert(data.message);
                    cartCount.textContent = data.cart_item_count;

                    if (data.product_html) {
                        cartSidebarContent.innerHTML += data.product_html;
                    }

                    updateCartCount();
                    updateCartTotal();
                    attachEventListenersToNewItems();
                }
            })
            .catch(error => {
                console.error('Error al añadir el producto al carrito:', error);
            });
        });
    });
});

function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function attachEventListenersToNewItems() {
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            if (this.value < 1) this.value = 1;  
            updateCartTotal();  
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.closest('.quantity-controls').querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;  
            updateCartTotal();  
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.closest('.quantity-controls').querySelector('.quantity-input');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;  
            }
            updateCartTotal();  
        });
    });

    document.querySelectorAll('.remove-product').forEach(button => {
        button.addEventListener('click', function () {
            const productItem = this.closest('.product-item-cart');
            productItem.remove();  
            updateCartCount();  
            updateCartTotal();  
        });
    });
}

