document.addEventListener("DOMContentLoaded", () => { 
    const form = document.getElementById("crearVehiculoForm");
    const volverAdmin = document.getElementById("volver-admin");

    // Redirigir al panel de administrador
    volverAdmin.addEventListener("click", () => {
        window.location.href = "/public/vistaAdministrador.html";
    });

    // Manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Recoger los datos del formulario en FormData
        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:3000/api/vehiculos", {
                method: "POST",
                body: formData, // Enviar los datos como FormData para incluir la imagen
            });

            if (!response.ok) {
                throw new Error("Error al crear el vehículo");
            }

            alert("Vehículo creado correctamente.");
            window.location.href = "/public/vistaAdministrador.html"; 
        } catch (error) {
            console.error("Error al crear el vehículo:", error);
            alert("Hubo un problema al crear el vehículo.");
        }
    });
});
