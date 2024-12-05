document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const totalElement = document.getElementById('total');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const deliveryCost = parseFloat(localStorage.getItem('deliveryCost')) || 0;
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Cliente';
    const direccionUsuario = localStorage.getItem('direccionUsuario') || 'Dirección no especificada';
    const correoUsuario = localStorage.getItem('correoUsuario') || 'Correo no especificado';

    const clientInfo = document.getElementById('client-info');
    clientInfo.innerHTML = `
        <p><strong>Recibe:</strong> ${nombreUsuario}</p>
        <p><strong>Dirección:</strong> ${direccionUsuario}</p>
        <p><strong>Su orden de compra llegará a:</strong> ${correoUsuario}</p>
    `;

    function mostrarOrden(carrito) {
        let subtotal = 0;
        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            orderItemsContainer.appendChild(itemElement);
            subtotal += parseFloat(item.price) * item.quantity;
        });

        subtotalElement.textContent = `$${subtotal}`;
        deliveryCostElement.textContent = `$${deliveryCost}`;
        totalElement.textContent = `$${(subtotal + deliveryCost)}`;
    }

    mostrarOrden(carrito);

    // Actualizar los campos ocultos con los datos antes de enviar el formulario
    const form = document.getElementById('orderForm');
    const finalizarPago = document.getElementById('finalizarPago');

    finalizarPago.addEventListener("click", () => {
        // Actualiza los campos ocultos con los datos
        document.getElementById('nombreUsuario').value = nombreUsuario;
        document.getElementById('direccionUsuario').value = direccionUsuario;
        document.getElementById('correoUsuario').value = correoUsuario;
        document.getElementById('subtotal').value = subtotalElement;
        document.getElementById('deliveryCost').value = deliveryCost;
        document.getElementById('total').value = totalElement;

        
        swal("¡Gracias por su compra!", "Su pago se ha realizado satisfactoriamente", "success", { button: "Volver a inicio" })
        .then((willRedirect) => {
            if (willRedirect) {
                // Enviar el formulario
                form.submit();
            }
        });
    });
});
