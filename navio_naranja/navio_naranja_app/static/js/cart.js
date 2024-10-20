document.addEventListener('DOMContentLoaded', function () {
    const cartCount = document.getElementById('cartCount');
    const cartCountDesk = document.getElementById('cartCountDesk');
    const cartSidebarContent = document.querySelector('.cart-sidebar-content');
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

    const addToCartButtons = document.querySelectorAll('.custom-buy-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    function addToCart(productId) {
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
                showMessage(data.message);
                cartCount.textContent = data.cart_item_count;
    
                if (data.new_item) {
                    fetch('/cart/sidebar/')
                        .then(response => response.text())
                        .then(cartHtml => {
                            cartSidebarContent.innerHTML = cartHtml;
                            attachEventListenersToNewItems();
                            updateCartCount();
                            updateCartTotal();
                        })
                        .catch(error => console.error('Error al actualizar el carrito:', error));
                } else {
                    const productItemCart = document.querySelector(`.product-item-cart[data-product-id="${productId}"]`);
                    if (productItemCart) {
                        const quantityInput = productItemCart.querySelector('.quantity-input');
                        if (quantityInput) {
                            quantityInput.value = data.item_quantity;
                        }
                    }
                }
    
                updateCartCount();
                updateCartTotal();
            }
        })
        .catch(error => {
            console.error('Error al añadir el producto al carrito:', error);
            showMessage('Error al añadir el producto al carrito.', true);
        });
    }

    function updateCartItemQuantity(productId, quantity) {
        fetch('/update-cart-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                'product_id': productId,
                'quantity': quantity
            })
        })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            updateCartTotal(); 
            updateCartCount(); 
        } else {
            console.error('Error al actualizar el carrito:', data.error);
        }
    })
    .catch(error => console.error('Error al actualizar el carrito:', error));
}


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

    function updateCartCount() {
        const cartItems = document.querySelectorAll('.product-item-cart');
        cartCount.textContent = cartItems.length;
        cartCountDesk.textContent = cartItems.length;
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

    function attachEventListenersToNewItems() {
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.closest('.quantity-controls').querySelector('.quantity-input');
                const productId = this.closest('.product-item-cart').dataset.productId;
                input.value = parseInt(input.value) + 1;
                updateCartItemQuantity(productId, input.value);
                updateCartTotal();
            });
        });
    
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.closest('.quantity-controls').querySelector('.quantity-input');
                const productId = this.closest('.product-item-cart').dataset.productId;
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateCartItemQuantity(productId, input.value);
                    updateCartTotal();
                }
            });
        });
    
        document.querySelectorAll('.remove-product').forEach(button => {
            button.addEventListener('click', function () {
                const productItem = this.closest('.product-item-cart');
                const productId = productItem.dataset.productId;
                removeCartItem(productId, productItem);
            });
        });
    }

    function getCSRFToken() {
        const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    function initializeCart() {
        updateCartCount();
        updateCartTotal();
    
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            const productId = input.closest('.product-item-cart').dataset.productId;
            input.value = parseInt(input.value) || 0;
        });
    }

    attachEventListenersToNewItems();
    initializeCart();
});

function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    const messageContent = document.getElementById('message-content');

    messageContent.textContent = message;
    messageContainer.classList.toggle('error', isError);

    messageContainer.style.display = 'block';
    setTimeout(function() {
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;

        if (header.classList.contains('header-hidden')) {
            messageContainer.style.top = '0';
        } else {
            messageContainer.style.top = `${headerHeight}px`;
        }

        messageContainer.style.opacity = '1';
    }, 100);

    setTimeout(function() {
        messageContainer.style.top = '-100px';
        messageContainer.style.opacity = '0';

        setTimeout(function() {
            messageContainer.style.display = 'none';
        }, 500);
    }, 3000);
}


