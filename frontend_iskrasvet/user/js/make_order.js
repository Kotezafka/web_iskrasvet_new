document.addEventListener('DOMContentLoaded', function() {
    if (window.cart) cart.updateCartCount();

    const form = document.querySelector('.order-form form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const cartItems = window.cart ? window.cart.items : [];
        if (cartItems.length === 0) {
            alert('Корзина пуста');
            return;
        }
        let error = null;
        for (const item of cartItems) {
            try {
                const response = await fetch('http://localhost:3000/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: item.id, quantity: item.quantity })
                });
                if (!response.ok) {
                    const data = await response.json();
                    error = data.detail || 'Ошибка оформления заказа';
                    break;
                }
            } catch (e) {
                error = 'Ошибка соединения с сервером';
                break;
            }
        }
        if (error) {
            alert(error);
            return;
        }
        const order = {
            name: form.name.value,
            surname: form.surname.value,
            phone: form.phone.value,
            email: form.email.value,
            address: form.address.value,
            cart: cartItems
        };
        const orderNumber = '№' + Date.now() + '-' + Math.floor(Math.random()*10000);
        sessionStorage.setItem('lastOrder', JSON.stringify({ ...order, orderNumber }));
        if (window.cart) window.cart.clearCart();
        window.location.href = 'order_confirmation.html';
    });
}); 