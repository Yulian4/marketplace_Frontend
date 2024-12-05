document.addEventListener('DOMContentLoaded', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || []; 

  const resumenCarrito = document.getElementById('cart-summary');
  if (carrito.length === 0) {
    resumenCarrito.innerHTML = 'Tu carrito está vacío.';
  } else {
    mostrarResumenCarrito(carrito); 
  }
});

function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + (item.price * item.quantity), 0); 
}

function mostrarResumenCarrito(carrito) {
  const resumenCarrito = document.getElementById('cart-summary');
  resumenCarrito.innerHTML = ''; // Limpiar contenido previo


  carrito.forEach(item => {
    const productLine = document.createElement('div');
    productLine.classList.add('product-line'); // Clase general para la línea del producto
  

    const productName = document.createElement('span');
    productName.textContent = item.name;
    productName.classList.add('product-name'); // Clase para el nombre
  
  
    const productPrice = document.createElement('span');
    productPrice.textContent = `$${item.price}`;
    productPrice.classList.add('product-price'); // Clase para el precio
  
    // Cantidad del producto
    const productQuantity = document.createElement('span');
    productQuantity.textContent = `x ${item.quantity}`;
    productQuantity.classList.add('product-quantity'); // Clase para la cantidad
  
    // Añadir todo al contenedor principal
    productLine.appendChild(productName);
    productLine.appendChild(productPrice);
    productLine.appendChild(productQuantity);
  
    resumenCarrito.appendChild(productLine); 
  });


  const total = calcularTotal(carrito);
  const totalLine = document.createElement('div');
  totalLine.textContent = `Total a pagar: $${total}`;
  totalLine.classList.add('total-line'); // Clase para estilizar el total
  resumenCarrito.appendChild(totalLine);
  
}



formulario.addEventListener('submit', function(event) {
  event.preventDefault();

  const telefono = document.getElementById('telefono').value;
  const telefonoRegex = /^3\d{9}$/;
  if (!telefonoRegex.test(telefono)) {
      swal('Asegúrate que tu numero comience con 3','Intentelo nuevamente','info');
      return;
  }

  const nombre = document.getElementById('nombre').value;
  const municipio = document.getElementById('municipio').value;
  const barrio = document.getElementById('barrio').value;
  const correo = document.getElementById('correo').value;

 
  localStorage.setItem('nombreUsuario', nombre);
  localStorage.setItem('direccionUsuario', `${municipio}, ${barrio}`);
  localStorage.setItem('correoUsuario', correo);


 
  window.location.href = './domicilio.html';
});
