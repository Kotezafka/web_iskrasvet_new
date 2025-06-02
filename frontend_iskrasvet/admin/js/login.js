document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8004/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': username,
                'password': password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('adminToken', data.access_token);
            window.location.href = 'main_page.html';
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка при попытке входа');
    }
}); 