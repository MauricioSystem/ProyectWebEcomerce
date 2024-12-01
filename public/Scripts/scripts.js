document.addEventListener('DOMContentLoaded', function() {
    const botonCatalogo = document.getElementById('boton-catalogo');
    if (botonCatalogo) {
        botonCatalogo.addEventListener('click', function() {
            window.location.href = "/public/catalogo.html";
        });
    }

    const botonLogin = document.getElementById('boton-login');
    const nombreUsuarioElemento = document.getElementById('nombre-usuario');
    const botonLogout = document.getElementById('boton-logout');

//localestorageeeeeeeeeeeeeeeeeeee
    const usuarioGuardado = localStorage.getItem('nombreUsuario');
    const sessionId = localStorage.getItem('sessionId');

    if (usuarioGuardado && sessionId) {
        botonLogin.style.display = 'none';
        nombreUsuarioElemento.style.display = 'inline';
        nombreUsuarioElemento.textContent = usuarioGuardado; 
        botonLogout.style.display = 'inline';
    } else {
        botonLogin.style.display = 'inline';
        nombreUsuarioElemento.style.display = 'none';
        botonLogout.style.display = 'none';

        botonLogin.addEventListener('click', function() {
            window.location.href = "/public/inicioSesion.html";
        });
    }


    botonLogout.addEventListener('click', function() {

        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('sessionId');
        window.location.reload(); 
    });


    const botonCarrito = document.getElementById('boton-carrito');
    if (botonCarrito) {
        botonCarrito.addEventListener('click', function() {
            window.location.href = "/public/Carrito.html";
        });
    }
});
