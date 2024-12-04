
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        swal("Error", "Se requieren todos los campos.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
        
            swal("¡Registro exitoso! Ahora inicia sesión", "Usuario registrado correctamente.", "success", { button: "Aceptar" })
            .then((willRedirect) => {
                if (willRedirect) {
                    window.location.href = './iniciarSesion.html';
                }
            });
        } else {
            swal("Error", data.message || "Error al registrar el usuario. Inténtelo de nuevo.", "error");
        }
    } catch (error) {
        console.log('Error al registrar el usuario:', error);
        swal("Error", "Error al registrar el usuario.", "error");
    }
}
