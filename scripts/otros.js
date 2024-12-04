// Función para obtener los parámetros de la URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        name: params.get('name'),
        price: params.get('price'),
        image: params.get('image'),
        description: params.get('description')
    };
}

// Mostrar el producto principal
const product = getQueryParams();
document.getElementById('product-image').src = `../assets/images/products/${product.image}`;
document.getElementById('product-name').innerText = product.name;
document.getElementById('product-description').innerText = product.description || 'Sin descripción disponible';
document.getElementById('product-price').innerText = `$${parseFloat(product.price).toFixed(2)}`;

// Función para obtener productos desde la API
async function fetchProducts() {
    try {
        console.log('Obteniendo productos...');
        const response = await fetch("http://localhost:3000/api/products/approved-products");
        const products = await response.json();

        console.log('Productos obtenidos:', products);

        // Filtrar los productos excluyendo el principal
        const filteredProducts = products.filter(item => item.id !== product.id);

        console.log('Productos filtrados (sin principal):', filteredProducts);

        // Elegir 3 productos aleatorios
        const randomProducts = getRandomProducts(filteredProducts, 3);

        console.log('Productos aleatorios seleccionados:', randomProducts);

        // Renderizar los productos similares
        renderOtherProducts(randomProducts);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Función para seleccionar productos aleatorios
function getRandomProducts(products, count) {
    if (products.length <= count) {
        return products; // Si hay menos productos de los necesarios debuelve todos
    }
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Función para renderizar los productos similares
function renderOtherProducts(products) {
    const container = document.getElementById('other-products-container');

    if (!container) {
        console.error('Contenedor de "otros productos" no encontrado.');
        return;
    }

    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos elementos

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('other-product-card');

        card.innerHTML = `
        <img src="../assets/images/products/${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${parseFloat(product.price).toFixed(2)}</p>
        <button class="btn-view-product" onclick="viewProduct('${product.id}', '${product.name}', '${product.price}', '${product.image}', '${product.description}')">Ver producto</button>
    `;


        container.appendChild(card);
    });
}

// Función para redirigir al detalle del producto
function viewProduct(productId, name, price, image, description) {
    window.location.href = `../templates/fichaProducto.html?id=${productId}&name=${encodeURIComponent(name)}&price=${price}&image=${image}&description=${encodeURIComponent(description)}`;
}

// Llamar a la función para obtener y mostrar los productos
fetchProducts();

    // Función para agregar productos al carrito
    function addProductCart(productId, price, name, description) {
        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, description, quantity: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCartCount();
    }

    // Función para actualizar el contador de productos en el carrito
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalQuantity;
        }
    }

    // Llamada inicial para cargar los productos aprobados
    fetchApprovedProducts();
    updateCartCount();
