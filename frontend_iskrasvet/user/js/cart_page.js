function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-price">${item.price}</div>
            </div>
            <div class="item-quantity">
                <div class="quantity-controls">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="remove-item">Удалить</button>
            </div>
        </div>
    `;
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        totalItemsElement.textContent = '0';
        totalPriceElement.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.items.map(createCartItemHTML).join('');
    totalItemsElement.textContent = cart.getTotalItems();
    totalPriceElement.textContent = cart.getTotalPrice().toLocaleString();
    
    addCartItemEventListeners();
    document.querySelectorAll('.remove-item').forEach(btn => btn.classList.add('button-orange'));
    document.querySelector('.clear-cart')?.classList.add('button-orange');
    document.querySelector('.checkout')?.classList.add('button-orange');
}

function addCartItemEventListeners() {
    document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.dataset.productId;
        item.querySelector('.increase-quantity').addEventListener('click', () => {
            const initialStock = (window.products.find(p => String(p.id) === String(productId))?.stock || 0);
            const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
            const inCart = currentQuantity;
            const stock = initialStock - inCart;
            if (stock === 0) return;
            cart.updateQuantity(productId, currentQuantity + 1);
            renderCart();
        });
        item.querySelector('.decrease-quantity').addEventListener('click', () => {
            const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
            if (currentQuantity > 1) {
                cart.updateQuantity(productId, currentQuantity - 1);
            } else {
                cart.removeItem(productId);
            }
            renderCart();
        });
        item.querySelector('.remove-item').addEventListener('click', () => {
            cart.removeItem(productId);
            renderCart();
        });
    });
}

document.querySelector('.clear-cart')?.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart.clearCart();
        renderCart();
    }
});

document.querySelector('.checkout')?.addEventListener('click', () => {
    if (cart.items.length === 0) {
        alert('Корзина пуста');
        return;
    }
    window.location.href = 'make_order.html';
});

document.addEventListener('DOMContentLoaded', renderCart); 