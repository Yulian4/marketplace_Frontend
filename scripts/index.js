document.addEventListener("DOMContentLoaded", function () {
    // URL actualizada para la ruta correcta de la API
    const apiUrl = "http://localhost:3000/api/products/approved-products";

    // Función para obtener los productos aprobados
    async function fetchApprovedProducts() {
        try {
            console.log("Cargando productos aprobados..."); // Mensaje de depuración
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer <tu-token-aqui>"  // Asegúrate de poner el token correcto
                }
            });

            if (!response.ok) {
                throw new Error("Error al cargar los productos aprobados");
            }

            const products = await response.json();
            console.log("Productos aprobados cargados:", products); // Ver el contenido de los productos

            renderProducts(products);
            renderSlider(products);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            document.getElementById("approved-products").innerHTML = 
             `<p style="color: red;">Error al cargar los productos aprobados: ${error.message}</p>`;
        }
    }

    // Función para renderizar los productos aprobados
    function renderProducts(products) {
        console.log("Renderizando productos aprobados...");
        const container = document.getElementById("approved-products");
    
        if (!Array.isArray(products) || products.length === 0) {
            container.innerHTML = "<p>No se han subido productos aún.</p>";
            return;
        }
    
        container.innerHTML = "";
    
        products.forEach(product => {
            console.log("Producto:", product);
            if (!product || !product.image || !product.name || !product.price) {
                console.warn("Producto inválido encontrado y omitido:", product);
                return;
            }
    
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");
            
            productDiv.innerHTML = `
                <div class="card">
                    <img src="assets/images/products/${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Precio: $${product.price}</p>
                        <a class="link" href="./templates/fichaProducto.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&image=${product.image}&description=${product.description}">
                        <button class="btn-mirarMas">Mira más</button>
                        </a>

                    </div>
                </div>`;
    
            container.appendChild(productDiv);
    
            // Eventos hover para mostrar/ocultar la descripción
            const productCard = productDiv.querySelector('.card');
            const modalContent = productDiv.querySelector('.modal-content');
    
            productCard.addEventListener('mouseenter', () => {
                modalContent.style.display = 'block'; // Mostrar la descripción
            });
    
            productCard.addEventListener('mouseleave', () => {
                modalContent.style.display = 'none'; // Ocultar la descripción
            });
        });
    }

    // Función para renderizar el slider de productos
    function renderSlider(products) {
        console.log("Renderizando slider de productos...");
        const sliderContainer = document.getElementById("slider-container");

        if (!Array.isArray(products) || products.length === 0) {
            sliderContainer.innerHTML = "<p>No hay productos disponibles para el slider.</p>";
            return;
        }

        // Obtener los tres últimos productos
        const lastThreeProducts = products.slice(-3); 
        lastThreeProducts.forEach((product, index) => {
            console.log("Producto en slider:", product);
            if (!product || !product.image || !product.name || !product.price) {
                console.warn("Producto inválido encontrado y omitido en el slider:", product);
                return;
            }

            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card", "slider-item");
            if (index === 1) {
                productDiv.classList.add("active");
            } else if (index === 0 || index === 2) {
                productDiv.classList.add(index === 0 ? "left" : "right");
            }
            productDiv.innerHTML = `
                <div class="card-slider">
                    <img src="assets/images/products/${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body-slider">
                        <h5 class="card-title-slider">${product.name}</h5>
                        <p class="card-text">Precio: $${product.price}</p>
                    </div>
                </div>`;

            sliderContainer.appendChild(productDiv);
        });

        startSlider();
    }

    // Función para manejar el slider de productos
    function startSlider() {
        console.log("Iniciando el slider de productos...");
        let currentIndex = 2;
        const items = document.querySelectorAll("#product-slider .slider-item");
        const totalItems = items.length;

        function updateSliderClasses() {
            items.forEach((item, index) => {
                item.classList.remove("active", "left", "right");
                if (index === currentIndex) {
                    item.classList.add("active");
                } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
                    item.classList.add("left");
                } else if (index === (currentIndex + 1) % totalItems) {
                    item.classList.add("right");
                }
            });
        }

        document.getElementById("prev").addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateSliderClasses();
        });

        document.getElementById("next").addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateSliderClasses();
        });

        updateSliderClasses();
    }

    document.getElementById('searchForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            window.location.href = `./templates/search.html?query=${encodeURIComponent(query)}`;
        }
    });

    // Llamada inicial para cargar los productos aprobados
    fetchApprovedProducts();
    updateCartCount();
});

document.addEventListener("DOMContentLoaded", () => {
    const scrollArrow = document.getElementById("scrollArrow");
    const novedadesSection = document.getElementById("slider"); // Sección de Novedades

    // Desplazar al apartado "Novedades" al hacer clic en la flecha
    scrollArrow.addEventListener("click", () => {
        novedadesSection.scrollIntoView({ behavior: "smooth" });
    });

    // Ocultar la flecha cuando se llega a "Novedades"
    window.addEventListener("scroll", () => {
        const sectionTop = novedadesSection.getBoundingClientRect().top;
        if (sectionTop <= window.innerHeight / 2) {
            scrollArrow.classList.add("hidden");
        } else {
            scrollArrow.classList.remove("hidden");
        }
    });
});   

// Cambios Valentina (redirección botón para pago)
const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", () => {
  window.location.href = "../marketplace/templates/pagos/formulario.html";
});
