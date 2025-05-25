const createProductCard = (product) => `
    <div class="product-card">
        <div class="product-image">
            <img src="${product.image}">
        </div>
        <div class="product-details">
            <a href="product_page.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <div class="product-divider"></div>
            <div class="product-footer">
                <span class="product-price">${product.price}</span>
                <span class="product-stock">Осталось: ${product.stock}</span>
                <button class="add-to-cart button-orange" data-product-id="${product.id}" data-product-title="${product.title}" data-product-price="${product.price}" data-product-image="${product.image}" data-product-stock="${product.stock}">В корзину</button>
            </div>
        </div>
    </div>
`;

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2600);
}

function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const title = this.dataset.productTitle;
            const price = this.dataset.productPrice;
            const image = this.dataset.productImage;
            const stock = parseInt(this.dataset.productStock);
            const existingItem = cart.items.find(item => String(item.id) === String(productId));
            const inCart = existingItem ? existingItem.quantity : 0;
            if (inCart >= stock) {
                showToast('Недостаточно товаров на складе!');
                return;
            }
            cart.addItem(productId, title, price, image, stock);
            showToast('Товар добавлен в корзину');
        });
    });
}

function renderProducts(filtered) {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;
    productsContainer.innerHTML = (filtered || window.products).map(product => createProductCard(product)).join('');
    addCartEventListeners();
}

function filterProducts(query) {
    query = query.trim().toLowerCase();
    if (!query) return window.products;
    return window.products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
    );
}

async function loadProducts() {
    const products = await fetchProducts();
    window.products = products;
    renderProducts(products);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    cart.updateCartCount();

    const searchInput = document.querySelector('.search input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filtered = filterProducts(this.value);
            renderProducts(filtered);
        });
    }

    document.querySelector('.products').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
        }
    });
}); 