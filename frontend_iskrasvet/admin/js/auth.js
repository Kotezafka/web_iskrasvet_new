const AUTH_SERVICE_URL = 'http://localhost:5002/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        verifyToken(token);
    }
});

document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.querySelector('.error-message');
    
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUsername', data.username);
            window.location.href = 'main_page.html';
        } else {
            errorMessage.textContent = data.message || 'Ошибка входа';
        }
    } catch (error) {
        errorMessage.textContent = 'Ошибка соединения с сервером';
    }
});

async function verifyToken(token) {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            window.location.href = 'main_page.html';
        } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUsername');
        }
    } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
    }
} 