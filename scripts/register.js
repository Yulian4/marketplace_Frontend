let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
            showLoginForm();
        } else {
            alert(data.message || 'Error al registrar usuario.');
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario.');
    }
}