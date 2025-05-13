document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryElement = document.getElementById('cart-summary');
    const totalContainer = document.getElementById('total-container');
    const formularioEntrega = document.getElementById('formularioEntrega');
    const modificarCarrito = document.getElementById("modificarCarrito");

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function calcularSubtotal(carrito) {
        let subtotal = 0;
        carrito.forEach(item => {
            const precio = parseFloat(item.price);
            const cantidad = parseInt(item.quantity, 10);

            if (isNaN(precio) || isNaN(cantidad)) {
                console.error(`Valor inválido: precio ${item.price}, cantidad ${item.quantity}`);
                return;
            }

            subtotal += precio * cantidad;
        });
        return subtotal;
    }

    function mostrarResumenCarrito(carrito, deliveryCost = 0) {
        cartSummaryElement.innerHTML = '';

        if (carrito.length === 0) {
            cartSummaryElement.textContent = "Tu carrito está vacío.";
            totalContainer.textContent = "";
            return;
        }

        let subtotal = calcularSubtotal(carrito);

        carrito.forEach(item => {
            const productLine = document.createElement('div');
            productLine.classList.add('product-line');

            const productName = document.createElement('span');
            productName.classList.add('product-name');
            productName.textContent = item.name;

            const productPrice = document.createElement('span');
            productPrice.classList.add('product-price');
            productPrice.textContent = `$${item.price}`;

            const productQuantity = document.createElement('span');
            productQuantity.classList.add('product-quantity');
            productQuantity.textContent = `x ${item.quantity}`;

            productLine.appendChild(productName);
            productLine.appendChild(productPrice);
            productLine.appendChild(productQuantity);

            cartSummaryElement.appendChild(productLine);
        });

        const subtotalLine = document.createElement('div');
        subtotalLine.classList.add('subtotal-line');
        subtotalLine.textContent = `Subtotal: $${subtotal}`;
        cartSummaryElement.appendChild(subtotalLine);

        const deliveryLine = document.createElement('div');
        deliveryLine.classList.add('delivery-line');
        deliveryLine.textContent = `Costo de entrega: $${deliveryCost}`;
        cartSummaryElement.appendChild(deliveryLine);

        const total = subtotal + deliveryCost;

        if (isNaN(total) || total < 0) {
            console.error("Error al calcular el total.");
            totalContainer.textContent = "Error al calcular el total.";
            return;
        }

        localStorage.setItem('totalCompra', total);
        console.log("Total guardado:", localStorage.getItem('totalCompra'));

        totalContainer.textContent = `Total a pagar: $${total}`;
        totalContainer.classList.add('total-line');
    }

    mostrarResumenCarrito(carrito);

    const deliveryOptions = document.querySelectorAll('input[name="entrega"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => {
            const deliveryCost = parseInt(option.getAttribute('data-cost'), 10);
            localStorage.setItem('deliveryCost', deliveryCost);
            mostrarResumenCarrito(carrito, deliveryCost);
            console.log("Opciones actualizadas - Subtotal y entrega.");
        });
    });

    formularioEntrega.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedOption = document.querySelector('input[name="entrega"]:checked');
        if (!selectedOption) {
            swal('Selecciona una opción de entrega.','Intentelo de nuevo','info');
            return;
        }

        const deliveryCost = parseInt(selectedOption.getAttribute('data-cost'), 10);
        mostrarResumenCarrito(carrito, deliveryCost);

        const totalCompra = localStorage.getItem('totalCompra');
        if (!totalCompra || parseFloat(totalCompra) <= 0) {
            swal("Algo salio mal",'El total de la compra es invalido','error');
            return;
        }

        window.location.href = './metodoPago.html';
    });

    modificarCarrito.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
});
