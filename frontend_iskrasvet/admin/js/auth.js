async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        const response = await fetch('http://localhost:8004/users/me/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        return true;
    } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
        return false;
    }
}

async function logout() {
    try {
        const token = localStorage.getItem('adminToken');
        await fetch('http://localhost:8004/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    } finally {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}); 