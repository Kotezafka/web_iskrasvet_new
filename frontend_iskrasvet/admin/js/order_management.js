import { checkAuth, handleLogout } from './auth_check.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!await checkAuth()) {
        return;
    }

    document.querySelector('.logout-btn')?.addEventListener('click', handleLogout);

    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch('http://localhost:3001/api/orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const orders = await response.json();
            displayOrders(orders);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders(orders) {
    const ordersTable = document.querySelector('.orders-table');
    if (!ordersTable) return;

} 