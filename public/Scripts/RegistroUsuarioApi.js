// Registrar un nuevo usuario usando la API
async function registrarUsuario(nombre, email, password, rol) {
    try {
        const response = await axios.post("http://localhost:3000/api/usuarios/register", {
            nombre,
            email,
            password,
            rol
        });
        alert(response.data.message);
    } catch (error) {
        console.error('Error en el registro', error);
        const errorMessage = error.response?.data?.message || 'Error en el registro';
        alert(errorMessage);
    }
}

// Conectar el envío del formulario de registro a la función registrarUsuario
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    await registrarUsuario(nombre, email, password, rol);
});


async function iniciarSesion(email, password) {
    try {
        const response = await axios.post('http://localhost:3000/api/usuarios/login', {
            email,
            password
        });

        if (response.status === 200) {
            alert(response.data.message);

            const { sessionId, nombre, rol, id } = response.data.user;

            // Guardar datos del usuario en localStorage
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('nombreUsuario', nombre);
            localStorage.setItem('usuarioId', id);
            localStorage.setItem('rolUsuario', rol); // Guardar el rol del usuario

            // Redirigir según el rol del usuario
            if (rol === 'admin') {
                window.location.href = "/public/vistaAdministrador.html";
            } else {
                window.location.href = "/public/index.html";
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
        alert(errorMessage);
    }
}

 

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    await iniciarSesion(email, password);
});

