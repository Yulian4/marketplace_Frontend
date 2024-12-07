const API_URL = "http://localhost:3000/api/products/"; // URL base de la API
let currentUser = JSON.parse(localStorage.getItem("currentUser")); // Recuperamos el usuario actual desde el localStorage

// Función para renderizar el carrusel de productos pendientes
function renderAdminCarousel(products, targetId) {
    const carouselInner = document.getElementById(targetId); // Elemento donde se cargarán las tarjetas
    carouselInner.innerHTML = ""; // Limpiar contenido previo del carrusel

    // Si no hay productos, mostramos un mensaje de "sin productos"
    if (products.length === 0) {
        carouselInner.innerHTML = "<p class='text-center'>No hay productos pendientes para aprobar.</p>";
        return;
    }

    // Iteramos sobre los productos para crear las tarjetas en el carrusel
    products.forEach((product, index) => {
        const slide = document.createElement("div");
        slide.classList.add("carousel-item", index === 0 ? "active" : ""); // La primera tarjeta debe ser "active"

        slide.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="card" style="width: 18rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    <img src="${product.image}" alt="${product.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-warning" onclick="approveProduct(${product.id})">Aprobar</button>
                        <button class="btn btn-danger" onclick="declineProduct(${product.id})">Rechazar</button>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(slide); // Agregar el slide al carrusel
    });
}


// Función para cargar los productos pendientes desde la API
// Función para renderizar el carrusel de productos pendientes
function renderAdminCarousel(products, targetId) {
    const carouselInner = document.getElementById(targetId); // Elemento donde se cargarán las tarjetas
    carouselInner.innerHTML = ""; // Limpiar contenido previo del carrusel

    // Si no hay productos, mostramos un mensaje de "sin productos"
    if (products.length === 0) {
        carouselInner.innerHTML = "<p class='text-center'>No hay productos pendientes para aprobar.</p>";
        return;
    }

    // Iteramos sobre los productos para crear las tarjetas en el carrusel
    products.forEach((product, index) => {
        let cardHtml2 = cardHtml; // Usar el HTML base de la tarjeta

        // Reemplazar las partes de la tarjeta con los datos del producto
        cardHtml2 = cardHtml2.replace("{0}", product.image);
        cardHtml2 = cardHtml2.replace("{1}", product.name);
        cardHtml2 = cardHtml2.replace("{2}", product.price);
        cardHtml2 = cardHtml2.replace("{4}", product.id);

        // Condiciones para cambiar el estado del producto
        if (product.status === 'Pendiente') {
            cardHtml2 = cardHtml2.replace("{3}", 'Aprobar'); // Botón de aprobación
            cardHtml2 = cardHtml2.replace("{status}", 'warning'); // Clase de estado "warning"
        } else if (product.status === 'Aprobado') {
            cardHtml2 = cardHtml2.replace("{3}", 'Aprobado'); // Botón de estado aprobado
            cardHtml2 = cardHtml2.replace("{status}", 'success'); // Clase de estado "success"
        } else if (product.status === 'Rechazado') {
            cardHtml2 = cardHtml2.replace("{3}", 'Rechazado'); // Botón de estado rechazado
            cardHtml2 = cardHtml2.replace("{status}", 'danger'); // Clase de estado "danger"
        }

        // Crear el slide y agregarlo al carrusel
        const slide = document.createElement("div");
        slide.classList.add("carousel-item", index === 0 ? "active" : ""); // La primera tarjeta debe ser "active"

        slide.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="card" style="width: 18rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    <img src="${product.image}" alt="${product.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-${product.status === 'Pendiente' ? 'warning' : product.status === 'Aprobado' ? 'success' : 'danger'}" onclick="approveProduct(${product.id})">${product.status === 'Pendiente' ? 'Aprobar' : product.status}</button>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(slide); // Agregar el slide al carrusel
    });
}


// Función para aprobar un producto
async function approveProduct(productId) {
    try {
        // Hacemos la solicitud PUT para aprobar el producto
        const response = await fetch(`${API_URL}approve-product/${productId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.ok) throw new Error("Error al aprobar producto");

        swal("¡Hecho!", "Producto aprobado exitosamente.", "success"); // Mostramos un mensaje de éxito
        renderAdminProducts(); // Recargamos los productos para mostrar los cambios
    } catch (error) {
        console.error("Error al aprobar producto:", error);
        swal("Error", "No se pudo aprobar el producto.", "error"); // Mostramos un mensaje de error si algo falla
    }
}

// Función para rechazar un producto
async function declineProduct(productId) {
    try {
        // Hacemos la solicitud PUT para rechazar el producto
        const response = await fetch(`${API_URL}reject-product/${productId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.ok) throw new Error("Error al rechazar producto");

        swal("¡Hecho!", "Producto rechazado exitosamente.", "success"); 
        renderAdminProducts(); 
    } catch (error) {
        console.error("Error al rechazar producto:", error);
        swal("Error", "No se pudo rechazar el producto.", "error"); 
    }
}


document.addEventListener("DOMContentLoaded", renderAdminProducts);
