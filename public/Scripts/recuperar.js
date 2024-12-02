
const formRecuperar = document.getElementById('formRecuperar');
const formCodigo = document.getElementById('formCodigo');
const codigoVerificacion = document.getElementById('codigo-verificacion');
const timerElement = document.getElementById('timer');
let timerInterval;

formRecuperar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    try {
        if (!email) throw new Error('El correo electrónico es obligatorio.');

        const response = await fetch("http://localhost:3000/api/recuperar-password/enviar-codigo", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al enviar el código.');
        }

        alert('Código enviado. Revisa tu correo.');
        codigoVerificacion.style.display = 'block';
        startTimer(60); // 1 * 60 * 1000
        
    } catch (error) {
        console.error('Error al enviar el código:', error);
        alert(error.message || 'Hubo un problema al enviar el código.');
    }
});

formCodigo.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();

    try {
        if (!codigo || !newPassword) throw new Error('Todos los campos son obligatorios.');

        const response = await fetch('http://localhost:3000/api/recuperar-password/verificar-codigo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo, nuevaPassword: newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar contraseña.');
        }

        alert('Contraseña actualizada con éxito.');
        location.href = 'index.html'; 
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        alert(error.message || 'Hubo un problema al actualizar la contraseña.');
    }
});


function startTimer(duration) {
    let timer = duration;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        timerElement.textContent = `El código expira en: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timer--;

        if (timer < 0) {
            clearInterval(timerInterval);
            timerElement.textContent = 'El código ha expirado.';
            disableCodeSubmission(); 
        }
    }, 1000);
}


function disableCodeSubmission() {
    const inputs = document.querySelectorAll('#formCodigo input, #formCodigo button');
    inputs.forEach(input => (input.disabled = true));
    alert('El código ha expirado. pide para q te envie otro codigo lerdo.');
}
