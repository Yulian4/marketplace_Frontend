let currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || !currentUser.token) {
    console.error("Token no encontrado o no válido");
    window.location.href = "/login"; 
} else {
    console.log("Usuario autenticado correctamente");
}

const apiEndpoint = 'http://localhost:3000/api/products/';

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');  
    window.location.href = "/login"; 
}

// Función para cargar productos pendientes
async function fetchPendingProducts() {
    try {
        console.log("Cargando productos pendientes...");
        const response = await fetch(`${apiEndpoint}pending-products`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentUser.token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al cargar los productos pendientes");
        }

        const products = await response.json();
        console.log("Productos pendientes cargados:", products);
        renderAdminCarousel(products, "admin-products");
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        swal("Error", "No se pudo cargar los productos pendientes", "error");
    }
}

// Función para renderizar el carrusel de productos pendientes
function renderAdminCarousel(products, targetId) {
    const carouselInner = document.getElementById(targetId);
    carouselInner.innerHTML = ""; 

    // "sin productos"
    if (products.length === 0) {
        carouselInner.innerHTML = "<p class='text-center'>No hay productos pendientes para aprobar.</p>";
        return;
    }

    // crear las tarjetas en el carrusel
    products.forEach((product, index) => {
        const slide = document.createElement("div");
        slide.classList.add("carousel-item", index === 0 ? "active" : ""); 

        slide.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="card" style="width: 18rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    <!-- Asegúrate de que la imagen esté bien referenciada -->
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
        carouselInner.appendChild(slide);
    });
}


    // crear las tarjetas en el carrusel
    products.forEach((product, index) => {
        const slide = document.createElement("div");
        slide.classList.add("carousel-item", index === 0 ? "active" : ""); 

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
        carouselInner.appendChild(slide); 
})

// Función para aprobar un producto
async function approveProduct(productId) {
    try {
        const response = await fetch(`${apiEndpoint}approve-product/${productId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.ok) throw new Error("Error al aprobar producto");

        swal("¡Hecho!", "Producto aprobado exitosamente.", "success");
        fetchPendingProducts(); 
    } catch (error) {
        console.error("Error al aprobar producto:", error);
        swal("Error", "No se pudo aprobar el producto.", "error");
    }
}

// Función para rechazar un producto
async function declineProduct(productId) {
    try {
        const response = await fetch(`${apiEndpoint}reject-product/${productId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.ok) throw new Error("Error al rechazar producto");

        swal("¡Hecho!", "Producto rechazado exitosamente.", "success");
        fetchPendingProducts(); 
    } catch (error) {
        console.error("Error al rechazar producto:", error);
        swal("Error", "No se pudo rechazar el producto.", "error");
    }
}

document.addEventListener("DOMContentLoaded", fetchPendingProducts);
