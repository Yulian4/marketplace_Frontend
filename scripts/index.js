document.addEventListener("DOMContentLoaded", function () {
   
    
    const apiUrl = "http://localhost:3000/api/products/approved-products";

    
    
    async function fetchApprovedProducts() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer <tu-token-aqui>" 
                    
                }
            });

            if (!response.ok) {
                throw new Error("Error al cargar los productos aprobados");
            }

            const products = await response.json();

            
            renderProducts(products);
        } catch (error) {
            console.error(error);
            document.getElementById("approved-products").innerHTML = `
                <p style="color: red;">Error al cargar los productos aprobados: ${error.message}</p>
            `;
        }
    }

    function renderProducts(products) {
        const container = document.getElementById("approved-products");

        
        if (products.length === 0) {
            container.innerHTML = "<p>No se han subido productos aun .</p>";
            return;
        }

        
        container.innerHTML = "";

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");
            productDiv.innerHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="http://localhost:3000/assets/images/products/${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Precio: $${product.price}</p>
                    </div>
                </div>
            `;
            container.appendChild(productDiv);
        });
    }

    fetchApprovedProducts();
});
