import { checkAuth, handleLogout } from './auth_check.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!await checkAuth()) {
        return;
    }

    document.querySelector('.logout-btn')?.addEventListener('click', handleLogout);

    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const productsList = document.querySelector('.products-list');
    if (!productsList) return;

    productsList.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-image-block">
                ${product.images && product.images.length > 0 ? 
                    `<img src="data:image/jpeg;base64,${product.images[0]}" class="product-image">` : 
                    '<div class="no-image">Изображение товара</div>'}
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-stock">Осталось на складе: ${product.stock_quantity} шт</div>
                <button class="edit-btn" data-id="${product.id}">Редактировать</button>
                <button class="delete-btn" data-id="${product.id}">Удалить товар</button>
            </div>
        </div>
    `).join('');

    productsList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Удалить товар?')) {
                try {
                    const response = await fetch(`http://localhost:3000/products/${e.target.dataset.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        }
                    });
                    if (response.ok) {
                        location.reload();
                    }
                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert('Ошибка при удалении товара');
                }
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            window.location.href = `create_new_product.html?id=${e.target.dataset.id}`;
        }
    });
} 