document.addEventListener("DOMContentLoaded", () => { 
    const form = document.getElementById("crearVehiculoForm");
    const volverAdmin = document.getElementById("volver-admin");


    volverAdmin.addEventListener("click", () => {
        window.location.href = "/public/vistaAdministrador.html";
    });

    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:3000/api/vehiculos", {
                method: "POST",
                body: formData, 
            });

            if (!response.ok) {
                throw new Error("Error al crear el vehículo");
            }

            alert("Vehículo creado correctamente.");
            window.location.href = "/public/vistaAdministrador.html"; 
        } catch (error) {
            alert("Hubo un problema al crear el vehículo.");
        }
    });
});
