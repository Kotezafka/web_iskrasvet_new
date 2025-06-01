const AUTH_SERVICE_URL = 'http://localhost:5002/api/auth';

export async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'auth_page.html';
        return false;
    }

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUsername');
            window.location.href = 'auth_page.html';
            return false;
        }
        return true;
    } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        window.location.href = 'auth_page.html';
        return false;
    }
}

export function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'auth_page.html';
} 