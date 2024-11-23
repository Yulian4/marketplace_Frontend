let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function addProduct(event) {
    event.preventDefault();
    console.log(event);
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    console.log(name, description, price);

    if (!name || !description || !price) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const formData = new FormData();

    formData.append("file", event.target[0].files[0]);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    try {
        const response = await fetch(`${API_URL}/api/products/add-product`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
            // body: JSON.stringify({ name, description, price }),
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

formulario.addEventListener("submit", (event)=>{
    addProduct(event);
});