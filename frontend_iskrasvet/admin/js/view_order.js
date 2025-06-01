import { checkAuth, handleLogout } from './auth_check.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!await checkAuth()) {
        return;
    }

    document.querySelector('.logout-btn')?.addEventListener('click', handleLogout);

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (orderId) {
        loadOrder(orderId);
    }
});

async function loadOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const order = await response.json();
            displayOrder(order);
        }
    } catch (error) {
        console.error('Error loading order:', error);
    }
}

function displayOrder(order) {
    const orderDetails = document.querySelector('.order-details');
    if (!orderDetails) return;

    const productsList = order.products.map(product => `
        <div class="product-item">
            ID товара: ${product.productId}, Количество: ${product.quantity}
        </div>
    `).join('');

    orderDetails.innerHTML = `
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

    const statusSelect = document.querySelector('.order-status-select');
    const statusBtn = document.querySelector('.change-status-btn');

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
}

async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Статус заказа успешно обновлен');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Ошибка при обновлении статуса заказа');
    }
} 