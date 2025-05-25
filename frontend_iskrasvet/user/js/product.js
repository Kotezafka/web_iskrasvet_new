let currentProduct = null;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function loadProductDetails() {
    const product = await fetchProduct(productId);
    if (!product) {
        document.querySelector('.product-container').innerHTML = '<div style="padding:2rem">Товар не найден</div>';
        return;
    }
    currentProduct = product;

    const stock = product.stock;
    
    const img = document.getElementById('product-img');
    if (product.image) {
        img.src = product.image;
        img.alt = product.title;
        img.style.background = 'none';
    } else {
        img.src = '';
        img.alt = 'Нет изображения';
        img.style.background = '#FFA500';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#222';
        img.style.fontSize = '1.2rem';
        img.style.fontWeight = 'bold';
        img.style.content = 'Изображение товара';
    }

    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-description').textContent = product.description || '';
    document.getElementById('product-price').textContent = product.price;
    
    const avail = document.getElementById('product-availability');
    avail.textContent = stock > 0 ? `Осталось: ${stock} шт` : 'Нет в наличии';
    avail.className = 'availability' + (stock > 0 ? ' in-stock' : ' out-of-stock');
    
    const btn = document.querySelector('.add-to-cart-button');
    btn.disabled = stock === 0;
    btn.style.opacity = stock > 0 ? '1' : '0.5';
}

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

function addToCart() {
    if (!currentProduct) return;
    cart.addItem(
        productId,
        currentProduct.title,
        currentProduct.price,
        currentProduct.image,
        currentProduct.stock
    );
    loadProductDetails();
    showToast('Товар добавлен в корзину');
}

function updateCartCounter() {
    cart.updateCartCount();
}

document.querySelector('.add-to-cart-button').addEventListener('click', addToCart);
document.querySelector('.add-to-cart-button').classList.add('button-orange');
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    updateCartCounter();
}); 