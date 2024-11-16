// anadirCarrito.js
document.addEventListener("DOMContentLoaded", async () => {
    const botonAgregarCarrito = document.getElementById("agregar-carrito");

    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = await crearCarritoAnonimo();
        if (sessionId) {
            localStorage.setItem("sessionId", sessionId);
        } else {
            alert("Error al crear carrito anónimo");
            return;
        }
    }

    botonAgregarCarrito.addEventListener("click", async () => {
        const vehiculoId = botonAgregarCarrito.getAttribute("data-id");

        if (!sessionId || !vehiculoId) {
            alert("Error al añadir al carrito: falta el sessionId o vehiculoId.");
            console.error(`sessionId: ${sessionId}, vehiculoId: ${vehiculoId}`);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/carrito/anadir", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    vehiculoId,
                    cantidad: 1
                })
            });

            if (!response.ok) throw new Error("No se pudo añadir el producto al carrito");

            const result = await response.json();
            alert(result.message || "Vehículo añadido al carrito con éxito");
            cerrarModal();
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
            alert("Error al añadir al carrito.");
        }
    });
});

async function crearCarritoAnonimo() {
    try {
        const response = await fetch("http://localhost:3000/api/carrito/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        return data.session_id;  // Devuelve el session_id del carrito creado
    } catch (error) {
        console.error("Error al crear carrito anónimo:", error);
        return null;
    }
}
