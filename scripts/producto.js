let currentUser = JSON.parse(localStorage.getItem('currentUser'));

let cardHtml = `<div class="card col-4 m-1" style="width: 18rem;">
  <img src="../assets/images/products/{0}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">{1}</h5>
    <p class="card-text">$-{2}</p>
<a href="#" class="btn btn-{status}">{3}</a>
<button class="btn btn-danger" onclick="deleteProduct('{4}')">Eliminar</button>
  </div>
</div>`;


async function renderUserProducts() {
    const userProductsDiv = document.getElementById('user-products');
    try {
        const response = await fetch(`${API_URL}/api/products/user-products`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        const data = await response.json();
        userProductsDiv.innerHTML = data.length > 0
            ? data.map(p => {
                let cardHtml2 = cardHtml;
                cardHtml2 = cardHtml2.replace("{0}", p.image);
                cardHtml2 = cardHtml2.replace("{1}", p.name);
                cardHtml2 = cardHtml2.replace("{2}", p.price);
                cardHtml2 = cardHtml2.replace("{3}", p.status);
                cardHtml2 = cardHtml2.replace("{4}", p.id);
                if(p.status === "Pendiente"){
                    cardHtml2 = cardHtml2.replace("{status}", "warning");
                }else if(p.status === "Aprobado"){
                    cardHtml2 = cardHtml2.replace("{status}", "success");
                }else if(p.status === "Rechazado"){
                    cardHtml2 = cardHtml2.replace("{status}", "danger");
                } 
                // return `<div class="product">${p.name} - ${p.price} - ${p.status}</div>`})
                return cardHtml2;
            }).join('')
            : '<p>No has agregado productos aún.</p>';
    } catch (error) {
        console.error('Error al cargar los productos del usuario:', error);
    }
}



function renderUserSection() {
    
    if (currentUser.role == 'user') {
        document.getElementById('user-name').innerText = currentUser.username;
        
        renderUserProducts();
        
    } else if (currentUser.role == 'admin'){
        document.getElementById('admin-name').innerText = currentUser.username;
        
        renderAdminProducts();
    }
    else {
        showLoginForm();
    }
}

async function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = './iniciarSesion.html';
}

async function renderAdminProducts() {
    const adminProductsDiv = document.getElementById('admin-products');
    try {
        const response = await fetch(`${API_URL}/api/products/admin-products`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        const data = await response.json();
        adminProductsDiv.innerHTML = data.length > 0
            ? data.map(p => `
               <div class="product" id="product-${p.id}">
                    <span id="product-name-${p.id}">${p.name}</span> - 
                    <span id="product-price-${p.id}">${p.price}</span>
                    <button id="approve-btn-${p.id}" onclick="approveProduct('${p.id}')">Aprobar</button>
                    <button id="decline-btn-${p.id}" class="btn btn-danger" onclick="declineProduct('${p.id}')">Rechazar</button>
                </div>
            `).join('')
            : '<p>No hay productos pendientes para aprobar.</p>';
    } catch (error) {
        console.error('Error al cargar los productos pendientes:', error);
    }
}
async function approveProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/approve-product/${productId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        if (response.ok) {
            alert('Producto aprobado exitosamente.');
            renderAdminProducts();
        } else {
            const data = await response.json();
            alert(data.message || 'Error al aprobar producto.');
        }
    } catch (error) {
        console.error('Error al aprobar producto:', error);
        alert('Error al aprobar producto.');
    }
}


async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/delete-product/${productId}`, {
            method: 'DELETE', // Usamos DELETE en vez de POST
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
            },
        });

        if (response.ok) {
            alert('Producto eliminado con éxito.');
            renderUserProducts(); // Vuelve a renderizar los productos del usuario
        } else {
            const data = await response.json();
            alert(data.message || 'Error al eliminar producto.');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto.');
    }
}
async function declineProduct(productId) {
    console.log('Rechazando producto con ID:', productId);  // Para depurar y verificar si la función se llama correctamente
    try {
        const response = await fetch(`${API_URL}/api/products/reject-product/${productId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${currentUser.token}`,
            },
        });

        if (response.ok) {
            alert('Producto rechazado exitosamente.');
            renderAdminProducts();  // Recarga la lista de productos después del rechazo
        } else {
            const data = await response.json();
            alert(data.message || 'Error al rechazar el producto.');
        }
    } catch (error) {
        console.error('Error al rechazar producto:', error);
        alert('Error al rechazar producto.');
    }
}



document.addEventListener("DOMContentLoaded", renderUserSection)
