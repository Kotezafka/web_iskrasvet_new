const API_URL = 'http://localhost:5000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            
            window.location.href = 'main_page.html';
        } else {
            errorMessage.textContent = data.message || 'Ошибка входа';
        }
    } catch (error) {
        errorMessage.textContent = 'Ошибка соединения с сервером';
    }
}); 