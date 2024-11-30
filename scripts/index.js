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
                        <button class="btn-agregar" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-description="${product.description}">
                            Agregar al carrito
                        </button>
                    </div>
                    <div class="modal-content" style="display: none;">
                        <h5>Detalles</h5>
                        <p>${product.description || "Sin descripción disponible"}</p>
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
    
    // Función para renderizar el slider de productos
    function renderSlider(products) {
        console.log("Renderizando slider de productos...");
        const sliderContainer = document.getElementById("slider-container");
    
        if (!Array.isArray(products) || products.length === 0) {
            sliderContainer.innerHTML = "<p>No hay productos disponibles para el slider.</p>";
            return;
        }
    
        const randomProducts = getRandomProducts(products, 5); // Mostrar 5 productos para el slider
    
        randomProducts.forEach((product, index) => {
            console.log("Producto en slider:", product);
            if (!product || !product.image || !product.name || !product.price) {
                console.warn("Producto inválido encontrado y omitido en el slider:", product);
                return;
            }
    
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card", "slider-item");
            if (index === 2) {
                productDiv.classList.add("active");
            } else if (index === 1 || index === 3) {
                productDiv.classList.add(index === 1 ? "left" : "right");
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

    // Función para seleccionar productos aleatorios para el slider
    function getRandomProducts(products, count) {
        const validProducts = products.filter(product => product && product.image && product.name && product.price);
        let randomProducts = [];
        let copiedProducts = [...validProducts];
    
        for (let i = 0; i < count && copiedProducts.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * copiedProducts.length);
            randomProducts.push(copiedProducts.splice(randomIndex, 1)[0]);
        }
    
        return randomProducts;
    }

    // Función para agregar productos al carrito
    function addProductCart(productId, price, name, description) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, description, quantity: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCartCount();
    }

    // Función para actualizar el contador de productos en el carrito
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalQuantity;
        }
    }

    // Llamada inicial para cargar los productos aprobados
    fetchApprovedProducts();
    updateCartCount();
});
