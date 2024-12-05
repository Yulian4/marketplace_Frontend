async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const userDocument = document.getElementById('reg-document').value; 
    const question = document.getElementById('reg-question').value;
    const answer = document.getElementById('reg-answer').value;

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Document:", userDocument);
    console.log("Question:", question);
    console.log("Answer:", answer);

    if (!username || !password || !userDocument || !question || !answer) {
        swal("Error", "Se requieren todos los campos.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, documento: userDocument, question, answer }) // Asegúrate de enviar todos los campos necesarios
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
