document.addEventListener('DOMContentLoaded', function () {
    // Elementos del carrito
    const cartIcon = document.getElementById('cart-icon');
    const cartModalElement = document.getElementById('cartModal');
    const totalContainer = document.getElementById('total-container');
    const cartItemsContainer = document.getElementById('cart-items');
    
    // API donde se obtienen los productos
    const apiUrl = "http://localhost:3000/api/products/approved-products";

    // Verificar que los elementos del carrito existen en el DOM
    if (!cartIcon || !cartModalElement) {
        console.error('El ícono del carrito o el modal no se encuentran en el DOM.');
        return;
    }

    // Mostrar el modal del carrito cuando se hace click en el ícono
    const cartModal = new bootstrap.Modal(cartModalElement);
    cartIcon.addEventListener('click', function () {
        updateCart();
        cartModal.show();
    });

    // Cerrar el modal
    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            cartModal.hide();
        });
    } else {
        console.error('El botón de cerrar del modal no se encontró.');
    }

    // Limpiar el carrito
    window.clearCart = function clearCart() {
        localStorage.removeItem('carrito');
        updateCart();
        updateCartCount();
    };

    // Función para agregar productos al carrito
    window.addProductCart = function addProductCart(productId, price, name, description) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, description, quantity: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCart();
        updateCartCount();
    };

    // Función para actualizar el carrito (mostrar productos y total)
    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
        cartItemsContainer.innerHTML = '';
        totalContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
            totalContainer.innerHTML = "<p>Total a Pagar: $0.00</p>";
        } else {
            let total = 0;
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                // Verificación de imagen
                const imageUrl = item.image ? `../assets/images/products/${item.image}` : '../assets/images/1684885584_1769090_500x.jpg';

                cartItemDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="cart-item-img">
                        <div>${item.name} - $${item.price} x ${item.quantity}</div>
                        <button class="btn btn-warning" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <span> x ${item.quantity}</span>
                        <button class="btn btn-danger" onclick="updateQuantity('${item.id}', -1)">-</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity; // Sumar el total correctamente
            });
            totalContainer.innerHTML = ` <h4>Total a Pagar: $${total.toFixed(2)}</h4>`; // Mostrar el total con dos decimales
        }
    }

    // Función para actualizar la cantidad de un producto
    window.updateQuantity = function (productId, change) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const product = cart.find(item => item.id === productId);

        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                // Si la cantidad es 0 o menor, elimina el producto del carrito
                removeFromCart(productId);
            } else {
                localStorage.setItem('carrito', JSON.stringify(cart));
                updateCart();
                updateCartCount();
            }
        }
    };

    // Función para eliminar un producto del carrito
    window.removeFromCart = function (productId) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCart();
        updateCartCount();
    };

    // Actualiza el contador del carrito
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalQuantity;
        }
    }

    // Función para obtener productos de la API y mostrarlos
    
function fetchApprovedProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-list');
            if (!productContainer) {
                console.error('Contenedor de productos no encontrado en el DOM.');
                return;
            }

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product-item');
                productDiv.innerHTML = `
                    <img src="${product.image ? ` assets/images/products/${product.image}` : 'assets/images/logo.png'}" alt="${product.name}" class="product-img">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="btn btn-primary" onclick="addProductCart('${product.id}', ${product.price}, '${product.name}', '${product.description}')">Agregar al carrito</button>
                `;
                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

    // Llamar a la función de cargar productos desde la API
    fetchApprovedProducts();
    updateCartCount();
});