import { fetchProducts, deleteProduct } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.querySelector('.products-list');
    try {
        const products = await fetchProducts();
        productsContainer.innerHTML = products.map(product => `
            <div class="product-item">
                <div class="product-image-block">
                    ${product.images && product.images.length > 0 ? `<img src="data:image/jpeg;base64,${product.images[0]}" class="product-image">` : '<div class="no-image">Изображение товара</div>'}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-stock">Осталось на складе: ${product.stock_quantity} шт</div>
                    <button class="edit-btn" data-id="${product.id}">Редактировать</button>
                    <button class="delete-btn" data-id="${product.id}">Удалить товар</button>
                </div>
            </div>
        `).join('');
        productsContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                if (confirm('Удалить товар?')) {
                    await deleteProduct(e.target.dataset.id);
                    location.reload();
                }
            }
            if (e.target.classList.contains('edit-btn')) {
                window.location.href = `create_new_product.html?id=${e.target.dataset.id}`;
            }
        });
    } catch (err) {
        productsContainer.innerHTML = '<div>Ошибка загрузки товаров</div>';
    }
}); 