
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        swal("Error", "Por favor completa todos los campos.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.status === 200) {
            currentUser = { ...data.user, token: data.token };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            swal("¡Inicio de sesión exitoso!", "Bienvenido", "success", { button: "Aceptar" })
            .then((willRedirect) => {
                if (willRedirect) {
                    if (currentUser.role === 'user') 
                        window.location.href = './usuario.html';
                    else
                        window.location.href = './administrador.html';
                }
            });
        } else {
            swal("Error", data.message || "Error al iniciar sesión.", "error");
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        swal("Error", "Error al iniciar sesión.", "error");
    }
}
