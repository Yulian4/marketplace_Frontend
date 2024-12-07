// Obtén el usuario actual del almacenamiento local
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Función para obtener los productos del usuario desde la API
async function obtenerProductos() {
    if (!currentUser || !currentUser.token) {
        console.error("Usuario no autenticado");
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/api/products/user-products`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Retornamos los productos correctamente
        } else {
            console.error('Error al obtener los productos', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud de productos:', error);
        return [];
    }
}

// Función para cargar el carrusel con productos
async function cargarCarrusel() {
    const productos = await obtenerProductos();  // Obtener productos
    const carouselInner = document.getElementById('carousel-inner');

    // Si no hay productos, mostramos un mensaje
    if (productos.length === 0) {
        carouselInner.innerHTML = "<p>No tienes productos para mostrar.</p>";
        return;
    }

    // Limpiamos el contenido anterior
    carouselInner.innerHTML = '';

    // Recorremos los productos y agregamos los items al carrusel
    productos.forEach((producto, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');

        // Si es el primer producto, lo marcamos como 'active'
        if (index === 0) {
            item.classList.add('active');
        }

        // Estructura de la tarjeta del producto en el carrusel
        item.innerHTML = `
            <div class="product-card">
                <img src="${producto.image}" alt="${producto.name}" class="d-block w-100">
                <div class="card-body">
                    <h5 class="card-title">${producto.name}</h5>
                    <p class="card-text">$${producto.price}</p>
                    <!-- Botón Aprobado -->
                    <button class="btn btn-success m-1" onclick="approveProduct('${producto.id}')">Aprobado</button>
                    <!-- Botón Eliminar -->
                    <button class="btn btn-danger m-1" onclick="deleteProduct('${producto.id}')">Eliminar</button>
                </div>
            </div>
        `;

        // Agregar el item al carrusel
        carouselInner.appendChild(item);
    });
}


// Función para mostrar la información del usuario
function renderUserSection() {
    if (currentUser) {
        document.getElementById('user-name').innerText = currentUser.username;
        cargarCarrusel(); // Llamamos a la función que carga los productos
    } else {
        alert("No estás autenticado.");
    }
}

// Función para cerrar sesión
async function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = './iniciarSesion.html';
}

// Llamamos a la función para cargar la sección de usuario cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", renderUserSection);


// Función para obtener los productos del usuario desde la API
async function obtenerProductosAdmin() {
    if (!currentUser || !currentUser.token) {
        console.error("Usuario no autenticado");
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/api/products/admin-products`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Retornamos los productos correctamente
        } else {
            console.error('Error al obtener los productos', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud de productos:', error);
        return [];
    }
}

// Función para cargar el carrusel con productos pendientes
async function cargarCarruselAdmin() {
    const productos = await obtenerProductosAdmin();  // Obtener productos
    const carouselInner = document.getElementById('carousel-inner');

    // Si no hay productos, mostramos un mensaje
    if (productos.length === 0) {
        carouselInner.innerHTML = "<p>No hay productos pendientes para aprobar.</p>";
        return;
    }

    // Limpiamos el contenido anterior
    carouselInner.innerHTML = '';

    // Recorremos los productos y agregamos los items al carrusel
    productos.forEach((producto, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');

        // Si es el primer producto, lo marcamos como 'active'
        if (index === 0) {
            item.classList.add('active');
        }

        // Estructura de la tarjeta del producto en el carrusel
        item.innerHTML = `
            <div class="product-card">
                <img src="${producto.image}" alt="${producto.name}" class="d-block w-100">
                <div class="card-body">
                    <h5 class="card-title">${producto.name}</h5>
                    <p class="card-text">$${producto.price}</p>
                    <!-- Botón Aprobado -->
                    <button class="btn btn-success m-1" onclick="approveProduct('${producto.id}')">Aprobar</button>
                    <!-- Botón Rechazado -->
                    <button class="btn btn-danger m-1" onclick="declineProduct('${producto.id}')">Rechazar</button>
                </div>
            </div>
        `;

        // Agregar el item al carrusel
        carouselInner.appendChild(item);
    });
}

// Función para mostrar la información del administrador
function renderAdminSection() {
    if (currentUser) {
        document.getElementById('admin-name').innerText = currentUser.username;
        cargarCarruselAdmin(); // Llamamos a la función que carga los productos pendientes en el carrusel
    } else {
        alert("No estás autenticado.");
    }
}

// Función para cerrar sesión
async function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = './iniciarSesion.html';
}

// Función para aprobar un producto
async function approveProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/approve-product/${productId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        if (response.ok) {
            swal('¡Hecho!', 'Producto aprobado exitosamente.', 'success');
            cargarCarruselAdmin();  // Recarga el carrusel después de aprobar
        } else {
            const data = await response.json();
            swal(data.message || 'Algo salió mal', 'Error al aprobar producto.', 'error');
        }
    } catch (error) {
        console.error('Error al aprobar producto:', error);
        swal('Algo salió mal', 'Error al aprobar producto.', 'error');
    }
}

// Función para rechazar un producto
async function declineProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/reject-product/${productId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        if (response.ok) {
            swal('¡Hecho!', 'Producto rechazado exitosamente.', 'success');
            cargarCarruselAdmin();  // Recarga el carrusel después de rechazar
        } else {
            const data = await response.json();
            swal(data.message || 'Algo salió mal', 'Error al rechazar producto.', 'error');
        }
    } catch (error) {
        console.error('Error al rechazar producto:', error);
        swal('Algo salió mal', 'Error al rechazar producto.', 'error');
    }
}

// Llamamos a la función para cargar la sección de administrador cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", renderAdminSection);
