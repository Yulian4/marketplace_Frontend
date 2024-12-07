const apiEndpoint = 'http://localhost:3000/api/products/approved-products'; 
const productContainer = document.getElementById('product-container');

// Función para obtener productos desde la API
async function fetchProducts() {
try {
    const response = await fetch(apiEndpoint);
    const products = await response.json();
    renderProducts(products);
} catch (error) {
    console.error('Error fetching products:', error);
}
}

// Función para renderizar productos en el DOM
function renderProduct(product) {
    const container = document.getElementById('product-container');
    container.innerHTML = `
    <div class="product-page">
        <div class="product-image">
        <img src="../assets/images/products/${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p>${product.description}</p>
        <p class="availability">In Stock</p>
        <button>Add to Cart</button>
        </div>
    </div>
    `;
}  
// Obteniendo los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const productName = params.get('name');
const productPrice = params.get('price');
const productDescription = params.get('description');

// Llenando los campos en el HTML
document.getElementById('product-name').textContent = productName;
document.getElementById('product-description').textContent = productDescription;
document.getElementById('product-price').textContent = `$${productPrice}`;
document.getElementById('product-image').src = `../assets/images/products/${params.get('image')}`;

// Botón de agregar al carrito con los parámetros correctos
document.querySelector('.btn-agregar').setAttribute('onclick', `addProductCart('${productId}', ${productPrice}, '${productName}', '${productDescription}')`);

// Cambios Valentina (redirección botón para pago)
const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", () => {
  window.location.href = "../templates/pagos/formulario.html";
});

// Llamada inicial a la API
fetchProducts();
fetchApprovedProducts();
    updateCartCount();
