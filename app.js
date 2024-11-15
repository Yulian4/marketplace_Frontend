const API_URL = 'http://localhost:3000'; 
console.log("API_URL:", API_URL);


let currentUser = null;
let products = [];

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // location.reload(); // Recargar la página para mostrar la vista correcta
            renderUserSection()
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        alert('Error al iniciar sesión');
    }
}

async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
        });
        localStorage.removeItem('currentUser');
        location.reload(); // Recargar la página después de cerrar sesión
    } catch (error) {
        console.error('Error al cerrar sesión', error);
        alert('Error al cerrar sesión');
    }
}

async function renderUserSection() {
    const userSection = document.getElementById('user-section');
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');
    const userName = document.getElementById('user-name');
    
    loginSection.style.display = 'none';
    userSection.style.display = 'none';
    adminSection.style.display = 'none';
    
    if (currentUser) {
        console.log("currentUser", currentUser);
        userName.innerText = currentUser.username;

        if (currentUser.role === 'user') {
            userSection.style.display = 'block';
            renderUserProducts();
        } else if (currentUser.role === 'admin') {
            adminSection.style.display = 'block';
            renderAdminProducts();
        }
    } else {
        loginSection.style.display = 'block';
    }
}
async function renderAdminProducts() {
    const adminProductsDiv = document.getElementById('admin-products');
    try {
        const response = await fetch(`${API_URL}/products/admin-products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        const data = await response.json();

        if (data.length > 0) {
            adminProductsDiv.innerHTML = data.map(p =>
                `<div class="product">
                    ${p.name} - ${p.price} - Estado: ${p.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                    <button onclick="approveProduct('${p.name}')">Aprobar</button>
                </div>`
            ).join('');
        } else {
            adminProductsDiv.innerHTML = '<p>No hay productos pendientes para aprobar.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos pendientes', error);
    }
}

async function renderUserProducts() {
    const userProductsDiv = document.getElementById('user-products');
    try {
        const response = await fetch(`${API_URL}/products/${currentUser.username}/products`);
        const data = await response.json();
        
        if (data.length > 0) {
            userProductsDiv.innerHTML = data.map(p => 
                `<div class="product">${p.name} - ${p.price} - Estado: ${p.status === 'approved' ? 'Aprobado' : 'Pendiente'}</div>`
            ).join('');
        } else {
            userProductsDiv.innerHTML = '<p>No has agregado productos.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos del usuario', error);
    }
}

async function addProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;

    if (name && description && price) {
        try {
            const response = await fetch(`${API_URL}/products/add-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}` // Agregar el token para la autorización
                },
                body: JSON.stringify({ name, description, price, user: currentUser.username }) // Asegúrate de que se envíen estos campos
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto agregado, espera aprobación del administrador.');
                renderUserProducts(); // Recargar los productos del usuario
            } else {
                alert(data.message || 'else Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error al agregar producto', error);
            alert('catch Error al agregar producto');
        }
    } else {
        alert('Por favor completa todos los campos');
    }
}
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    renderUserSection();
});

async function approveProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/approve-product/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert('Producto aprobado');
            renderAdminProducts();  // Recarga la lista de productos pendientes
        } else {
            alert(data.message);  // Muestra el mensaje de error
        }
    } catch (error) {
        console.error('Error al aprobar producto', error);
    }
}

