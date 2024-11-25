let currentUser = JSON.parse(localStorage.getItem('currentUser'));
async function register() {
    const username = document.getElementById('reg-username').value
    const password = document.getElementById('reg-password').value
   
    if(!username || !password){
        alert('Se requiere todos los campos.');
        return;
    };

    try{
        const response = await fetch(`${API_URL}/auth/register`,{
            method:'POST', 
            headers:{'content-Type':'application/JSON'},
            body:JSON.stringify({username, password})
        });
        const data = await response.json();
    
        if(response.ok){
            alert('Registro de usuario exitoso.')
            window.location.href = './iniciarSesion.html'
        }else{
            alert(data.message || 'Error al registrar el usuario. Intentelo de nuevo.');
        };
    }   
    catch(error){
        console.log('Error al registrar el usuario', error);
        alert('error al registrar ususario');
    };
};
