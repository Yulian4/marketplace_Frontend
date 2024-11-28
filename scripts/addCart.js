document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const cartModalElement = document.getElementById('cartModal');
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

    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
        } else {
            cartItems.forEach(item => {
                const productImage = item.image ? `assets/images/products/${item.image}` : 'assets/images/products/Captura.PNG'; // Imagen predeterminada
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
            totalContainer.innerHTML = `<h4>Total a Pagar: $${total.toFixed(2)}</h4>`;
        }
    }

    // Función para eliminar un producto del carrito
    window.removeFromCart = function (productId) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Filtra el carrito para eliminar el producto con el id especificado
        carrito = carrito.filter(item => item.id !== productId);
        // Guarda el carrito actualizado en localStorage
        if (carrito.length === 0) {
            localStorage.removeItem('carrito');
        } else {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        }
        // Actualiza la vista del carrito
        updateCart();
        // Actualiza el contador de productos en el carrito
        updateCartCount();
    };
    localStorage.getItem('carrito');


    // Función para actualizar la cantidad de un producto
    window.updateQuantity = function (productId, change) {
        console.log(`Actualizar cantidad del producto con ID ${productId}, cambio: ${change}`);
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const product = carrito.find(item => item.id == productId);

        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                // Si la cantidad es 0 o menor, elimina el producto del carrito
                removeFromCart(productId);
            } else {
                // Si la cantidad es válida, actualiza el carrito en localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
                updateCart();
                updateCartCount();
            }
        } else {
            console.error(`Producto con ID ${productId} no encontrado en el carrito.`);
        }
    };

    // Función para actualizar el contador de productos en el carrito
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carrito')) || [];
        console.log("Contenido del carrito:", cart);
        const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
        console.log("Cantidad total de productos en el carrito:", totalQuantity);

        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalQuantity;
        } else {
            console.error("No se encontró el elemento 'contador-carrito' en el DOM.");
        }
    }

    
    // Agregar producto al carrito
    function addProductCart(productId, price, name, description) {
        // console.log("Agregando producto al carrito..."); // Mensaje de depuración
         let cart = JSON.parse(localStorage.getItem('carrito')) || [];
         //console.log("Carrito actual:", cart); // Ver el carrito antes de agregar el producto
     
         const existingProduct = cart.find(item => item.id === Number(productId));
 
         if (existingProduct) {
             console.log("Producto ya está en el carrito. Incrementando cantidad.");
             existingProduct.quantity += 1;
         } else {
             cart.push({ id: productId, name, price, description, quantity: 1 });
             //console.log("Producto agregado al carrito:", { id: productId, name, price, description });
         }
 
         localStorage.setItem('carrito', JSON.stringify(cart));
          updateCartCount();
    };
    updateCartCount();
});
    
     localStorage.getItem('carrito');
     console.log("contenido del localStorage:",localStorage.getItem(`carrito`));
     // Actualizar el contador de productos en el carrito
     function updateCartCount() {
         const cart = JSON.parse(localStorage.getItem('carrito')) || [];
         const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
     
         console.log("Cantidad total de productos en el carrito:", totalQuantity);  // Para verificar el valor total
     
         const contadorCarrito = document.getElementById('contador-carrito');
         if (contadorCarrito) {
             contadorCarrito.textContent = totalQuantity;
         } else {
             console.error("No se encontró el elemento 'contador-carrito' en el DOM.");
         }
     }
     
    // Llamada inicial para actualizar el carrito y el contador
    fetchApprovedProducts();
    updateCartCount();
