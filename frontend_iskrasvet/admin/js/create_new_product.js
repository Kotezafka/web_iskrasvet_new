import { createProduct, fetchProduct, updateProduct } from './api.js';

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.product-form');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    let oldImages = [];
    if (productId) {
        const product = await fetchProduct(productId);
        form.elements['name'].value = product.name;
        form.elements['description'].value = product.description;
        form.elements['price'].value = product.price;
        form.elements['stock_quantity'].value = product.stock_quantity;
        oldImages = product.images || [];
        if (oldImages.length > 0) {
            form.querySelector('.image-preview').innerHTML = `<img src="data:image/jpeg;base64,${oldImages[0]}" style="max-width:120px;max-height:120px;border-radius:6px;">`;
        }
    }
    form.elements['image'].addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                form.querySelector('.image-preview').innerHTML = `<img src="${e.target.result}" style="max-width:120px;max-height:120px;border-radius:6px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let images = oldImages;
        const file = form.elements['image'].files[0];
        if (file) {
            images = [await fileToBase64(file)];
        }
        const data = {
            name: form.elements['name'].value,
            description: form.elements['description'].value,
            price: parseFloat(form.elements['price'].value),
            stock_quantity: parseInt(form.elements['stock_quantity'].value),
            images
        };
        if (productId) {
            await updateProduct(productId, data);
        } else {
            await createProduct(data);
        }
        window.location.href = 'product_management.html';
    });
}); 