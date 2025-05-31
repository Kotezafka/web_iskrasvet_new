import { fetchOrder, updateOrderStatus } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    const orderContainer = document.querySelector('.order-details');
    const statusSelect = document.querySelector('.order-status-select');
    const statusBtn = document.querySelector('.change-status-btn');
    try {
        const order = await fetchOrder(orderId);
        orderContainer.innerHTML = `
            <div>Номер заказа: ${order.id}</div>
            <div>Статус: <span class="order-status">${order.status || 'Новый'}</span></div>
            <div>Состав заказа: ...</div>
        `;
        statusBtn.addEventListener('click', async () => {
            await updateOrderStatus(orderId, statusSelect.value);
            location.reload();
        });
    } catch (err) {
        orderContainer.innerHTML = '<div>Ошибка загрузки заказа</div>';
    }
}); 