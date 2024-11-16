document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Anónimo';
    const usuarioId = localStorage.getItem('usuarioId'); // ID del usuario logueado
    const nombreUsuarioElemento = document.getElementById('nombre-usuario');
    if (nombreUsuarioElemento) {
        nombreUsuarioElemento.textContent = nombreUsuario;
    }

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        alert("Por favor inicia sesión para ver el carrito.");
        window.location.href = 'http://127.0.0.1:3001/public/inicioSesion.html';
        return;
    }

    const carritoContenido = document.getElementById("carrito-contenido");

    async function cargarCarrito() {
        try {
            const response = await fetch(`http://localhost:3000/api/carrito/${sessionId}`);

            if (!response.ok) {
                throw new Error("Error al obtener el carrito. Verifica la conexión.");
            }

            const carritoItems = await response.json();
            mostrarCarrito(carritoItems);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
    }

    function mostrarCarrito(carritoItems) {
        carritoContenido.innerHTML = ""; // Limpiar contenido
        let total = 0;

        if (!Array.isArray(carritoItems)) {
            console.error("Error: carritoItems no es un array", carritoItems);
            return;
        }

        carritoItems.forEach(item => {
            const subtotal = item.cantidad * item.precio;
            total += subtotal;

            const itemElement = document.createElement("div");
            itemElement.className = "carrito-item";
            itemElement.innerHTML = `
                <div>
                    <p><strong>${item.marca}</strong> - ${item.descripcion}</p>
                    <p>Precio: ${item.precio} Bs.</p>
                </div>
                <div>
                    <p>Cantidad:
                        <button class="boton-cantidad" onclick="actualizarCantidad('${item.vehiculo_id}', ${item.cantidad - 1})">-</button>
                        ${item.cantidad}
                        <button class="boton-cantidad" onclick="actualizarCantidad('${item.vehiculo_id}', ${item.cantidad + 1})">+</button>
                    </p>
                    <p>Subtotal: ${subtotal} Bs.</p>
                    <button class="boton-eliminar" onclick="eliminarProducto('${item.vehiculo_id}')">Eliminar</button>
                </div>
            `;
            carritoContenido.appendChild(itemElement);
        });

        const totalElement = document.createElement("div");
        totalElement.className = "total";
        totalElement.textContent = `Total: ${total} Bs.`;
        carritoContenido.appendChild(totalElement);

        const comprarButton = document.createElement("button");
        comprarButton.className = "boton-comprar";
        comprarButton.textContent = "Comprar";
        comprarButton.addEventListener("click", comprarCarrito);
        carritoContenido.appendChild(comprarButton);
    }

    async function actualizarCantidad(vehiculoId, nuevaCantidad) {
        if (nuevaCantidad < 1) {
            eliminarProducto(vehiculoId);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/carrito/editar/${vehiculoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, vehiculoId, cantidad: nuevaCantidad })
            });
            if (response.ok) {
                cargarCarrito();
            }
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
        }
    }

    async function eliminarProducto(vehiculoId) {
        try {
            const response = await fetch(`http://localhost:3000/api/carrito/eliminar/${vehiculoId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, vehiculoId })
            });
            if (response.ok) {
                cargarCarrito();
            } else {
                throw new Error("No se pudo eliminar el producto del carrito.");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    // Comprar carrito
    async function comprarCarrito() {
        if (!usuarioId || !sessionId) {
            alert("Por favor, inicia sesión para realizar la compra.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/factura/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, usuarioId })
            });

            if (!response.ok) {
                throw new Error("Error al realizar la compra.");
            }

            const data = await response.json();
            alert(`Compra realizada exitosamente. Factura ID: ${data.facturaId}`);
            cargarCarrito(); // Refrescar carrito (estará vacío tras la compra)
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            alert("Error al realizar la compra. Intenta nuevamente.");
        }
    }

    cargarCarrito();
});
