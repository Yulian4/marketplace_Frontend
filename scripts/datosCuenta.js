document.addEventListener('DOMContentLoaded', () => {
    // Base de datos simulada de cuentas
    let cuentas = [
        { NumeroCuenta: '123', password: '456', saldo: 2000 },
        { NumeroCuenta: 'asd', password: 'asd', saldo: 20000000 }
    ];

    const form = document.getElementById('formpago');
    form.addEventListener("submit", e => {
        e.preventDefault(); // recarga de página

        const numcuenta = document.getElementById('account-number').value;
        const password = document.getElementById('password').value;

      const cuentaExists = cuentas.find(account => account.NumeroCuenta === numcuenta);

        if (cuentaExists && cuentaExists.password === password) {

            const totalCompra = parseFloat(localStorage.getItem('totalCompra')) || 0;

            if (totalCompra <= 0) {
                alert("El total de la compra no es válido.");
                return;
            }

            
            if (cuentaExists.saldo >= totalCompra) {
                alert("Su compra ha sido exitosa. A continuación se le mostrara su orden de compra.");

             
                window.location.href = './ordenCompra.html';
            } else {
                alert("Saldo insuficiente. No se puede realizar la compra.");
            }
        } else {
            alert("Cuenta no encontrada o contraseña incorrecta.");
        }
    });
});
