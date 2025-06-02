import { fetchOrders } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.querySelector('.orders-list');
    try {
        const orders = await fetchOrders();
        ordersContainer.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.status || 'Новый'}</td>
                <td>${order.total_price ? order.total_price + ' руб' : ''}</td>
                <td><button class="view-btn" data-id="${order.id}">Просмотр заказа</button></td>
            </tr>
        `).join('');
        ordersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-btn')) {
                window.location.href = `view_order.html?id=${e.target.dataset.id}`;
            }
        });
    } catch (err) {
        ordersContainer.innerHTML = '<tr><td colspan="4">Ошибка загрузки заказов</td></tr>';
    }
}); 