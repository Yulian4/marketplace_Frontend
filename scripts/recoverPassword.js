document.addEventListener('DOMContentLoaded', function() {
    async function consultUser() {
        const username = document.getElementById('recover-username').value;
        const documentValue = document.getElementById('recover-document').value;  // Cambié el nombre para evitar conflicto con la palabra clave 'document'

        if (!username || !documentValue) {
            swal("Error", "Se requieren todos los campos.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/consult`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, documento: documentValue })
            });
            const data = await response.json();

            if (response.ok) {
                document.getElementById('question-section').style.display = 'block';
                document.getElementById('recover-question').value = data.question;
            } else {
                const errorMessage = data.message || "Usuario o documento incorrectos"
                console.log('Error:', errorMessage);
                swal.fire("Error", errorMessage, "error");
            }
        } catch (error) {
            console.log('Error al consultar la pregunta secreta:', error);
            swal("Error", "Error al consultar los datos del usuario.", "error");
        }
    }

    async function validateAnswer() {
        const username = document.getElementById('recover-username').value;
        const question = document.getElementById('recover-question').value;
        const answer = document.getElementById('recover-answer').value;
    
        if (!username || !question || !answer) {
            swal("Error", "Se requieren todos los campos.", "error");
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/auth/validate-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, question, answer })
            });
            const data = await response.json();
    
            if (response.ok) {
                document.getElementById('new-password-section').style.display = 'block';
            } else {
                swal.fire("Error", data.message || "Respuesta incorrecta.", "error");
            }
        } catch (error) {
            console.log('Error al validar la respuesta:', error);
            swal("Error", "Error al validar la respuesta.", "error");
        }
    }
    
    async function resetPassword() {
        const username = document.getElementById('recover-username').value
        const documento = document.getElementById('recover-document').value; // Asegúrate de capturar 'documento'
        const question = document.getElementById('recover-question').value;
        const answer = document.getElementById('recover-answer').value;
        const newPassword = document.getElementById('new-password').value;
        console.log(username)
    
        if (!username || !documento || !question || !answer || !newPassword) {
            Swal.fire("Error", "Todos los campos son requeridos.", "error");
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, documento, question, answer, newPassword })  // Asegúrate de enviar todos los campos
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Swal.fire("¡Contraseña restablecida!", "La contraseña ha sido actualizada correctamente.", "success")
                .then(() => {
                    window.location.href = './iniciarSesion.html';
                });
            } else {
                Swal.fire("Error", data.message || "Error al restablecer la contraseña.", "error");
            }
        } catch (error) {
            console.log('Error al restablecer la contraseña:', error);
            Swal.fire("Error", "Error al restablecer la contraseña.", "error");
        }
    }
    
    
    window.consultUser = consultUser;
    window.validateAnswer = validateAnswer;
    window.resetPassword = resetPassword;
});
