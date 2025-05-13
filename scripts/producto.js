let currentUser = JSON.parse(localStorage.getItem('currentUser'));

let cardHtml = `<div class="col-4"><div class="card" >
  <img src="../assets/images/products/{0}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">{1}</h5>
    <p class="card-text">$-{2}</p>
<a href="#" class="btn btn-{status}">{3}</a>
<button class="btn btn-danger" onclick="deleteProduct('{4}')">Eliminar</button>
  </div>
</div></div>`;


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
                return cardHtml2;
            }).join('')
            : `
                <div class="no-products-message">
                    <p><strong>Recomendaciones para agregar productos a tu marketplace:</strong></p>
                    <ul>
                        <li><strong>1.Agregar un producto:<br></strong> Haz clic en el botón "Agregar producto" para comenzar el proceso de agregar un nuevo artículo.</li>
                        <li><strong>2.Formulario de producto:<br></strong> Completa todos los campos del formulario al agregar un producto. Asegúrate de proporcionar toda la información requerida para su correcta revisión.</li>
                        <li><strong>3.Imagen del producto:<br></strong> La imagen que subas debe ser exclusivamente de productos para mascotas. Si no cumple con este requisito, el producto será rechazado.</li>
                        <li><strong>4.Estados del producto:<br></strong>
                            <ul>
                                <li><strong>Pendiente:</strong> El producto está en revisión para ser aprobado por el administrador.</li>
                                <li><strong>Aprobado:</strong> El producto ha sido aprobado y está visible en el marketplace.</li>
                                <li><strong>Rechazado:</strong> El producto no cumple con los requisitos establecidos para ser publicado.</li>
                            </ul>
                        </li>
                        <li><strong>5.Eliminar un producto:<br></strong> Si lo deseas, puedes eliminar un producto en cualquier momento desde la gestión de tus productos.</li>
                    </ul>
                    <p>¡Gracias por colaborar con nosotros y ayudar a mantener la calidad de los productos en nuestra plataforma!</p>
                    <p>No has agregado productos aún.</p>
                </div>
            `;
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
document.addEventListener("DOMContentLoaded", renderUserSection);

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
            ? data.map(p => {
                let cardHtml2 = cardHtml;
                cardHtml2 = cardHtml2.replace("{0}", p.image);
                cardHtml2 = cardHtml2.replace("{1}", p.name);
                cardHtml2 = cardHtml2.replace("{3}", p.description);
                cardHtml2 = cardHtml2.replace("{2}", p.price);
                
                cardHtml2 = cardHtml2.replace("{4}", p.id);
                cardHtml2 = cardHtml2.replace("{status}", 'primary');
                const users = `<p>Usuario: ${p.user} </p>`
                // Añadir botones de aprobación y rechazo
                const approveButton = `<button class="btn btn-success" onclick="approveProduct('${p.id}')">Aprobar</button>`;
                const declineButton = `<button class="btn btn-danger" onclick="declineProduct('${p.id}')">Rechazar</button>`;
                cardHtml2 = cardHtml2.replace(`<button class="btn btn-danger" onclick="deleteProduct('${p.id}')">Eliminar</button>`, ` ${approveButton} ${declineButton} ${users}`);

                return cardHtml2;
            }).join('')
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
            swal('¡Hecho!','Producto aprobado exitosamente.', 'success');
            renderAdminProducts();
        } else {
            const data = await response.json();
            swal(data.message || 'Algo salio mal','Error al aprobar producto.','error');
        }
    } catch (error) {
        console.error('Error al aprobar producto:', error);
        swal('Algo salio mal','Error al aprobar producto.','error');
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
            swal('¡Hecho!','Su producto ha sido eliminado correctamente',"success");
            renderUserProducts(); // Vuelve a renderizar los productos del usuario
        } else {
            const data = await response.json();
            swal(data.message || 'Error al eliminar producto.','intentelo nuevamente', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        swal('Error al eliminar producto.','intentelo nuevamente', 'error');
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
            swal('¡Hecho!','Producto rechazado exitosamente.','success');
            renderAdminProducts();  // Recarga la lista de productos después del rechazo
        } else {
            const data = await response.json();
            swal(data.message ||'Algo salio mal','Error al rechazar producto.','error');
        }
    } catch (error) {
        console.error('Error al rechazar producto:', error);
        swal('Algo salio mal','Error al rechazar producto.','error');
    }
}
document.addEventListener("DOMContentLoaded", renderUserSection)