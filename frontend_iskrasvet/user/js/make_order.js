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

        try {
            const response = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: `${form.name.value} ${form.surname.value}`,
                    customer_phone: form.phone.value,
                    customer_email: form.email.value,
                    delivery_address: form.address.value,
                    delivery_cost: 0,
                    products: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    }))
                })
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.detail || 'Ошибка оформления заказа');
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
        } catch (e) {
            alert('Ошибка соединения с сервером');
        }
    });
}); 