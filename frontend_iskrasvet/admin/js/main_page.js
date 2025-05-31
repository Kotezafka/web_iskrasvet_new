document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.products-btn').onclick = () => {
        window.location.href = 'product_management.html';
    };
    document.querySelector('.orders-btn').onclick = () => {
        window.location.href = 'order_management.html';
    };
    document.querySelector('.logout-btn').onclick = () => {
        window.location.href = 'auth_page.html';
    };
}); 