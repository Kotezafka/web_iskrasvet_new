const API_BASE_URL = 'http://localhost:3000';

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products.map(product => ({
            id: product.id,
            title: product.name,
            description: product.description,
            price: `${product.price.toLocaleString('ru-RU')} руб`,
            stock: product.stock_quantity,
            image: product.images && product.images.length > 0 
                ? `data:image/jpeg;base64,${product.images[0]}`
                : null
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const product = await response.json();
        return {
            id: product.id,
            title: product.name,
            description: product.description,
            price: `${product.price.toLocaleString('ru-RU')} руб`,
            stock: product.stock_quantity,
            image: product.images && product.images.length > 0 
                ? `data:image/jpeg;base64,${product.images[0]}`
                : null
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
} 