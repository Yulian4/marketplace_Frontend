
const API_URL = 'http://localhost:3000';
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
            showLoginForm();
        } else {
            alert(data.message || 'Error al registrar usuario.');
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario.');
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor completa todos los campos.uuuu');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            currentUser = { ...data.user, token: data.token };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderUserSection();
        } else {
            alert(data.message || 'Error al iniciar sesión.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión.');
    }
}

async function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginForm();
}

function showLoginForm() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function renderUserSection() {
    const userSection = document.getElementById('user-section');
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');

    loginSection.style.display = 'none';
    userSection.style.display = 'none';
    adminSection.style.display = 'none';

    if (currentUser) {
        document.getElementById('user-name').innerText = currentUser.username;
        document.getElementById('admin-name').innerText = currentUser.username;

        if (currentUser.role === 'user') {
            userSection.style.display = 'block';
            renderUserProducts();
        } else if (currentUser.role === 'admin') {
            adminSection.style.display = 'block';
            renderAdminProducts();
        }
    } else {
        showLoginForm();
    }
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
                <div class="product">
                    ${p.name} - ${p.price} - Estado: ${p.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                    <button onclick="approveProduct('${p.id}')">Aprobar</button>
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

async function declineProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/reject-product/${productId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        if (response.ok) {
            alert('Producto Rechazado exitosamente.');
            renderAdminProducts();
        } else {
            const data = await response.json();
            alert(data.message || 'Error al Rechazar producto.');
        }
    } catch (error) {
        console.error('Error al Rechazar producto:', error);
        alert('Error al Rechazar producto.');
    }
}

async function renderUserProducts() {
    const userProductsDiv = document.getElementById('user-products');
    try {
        const response = await fetch(`${API_URL}/api/products/user-products`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
        });

        const data = await response.json();
        userProductsDiv.innerHTML = data.length > 0
            ? data.map(p => `
                <div class="product">${p.name} - ${p.price} - ${p.status}</div>
            `).join('')
            : '<p>No has agregado productos aún.</p>';
    } catch (error) {
        console.error('Error al cargar los productos del usuario:', error);
    }
}

async function addProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;


    if (!name || !description || !price) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products/add-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify({ name, description, price }),
        });

        if (response.ok) {
            alert('Producto agregado. Esperando aprobación del administrador.');
            renderUserSection();
        } else {
            const data = await response.json();
            alert(data.message || 'Error al agregar producto.');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar producto.');
    }
}

async function deleteProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;


    if (!name || !description || !price) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products/delete-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify({ name, description, price }),
        });

        if (response.ok) {
            alert('Error a eliminar el producto');
            renderUserSection();
        } else {
            const data = await response.json();
            alert(data.message || 'Error al agregar producto.');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar producto.');
    }
}
function init() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        renderUserSection();
    } else {
        showLoginForm();
    }
}


document.addEventListener('DOMContentLoaded', init);
