document.addEventListener('DOMContentLoaded', function() {
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');
    const confirmPurchaseUrl = confirmPurchaseBtn.getAttribute('data-url');

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    confirmPurchaseBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const formData = new FormData();
        const cartItems = document.querySelectorAll('.review-product-item');

        cartItems.forEach(item => {
            const productId = item.getAttribute('data-product-id');
            const quantityInput = item.querySelector('.review-quantity-input');
            const quantity = quantityInput.value;

            formData.append(`quantity_${productId}`, quantity);
        });

        fetch(confirmPurchaseUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error en la compra');
        })
        .then(data => {
            console.log(data);
            window.location.href = `/confirmacion/${data.serial_number}/`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
