const API_URL = 'http://localhost:3000/api/products/add-product';

// Obtén el usuario actual desde el localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('Usuario actual:', currentUser);

async function addProduct(event) {
    event.preventDefault();
    console.log('Formulario enviado');

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const fileInput = document.getElementById('product-image');

    console.log('Nombre del producto:', name);
    console.log('Descripción del producto:', description);
    console.log('Precio del producto:', price);
    console.log('Archivo seleccionado:', fileInput.files.length);

    if (!name || !description || !price || !fileInput.files.length) {
        swal('Por favor completa todos los campos.', 'Todos los datos son necesarios', 'info');
        console.log('Faltan datos en el formulario');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('user', currentUser.username);

    console.log('Datos del FormData:', formData);

    try {
        console.log('Enviando solicitud al servidor...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
            },
            body: formData,
        });

        console.log('Respuesta del servidor:', response);

        if (response.ok) {
            console.log('Producto agregado exitosamente');
            swal('Producto agregado.', 'Será revisado por el administrador antes de ser publicado', 'success')
            .then(() => {
                window.location.href = "./agregarProductos.html";
            });
        } else {
            const data = await response.json();
            console.log('Error al agregar producto:', data);
            swal(data.message || 'Algo salió mal', 'Error al agregar producto.', 'error');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        swal('Algo salió mal', 'Error al agregar producto.', 'error');
    }
}

const formulario = document.getElementById('form-addProduct');
formulario.addEventListener('submit', addProduct);

const fileInput = document.getElementById('product-image');
const defaultImage = document.querySelector('.image-upload-icon');

fileInput.addEventListener('change', function(event) {
    console.log('Archivo seleccionado para vista previa:', event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            defaultImage.src = e.target.result;
            defaultImage.style.opacity = 1;
            console.log('Vista previa de la imagen cargada:', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});
