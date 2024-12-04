document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryElement = document.getElementById('cart-summary');
    const totalContainer = document.getElementById('total-container');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const deliveryCost = parseInt(localStorage.getItem('deliveryCost'), 10) || 0;

    function calcularSubtotal(carrito) {
        let subtotal = 0;
        carrito.forEach(item => {
            const precio = parseFloat(item.price);
            const cantidad = parseInt(item.quantity, 10);

            if (isNaN(precio) || isNaN(cantidad)) {
                console.error(`Valor inválido en el carrito: precio: ${item.price}, cantidad: ${item.quantity}`);
                return;
            }
            subtotal += precio * cantidad;
        });
        return subtotal;
    }

    function mostrarResumenCarrito(carrito, deliveryCost) {
        cartSummaryElement.innerHTML = ''; // Limpiar contenido previo
        let subtotal = calcularSubtotal(carrito);

        carrito.forEach(item => {
            const productLine = document.createElement('div');
            productLine.className = 'product-line';
            productLine.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            cartSummaryElement.appendChild(productLine);
        });

        const subtotalLine = document.createElement('div');
        subtotalLine.className = 'subtotal-line';
        subtotalLine.textContent = `Subtotal: $${subtotal}`;
        cartSummaryElement.appendChild(subtotalLine);

        const deliveryLine = document.createElement('div');
        deliveryLine.className = 'delivery-line';
        deliveryLine.textContent = `Costo de entrega: $${deliveryCost}`;
        cartSummaryElement.appendChild(deliveryLine);

        const total = subtotal + deliveryCost;
        if (isNaN(total)) {
            console.error("Error al calcular el total.");
            totalContainer.textContent = "Error al calcular el total.";
            totalContainer.className = 'error-line';
        } else {
            totalContainer.textContent = `Total a pagar: $${total}`;
            totalContainer.className = 'total-line';
        }
    }

    mostrarResumenCarrito(carrito, deliveryCost);

    const pseButton = document.getElementById('pse-button');
    pseButton.addEventListener('click', () => {
        window.location.href = './datosCuenta.html';
    });

    const modificarCarrito = document.getElementById("modificarCarrito");
    modificarCarrito.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
});
