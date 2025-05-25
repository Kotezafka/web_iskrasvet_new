document.addEventListener('DOMContentLoaded', function() {
    if (window.cart) cart.updateCartCount();

    const orderData = sessionStorage.getItem('lastOrder');
    if (!orderData) return;
    const order = JSON.parse(orderData);

    const orderTitle = document.querySelector('.order-title');
    const orderNumberValue = document.querySelector('.order-details .value');
    if (orderTitle) orderTitle.textContent = `Заказ ${order.orderNumber}`;
    if (orderNumberValue) orderNumberValue.textContent = order.orderNumber;

}); 