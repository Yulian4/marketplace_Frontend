document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const totalElement = document.getElementById('total');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const deliveryCost = parseFloat(localStorage.getItem('deliveryCost')) || 0;
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Cliente';
    const direccionUsuario = localStorage.getItem('direccionUsuario') || 'Dirección no especificada';

    const clientInfo = document.getElementById('client-info');
    clientInfo.innerHTML = `
        <p><strong>Recibe:</strong> ${nombreUsuario}</p>
        <p><strong>Dirección:</strong> ${direccionUsuario}</p>
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
});

// esto son los estilos del alert con una libreria jsjs
const finalizarPago = document.getElementById("finalizarPago");
finalizarPago.addEventListener("click", () => {
    swal("¡Gracias por su compra", "Su pago se ha realizado satisfactoriamente", "success", {button:"Volver a inicio"})
.then((willRedirect) => {
    if (willRedirect) {
        
        window.location.href = '../../index.html'; 
    }
});
});