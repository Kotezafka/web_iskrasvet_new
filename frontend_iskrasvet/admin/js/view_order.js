import { fetchOrder, updateOrderStatus } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    const orderContainer = document.querySelector('.order-details');
    const statusSelect = document.querySelector('.order-status-select');
    const statusBtn = document.querySelector('.change-status-btn');

    try {
        const order = await fetchOrder(orderId);
        
        const productsList = order.products.map(product => `
            <div class=\"product-item\">
                ID товара: ${product.productId}, Количество: ${product.quantity}
            </div>
        `).join('');

        orderContainer.innerHTML = `
            <div class="order-info">
                <div>Номер заказа: ${order.id}</div>
                <div>Статус: <span class="order-status">${order.status || 'Новый'}</span></div>
                <div>Имя клиента: ${order.customer_name}</div>
                <div>Телефон: ${order.customer_phone}</div>
                <div>Email: ${order.customer_email}</div>
                <div>Адрес доставки: ${order.delivery_address}</div>
                <div>Стоимость доставки: ${order.delivery_cost} руб.</div>
                <div>Общая стоимость: ${order.total_price} руб.</div>
                <div>Дата создания: ${new Date(order.created_at).toLocaleString()}</div>
            </div>
            <div class="order-products">
                <h3>Состав заказа:</h3>
                ${productsList}
            </div>
        `;

        if (statusSelect) {
            statusSelect.value = order.status || 'created';
        }

        if (statusBtn) {
            statusBtn.addEventListener('click', async () => {
                try {
                    await updateOrderStatus(orderId, statusSelect.value);
                    location.reload();
                } catch (error) {
                    alert('Ошибка при обновлении статуса: ' + error.message);
                }
            });
        }
    } catch (err) {
        orderContainer.innerHTML = '<div>Ошибка загрузки заказа</div>';
        console.error('Error loading order:', err);
    }
}); 