const API_URL = 'http://localhost:3000/api/products/add-product';

// Obtén el usuario actual desde el localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const fileInput = document.getElementById('product-image');

    if (!name || !description || !price || !fileInput.files.length) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('user', currentUser.username);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`, 
            },
            body: formData,
        });

        if (response.ok) {
            alert('Producto agregado. Esperando aprobación del administrador.');
            window.location.href = './usuario.html';
        } else {
            const data = await response.json();
            alert(data.message || 'Error al agregar producto.');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar producto.');
    }
}


const formulario = document.getElementById('form-addProduct');
formulario.addEventListener('submit', addProduct);


const fileInput = document.getElementById('product-image');
const defaultImage = document.querySelector('.image-upload-icon');


fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            defaultImage.src = e.target.result;  
            defaultImage.style.opacity = 1; 
        };
        reader.readAsDataURL(file);
    }
});
