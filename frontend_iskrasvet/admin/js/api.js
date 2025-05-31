const API_BASE_URL = 'http://localhost:3000';

// --- ТОВАРЫ ---
export async function fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    return await response.json();
}

export async function fetchProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Ошибка загрузки товара');
    return await response.json();
}

export async function createProduct(product) {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Ошибка создания товара');
    return await response.json();
}

export async function updateProduct(id, product) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Ошибка обновления товара');
    return await response.json();
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Ошибка удаления товара');
    return true;
}

// --- ЗАКАЗЫ ---
export async function fetchOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Ошибка загрузки заказов');
    return await response.json();
}

export async function fetchOrder(id) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Ошибка загрузки заказа');
    return await response.json();
}

export async function updateOrderStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Ошибка обновления статуса заказа');
    return await response.json();
} 