document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Anónimo';
    const usuarioId = localStorage.getItem('usuarioId');
    const sessionId = localStorage.getItem('sessionId');
    const nombreUsuarioElemento = document.getElementById('nombre-usuario');
    const carritoContenido = document.getElementById("carrito-contenido");
    const ultimasComprasContainer = document.getElementById("ultimas-compras");

    // Modal
    const modalComprar = document.getElementById('modal-comprar');
    const modalCerrar = document.getElementById('modal-cerrar');
    const formComprobante = document.getElementById('form-comprobante');
    const inputComprobante = document.getElementById('input-comprobante');

    if (nombreUsuarioElemento) {
        nombreUsuarioElemento.textContent = nombreUsuario;
    }

    if (!sessionId) {
        alert("Por favor inicia sesión para ver el carrito.");
        window.location.href = '/public/inicioSesion.html';
        return;
    }

    let carritoItems = [];

    // Abrir y cerrar modal
    modalCerrar.addEventListener('click', () => {
        modalComprar.style.display = 'none';
    });

    async function cargarCarrito() {
        try {
            const response = await fetch(`http://localhost:3000/api/carrito/${sessionId}`);

            if (!response.ok) {
                throw new Error("Error al obtener el carrito. Verifica la conexión.");
            }

            carritoItems = await response.json();
            mostrarCarrito(carritoItems);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
    }

    function mostrarCarrito(items) {
        carritoContenido.innerHTML = "";
        let total = 0;

        if (!Array.isArray(items) || items.length === 0) {
            carritoContenido.innerHTML = "<p>El carrito está vacío.</p>";
            return;
        }

        items.forEach(item => {
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
        comprarButton.addEventListener("click", () => {
            modalComprar.style.display = 'block';
        });
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
                body: JSON.stringify({ sessionId, vehiculoId, cantidad: nuevaCantidad }),
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
                body: JSON.stringify({ sessionId, vehiculoId }),
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

    formComprobante.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!inputComprobante.files.length) {
            alert("Debe subir un comprobante para realizar la compra.");
            return;
        }

        const formData = new FormData();
        formData.append('file', inputComprobante.files[0]);
        formData.append('sessionId', sessionId);
        formData.append('usuarioId', usuarioId);

        try {
            const response = await fetch("http://localhost:3000/api/carrito/confirmar-compra", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Error al realizar la compra.");

            const data = await response.json();
            alert(`Compra realizada exitosamente. Factura ID: ${data.facturaId}`);
            modalComprar.style.display = 'none';
            cargarCarrito();
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            alert("Error al realizar la compra. Intenta nuevamente.");
        }
    });

    async function cargarUltimasCompras() {
        if (!usuarioId || nombreUsuario === 'Anónimo') {
            ultimasComprasContainer.innerHTML = '<p>No disponible para usuarios anónimos.</p>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/detalles_factura/usuario/${usuarioId}`);
            if (!response.ok) throw new Error('Error al obtener las últimas compras.');

            const compras = await response.json();
            mostrarUltimasCompras(compras);
        } catch (error) {
            console.error('Error al cargar las últimas compras:', error);
        }
    }

    function mostrarUltimasCompras(compras) {
        ultimasComprasContainer.innerHTML = "";

        if (!Array.isArray(compras) || compras.length === 0) {
            ultimasComprasContainer.innerHTML = "<p>No hay compras recientes...</p>";
            return;
        }

        compras.forEach(compra => {
            const compraItem = document.createElement('div');
            compraItem.className = 'compra-item';
            compraItem.innerHTML = `
                <p><strong>Factura ID:</strong> ${compra.factura_id}</p>
                <p><strong>Vehículo:</strong> ${compra.vehiculo}</p>
                <p><strong>Cantidad:</strong> ${compra.cantidad}</p>
                <p><strong>Subtotal:</strong> ${compra.subtotal} Bs.</p>
                <hr>
            `;
            ultimasComprasContainer.appendChild(compraItem);
        });
    }

    cargarCarrito();
    cargarUltimasCompras();

    // Exponer funciones globales
    window.actualizarCantidad = actualizarCantidad;
    window.eliminarProducto = eliminarProducto;
});
