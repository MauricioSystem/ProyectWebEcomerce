// Alternar entre formulario de inicio de sesión y registro
document.getElementById("toggleForm").addEventListener("click", () => {
    const loginForm = document.getElementById("formulario-inicio");
    const registerForm = document.getElementById("formulario-registro");
    const toggleButton = document.getElementById("toggleForm");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        toggleButton.textContent = "¿Nuevo usuario? Regístrate aquí";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        toggleButton.textContent = "¿Ya tienes cuenta? Inicia sesión aquí";
    }
});

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Llamada a la función iniciarSesion con los valores del formulario
    await iniciarSesion(email, password);
});


document.getElementById("formRegistro").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    // Aquí agregar lógica para registrar un nuevo usuario en el backend
    console.log("Registrar usuario:", { nombre, email, password, rol });
});
