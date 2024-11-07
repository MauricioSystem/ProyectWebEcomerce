document.addEventListener('DOMContentLoaded', function() {
  const botonCatalogo = document.getElementById('boton-catalogo');
  if (botonCatalogo) {
      botonCatalogo.addEventListener('click', function() {
          window.location.href = 'http://127.0.0.1:3001/public/catalogo.html';
      });
  }

  // Nuevo evento para el botón de login
  const botonLogin = document.querySelector('.boton-login');
  if (botonLogin) {
      botonLogin.addEventListener('click', function() {
          // Redirigir a la página de inicio de sesión
          window.location.href = 'http://127.0.0.1:3001/public/inicioSesion.html';
      });
  }
});
