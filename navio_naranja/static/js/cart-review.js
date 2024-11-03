document.addEventListener('DOMContentLoaded', function () {
    const reviewCartCount = document.getElementById('reviewCartCount');
    const reviewCartCountDesk = document.getElementById('reviewCartCountDesk');
    const reviewTotalAmount = document.getElementById('reviewTotalAmount');

    function updateReviewCartCount() {
        const reviewCartItems = document.querySelectorAll('.review-product-item');
        reviewCartCount.textContent = reviewCartItems.length;
        reviewCartCountDesk.textContent = reviewCartItems.length;
    }

    function updateReviewCartTotal() {
        const reviewCartItems = document.querySelectorAll('.review-product-item');
        let total = 0;

        reviewCartItems.forEach(item => {
            const priceElement = item.querySelector('.review-product-price');
            const quantityInput = item.querySelector('.review-quantity-input');
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const quantity = parseInt(quantityInput.value);
            total += price * quantity;
        });

        const totalAmount = document.getElementById('reviewTotalAmount');
        reviewTotalAmount.textContent = `$${total.toFixed(2)}`;
    }

    function updateReviewCartItemQuantity(productId, quantity) {
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
            if (data.success) {
                updateReviewCartTotal();
                updateReviewCartCount();
            } else {
                console.error('Error al actualizar el carrito:', data.error);
            }
        })
        .catch(error => console.error('Error al actualizar el carrito:', error));
    }

    function removeReviewCartItem(productId, productItem) {
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
                updateReviewCartCount();
                updateReviewCartTotal();
            }
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
    }

    function attachReviewEventListeners() {
        document.querySelectorAll('.review-increase-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.closest('.review-quantity-controls').querySelector('.review-quantity-input');
                const productId = this.closest('.review-product-item').dataset.productId;
                let currentQuantity = parseInt(input.value);

                fetch(`/update-cart-item/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: new URLSearchParams({
                        'product_id': productId,
                        'quantity': currentQuantity + 1
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (currentQuantity + 1 <= data.stock) {
                            input.value = currentQuantity + 1;
                        } else {
                            input.value = data.stock;
                        }
                        updateReviewCartItemQuantity(productId, input.value);
                        updateReviewCartTotal();
                    } else {
                        console.error('Error al actualizar el carrito:', data.error);
                    }
                })
                .catch(error => console.error('Error al actualizar el carrito:', error));
            });
        });

        document.querySelectorAll('.review-decrease-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.closest('.review-quantity-controls').querySelector('.review-quantity-input');
                const productId = this.closest('.review-product-item').dataset.productId;
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateReviewCartItemQuantity(productId, input.value);
                    updateReviewCartTotal();
                }
            });
        });

        document.querySelectorAll('.review-remove-product').forEach(button => {
            button.addEventListener('click', function () {
                const productItem = this.closest('.review-product-item');
                const productId = productItem.dataset.productId;
                removeReviewCartItem(productId, productItem);
            });
        });
    }

    function getCSRFToken() {
        const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    function initializeReviewCart() {
        updateReviewCartCount();
        updateReviewCartTotal();

        const quantityInputs = document.querySelectorAll('.review-quantity-input');
        quantityInputs.forEach(input => {
            const productId = input.closest('.review-product-item').dataset.productId;
            input.value = parseInt(input.value) || 1; // Asegura que haya al menos 1
        });
    }

    attachReviewEventListeners();
    initializeReviewCart();
});
