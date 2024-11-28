document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const cartModalElement = document.getElementById('cart-Modal');
    const totalContainer = document.getElementById('total-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const apiUrl = "http://localhost:3000/api/products/approved-products";

    if (!cartIcon || !cartModalElement) {
        console.error('El ícono del carrito o el modal no se encuentran en el DOM.');
        return;
    }

    const cartModal = new bootstrap.Modal(cartModalElement);

    cartIcon.addEventListener('click', function () {
        updateCart();
        cartModal.show();
    });

    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            cartModal.hide();
        });
    } else {
        console.error('El botón de cerrar del modal no se encontró.');
    }

    async function fetchApprovedProducts() {
        try {
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
            renderProducts(products);
            renderSlider(products);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            document.getElementById("approved-products").innerHTML = 
                <p style="color: red;">Error al cargar los productos aprobados: ${error.message}</p>;
        }
    }

    function renderProducts(products) {
        const container = document.getElementById("approved-products");
        if (!Array.isArray(products) || products.length === 0) {
            container.innerHTML = "<p>No se han subido productos aún.</p>";
            return;
        }

        container.innerHTML = "";
        products.forEach(product => {
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
                </div>`;

            container.appendChild(productDiv);
        });

        document.querySelectorAll('.btn-agregar').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                const productPrice = this.dataset.price;
                const productDescription = this.dataset.description;
                addProductCart(productId, productPrice, productName, productDescription);
            });
        });
    }

    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
        } else {
            cartItems.forEach(item => {
                const productImage = item.image ? `assets/images/products/${item.image}` : 'assets/images/default.png'; // Imagen predeterminada
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="${productImage}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="cart-item-img">
                        <div>${item.name} - $${item.price} x ${item.quantity}</div>
                        <div> 
                            <button class="btn btn-warning" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <span> x ${item.quantity}</span>
                            <button class="btn btn-danger" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Eliminar</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
        }

        if (totalContainer) {
            totalContainer.innerHTML = <h4>Total a Pagar: $${total.toFixed(2)}</h4>;
        }
    }

    window.removeFromCart = function (productId) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito = carrito.filter(item => item.id !== productId);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        updateCart();
        updateCartCount();
    };

    window.updateQuantity = function (productId, change) {
        console.log(`Actualizar cantidad del producto con ID ${productId}, cambio:${change}`);
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const product = carrito.find(item => item.id === Number(productId));
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                removeFromCart(productId);
            } else {
                localStorage.setItem('carrito', JSON.stringify(carrito));
                updateCart();
                updateCartCount();
            }
        } else {
            console.error(`Producto con ID ${productId} no encontrado en el carrito.`);
        }
    };

    function addProductCart(productId, price, name, description) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const existingProduct = cart.find(item => item.id === Number(productId));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, description, quantity: 1 });
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalQuantity;
        }
    }

    fetchApprovedProducts();
    updateCartCount();
});