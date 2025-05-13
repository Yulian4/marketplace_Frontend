let currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || !currentUser.token) {
    console.error("No se encontró un usuario válido o el token está ausente.");
    return; 
}
async function fetchApprovedProducts(currentUser) {
    try {
        console.log("Cargando productos aprobados...");
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentUser.token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al cargar los productos aprobados");
        }

        const products = await response.json();
        console.log("Productos aprobados cargados:", products);
        return products;
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
}

function renderSlider(products) {
    const carouselInner = document.getElementById("carousel-inner");
    carouselInner.innerHTML = "";

    if (products.length === 0) {
        carouselInner.innerHTML = "<p>No hay productos disponibles para el slider.</p>";
        return;
    }

    const lastThreeProducts = products.slice(-3);

    lastThreeProducts.forEach((product, index) => {
        const slide = document.createElement("div");
        slide.classList.add("carousel-item");

        if (index === 0) slide.classList.add("active");

        slide.innerHTML = `
            <div class="col-4 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="../assets/images/products/${product.image}" alt="${product.name}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Precio: $${product.price}</p>
                        <button class="btn btn-secondary">Aprobar</button>
                        <button class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(slide);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const products = await fetchApprovedProducts();
        renderSlider(products);
    } catch (error) {
        console.error("Error al cargar el carrusel:", error);
    }
});
