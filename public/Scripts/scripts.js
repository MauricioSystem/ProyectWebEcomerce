document.addEventListener('DOMContentLoaded', function() {
    const botonCatalogo = document.getElementById('boton-catalogo');
    if (botonCatalogo) {
        botonCatalogo.addEventListener('click', function() {
            window.location.href = "/public/catalogo.html";
        });
    }

    // Referencias a los elementos de Login, nombre de usuario y Logout
    const botonLogin = document.getElementById('boton-login');
    const nombreUsuarioElemento = document.getElementById('nombre-usuario');
    const botonLogout = document.getElementById('boton-logout');

    // Verificar si hay un usuario guardado en localStorage
    const usuarioGuardado = localStorage.getItem('nombreUsuario');
    const sessionId = localStorage.getItem('sessionId');

    if (usuarioGuardado && sessionId) {
        // Mostrar el nombre del usuario y el botón de logout
        botonLogin.style.display = 'none';
        nombreUsuarioElemento.style.display = 'inline';
        nombreUsuarioElemento.textContent = usuarioGuardado; // Asignar el texto del nombre correctamente
        botonLogout.style.display = 'inline';
    } else {
        // Si no hay usuario en localStorage, configurar el evento para el botón de login
        botonLogin.style.display = 'inline';
        nombreUsuarioElemento.style.display = 'none';
        botonLogout.style.display = 'none';

        botonLogin.addEventListener('click', function() {
            window.location.href = "/public/inicioSesion.html";
        });
    }

    // Evento para cerrar sesión
    botonLogout.addEventListener('click', function() {
        // Limpiar localStorage y recargar la página
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('sessionId');
        window.location.reload(); // Recargar la página para actualizar la vista
    });

    // Configurar botón del carrito para redirigir a la página del carrito
    const botonCarrito = document.getElementById('boton-carrito');
    if (botonCarrito) {
        botonCarrito.addEventListener('click', function() {
            window.location.href = "/public/Carrito.html";
        });
    }
});
