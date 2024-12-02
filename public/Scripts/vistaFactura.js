document.addEventListener('DOMContentLoaded', async () => {
    const facturaContenido = document.getElementById('factura-contenido');

    async function cargarDetallesFactura() {
        try {
            const response = await fetch('http://localhost:3000/api/detalles_factura');

            if (!response.ok) {
                throw new Error('Error al obtener los detalles de factura.');
            }

            const detallesFactura = await response.json();
            mostrarDetallesFactura(detallesFactura);
        } catch (error) {
            console.error('Error al cargar los detalles de factura:', error);
            alert('Error al cargar los detalles de factura. Intente más tarde.');
        }
    }

    function mostrarDetallesFactura(detallesFactura) {
        facturaContenido.innerHTML = '';

        detallesFactura.forEach((detalle) => {
            const detalleElement = document.createElement('div');
            detalleElement.className = 'detalle-factura';

            // Recupera el estado guardado en LocalStorage
            const estadoGuardado = localStorage.getItem(`factura-${detalle.factura_id}`) || 'En espera';
            const estaAprobada = estadoGuardado === 'Aprobada';

            detalleElement.innerHTML = `
                <p><strong>Factura ID:</strong> ${detalle.factura_id}</p>
                <p><strong>Cliente:</strong> ${detalle.cliente}</p>
                <p><strong>Vehículo:</strong> ${detalle.vehiculo}</p>
                <p><strong>Cantidad:</strong> ${detalle.cantidad}</p>
                <p><strong>Precio Unitario:</strong> ${detalle.precio_unitario} Bs.</p>
                <p><strong>Subtotal:</strong> ${detalle.subtotal} Bs.</p>
                <p><strong>Fecha:</strong> ${detalle.fecha_factura}</p>
                <div>
                    <label class="switch">
                        <input type="checkbox" onchange="toggleEstado(this, ${detalle.factura_id})" ${
                            estaAprobada ? 'checked' : ''
                        }>
                        <span class="slider"></span>
                    </label>
                    <span id="estado-${detalle.factura_id}">${estadoGuardado}</span>
                </div>
                <hr>
            `;

            facturaContenido.appendChild(detalleElement);
        });
    }

    window.toggleEstado = (checkbox, facturaId) => {
        const estadoElement = document.getElementById(`estado-${facturaId}`);
        const nuevoEstado = checkbox.checked ? 'Aprobada' : 'En espera';

        // Actualiza el estado visual
        estadoElement.textContent = nuevoEstado;

        // Guarda el estado en LocalStorage
        localStorage.setItem(`factura-${facturaId}`, nuevoEstado);
    };

    cargarDetallesFactura();
});
