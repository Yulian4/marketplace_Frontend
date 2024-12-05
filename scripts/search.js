// Obtener el término de búsqueda de la URL
const params = new URLSearchParams(window.location.search);
const query = params.get('query');

if (query) {
    // Mostrar el término buscado
    document.querySelector('h1').innerText = `Resultados para: "${query}"`;

    fetch('http://localhost:3000/api/products/approved-products') // Cambia esta URL por la de tu API
    .then(response => response.json())
    .then(data => {
        const resultsContainer = document.getElementById('results');
        // Filtrar productos que coincidan con el término de búsqueda (ignorando mayúsculas y minúsculas)
        const filteredProducts = data.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = `<p>No se encontraron productos para "${query}".</p>`;
        } else {
            filteredProducts.forEach(product => {
                const productCard = `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="../assets/images/products/${product.image}" alt="${product.name}">
                            <div class="card-body">
                            <h3>${product.name}</h3>
                            <p>$${parseFloat(product.price).toFixed(2)}</p>
                            <a class="link" href="../templates/fichaProducto.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&image=${product.image}&description=${product.description}">
                            <button class="btn-view-product">Mira más</button>
                            </a>
                        </div>
                    </div>
                `;
                resultsContainer.innerHTML += productCard;
            });
        }
    })
    .catch(error => {
        console.error('Error al buscar productos:', error);
        document.getElementById('results').innerHTML = `<p>Error al cargar los resultados.</p>`;
    });

}

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar el comportamiento predeterminado
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
});