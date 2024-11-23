let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor completa todos los campos.uuuu');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            currentUser = { ...data.user, token: data.token };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            if (currentUser.role === 'user') 
                window.location.href = './usuario.html';
            else
                window.location.href = './administrador.html';

        } else {
            alert(data.message || 'Error al iniciar sesión.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión.');
    }
}