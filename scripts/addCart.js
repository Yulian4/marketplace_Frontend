document.addEventListener('DOMContentLoaded', function() {
    renderCart();
});

// Renderiza los productos del carrito
function renderCart() {
    console.log("Renderizando el carrito..."); // Mensaje de depuración
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log("Contenido actual del carrito:", carrito); // Ver el carrito antes de renderizar

    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = ''; // Limpiamos el carrito actual

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p>El carrito está vacío</p>';
        console.log("El carrito está vacío."); // Mensaje de depuración
        return;
    }

    carrito.forEach(product => {
        console.log("Producto en el carrito:", product); // Ver cada producto en el carrito
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-in-cart');
        productDiv.innerHTML = 
            `<div class="d-flex justify-content-between align-items-center">
                <div>${product.name} - $${product.price}</div>
                <div>
                    <button class="btn btn-warning" onclick="updateQuantity(${product.id}, 1)">+</button>
                    <span> x ${product.quantity}</span>
                    <button class="btn btn-danger" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <button class="btn btn-danger" onclick="removeFromCart(${product.id})">Eliminar</button>
                </div>
            </div>`;
        carritoDiv.appendChild(productDiv);
    });
}

// Actualiza la cantidad de un producto en el carrito
function updateQuantity(productId, change) {
    console.log("Actualizando cantidad para producto:", productId, "Cambio:", change); // Mensaje de depuración
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const product = carrito.find(item => item.id === productId);

    if (product) {
        product.quantity += change;
        console.log("Nuevo número de productos:", product.quantity); // Ver la cantidad actualizada

        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCart(); // Volver a renderizar el carrito
        }
    }
}

// Elimina un producto del carrito
function removeFromCart(productId) {
    console.log("Eliminando producto del carrito:", productId); // Mensaje de depuración
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productId);
    console.log("Carrito después de eliminar:", carrito); // Ver el carrito después de eliminar

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCart(); // Vuelve a renderizar el carrito
}

// Limpia el carrito y redirige a la página de inicio
function clearCart() {
    console.log("Limpiando el carrito..."); // Mensaje de depuración
    localStorage.removeItem('carrito');
    renderCart();
    window.location.href = 'index.html'; // Redirige al inicio
}

// Al hacer clic en "Proceder al pago", redirige a la página del formulario de pago
document.getElementById('checkout').addEventListener('click', function() {
    console.log("Procediendo al pago..."); // Mensaje de depuración
    window.location.href = 'formularioPago.html'; // Asegúrate de tener la página de pago
});
