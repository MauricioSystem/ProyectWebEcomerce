function abrirModal(vehiculo) {
    const modal = document.getElementById('panel-detalle');
    const overlay = document.querySelector('.panel-detalle-overlay');
    const imagenDetalle = document.getElementById('imagen-detalle');
    const marcaDetalle = document.getElementById('marca-detalle');
    const descripcionDetalle = document.getElementById('descripcion-detalle');
    const precioDetalle = document.getElementById('precio-detalle');

    // Cargar los datos en el modal
    imagenDetalle.src = vehiculo.imagen;
    marcaDetalle.textContent = `Marca: ${vehiculo.marca}`;
    descripcionDetalle.textContent = `Descripción: ${vehiculo.descripcion}`;
    precioDetalle.textContent = `Precio: ${vehiculo.precio} Bs.`;

    // Mostrar el modal y el overlay
    modal.classList.add('visible');
    overlay.classList.add('visible');
}

function cerrarModal() {
    const modal = document.getElementById('panel-detalle');
    const overlay = document.querySelector('.panel-detalle-overlay');
    modal.classList.remove('visible');
    overlay.classList.remove('visible');
}

// Asignar el evento de cierre al botón de cerrar y al fondo oscuro
document.querySelector('.cerrar-panel').addEventListener('click', cerrarModal);
document.querySelector('.panel-detalle-overlay').addEventListener('click', cerrarModal);

// Asignar el evento de clic para abrir el modal en cada bloque de vehículo
document.getElementById('contenedor-vehiculos').addEventListener('click', (e) => {
    const vehiculoBloque = e.target.closest('.vehiculo-bloque');
    if (vehiculoBloque) {
        abrirModal({
            imagen: vehiculoBloque.dataset.imagen,
            marca: vehiculoBloque.dataset.marca,
            descripcion: vehiculoBloque.dataset.descripcion,
            precio: vehiculoBloque.dataset.precio,
        });
    }
});
