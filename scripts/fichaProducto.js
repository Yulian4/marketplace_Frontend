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
        <img src="assets/images/products/${product.image}" alt="${product.name}">
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

// Llamada inicial a la API
fetchProducts();
