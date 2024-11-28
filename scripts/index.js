document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:3000/api/products/approved-products";

    async function fetchApprovedProducts() {
        try {
            console.log("Cargando productos aprobados..."); // Mensaje de depuración
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer <tu-token-aqui>"
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
            
            // Aquí estamos añadiendo un contenedor para la descripción
            productDiv.innerHTML = `
                <div class="card">
                    <img src="assets/images/products/${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Precio: $${product.price}</p>
                        <button class="btn-agregar" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-description="${product.description}">
                            Agregar al carrito
                        </button>
                    </div>
                    <!-- Modal o div de descripción que se ocultará por defecto -->
                    <div class="modal-content" style="display: none;">
                        <h5>Detalles</h5>
                        <p>${product.description || "Sin descripción disponible"}</p>
                    </div>
                </div>`;
    
            container.appendChild(productDiv);
    
            // Agregar eventos hover para mostrar/ocultar la descripción
            const productCard = productDiv.querySelector('.card');
            const modalContent = productDiv.querySelector('.modal-content');
    
            productCard.addEventListener('mouseenter', () => {
                modalContent.style.display = 'block'; // Mostrar la descripción
            });
    
            productCard.addEventListener('mouseleave', () => {
                modalContent.style.display = 'none'; // Ocultar la descripción
            });
        });
    
        // Asignar el evento a los botones "Agregar al carrito"
        const botonesAgregar = document.querySelectorAll('.btn-agregar');
        botonesAgregar.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                const productPrice = this.dataset.price;
                const productDescription = this.dataset.description;
                    
                console.log("Producto a agregar al carrito:", productId, productName, productPrice, productDescription);
                addProductCart(productId, productPrice, productName, productDescription);
            });
        });
    }
    
    function renderSlider(products) {
        console.log("Renderizando slider de productos..."); // Mensaje de depuración
        const sliderContainer = document.getElementById("product-slider");
    
        if (!Array.isArray(products) || products.length === 0) {
            sliderContainer.innerHTML = "<p>No hay productos disponibles para el slider.</p>";
            return;
        }
    
        const randomProducts = getRandomProducts(products, 3);
    
        randomProducts.forEach(product => {
            console.log("Producto en slider:", product); // Ver los productos seleccionados para el slider
            if (!product || !product.image || !product.name || !product.price) {
                console.warn("Producto inválido encontrado y omitido en el slider:", product);
                return;
            }
    
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card", "slider-item");
            productDiv.innerHTML = 
                `<div class="card-slider">
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

    function getRandomProducts(products, count) {
        console.log("Seleccionando productos aleatorios para el slider..."); // Mensaje de depuración
        const validProducts = products.filter(product => product && product.image && product.name && product.price);
        console.log("Productos válidos para el slider:", validProducts); // Ver los productos válidos

        let randomProducts = [];
        let copiedProducts = [...validProducts];
    
        for (let i = 0; i < count && copiedProducts.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * copiedProducts.length);
            randomProducts.push(copiedProducts.splice(randomIndex, 1)[0]);
        }
    
        console.log("Productos aleatorios seleccionados:", randomProducts); // Ver los productos aleatorios seleccionados
        return randomProducts;
    }

    function startSlider() {
        console.log("Iniciando el slider de productos..."); // Mensaje de depuración
        let currentIndex = 0;
        const items = document.querySelectorAll("#product-slider .slider-item");
        const totalItems = items.length;

        setInterval(() => {
            items[currentIndex].style.display = "none"; 
            currentIndex = (currentIndex + 1) % totalItems; 
            items[currentIndex].style.display = "block"; 
        }, 3500); 
    };


    fetchApprovedProducts();
    updateCartCount();
});
