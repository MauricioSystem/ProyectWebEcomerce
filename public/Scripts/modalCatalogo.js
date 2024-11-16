// modalCatalogo.js

function abrirModal(vehiculo) {
    const modal = document.getElementById('panel-detalle');
    const overlay = document.querySelector('.panel-detalle-overlay');
    const imagenDetalle = document.getElementById('imagen-detalle');
    const marcaDetalle = document.getElementById('marca-detalle');
    const descripcionDetalle = document.getElementById('descripcion-detalle');
    const precioDetalle = document.getElementById('precio-detalle');
    
    // Asegurarse de que el id esté presente
    if (!vehiculo.id) {
        console.error("El ID del vehículo no está definido");
        return;
    }

    // Cargar los datos en el modal
    imagenDetalle.src = vehiculo.imagen;
    marcaDetalle.textContent = `Marca: ${vehiculo.marca}`;
    descripcionDetalle.textContent = `Descripción: ${vehiculo.descripcion}`;
    precioDetalle.textContent = `Precio: ${vehiculo.precio} Bs.`;

    // Agregar el ID del vehículo como atributo de datos en el botón
    const botonAgregar = document.getElementById("agregar-carrito");
    botonAgregar.setAttribute("data-id", vehiculo.id);

    // Mostrar el modal y el overlay
    modal.classList.add('visible');
    overlay.classList.add('visible');
}

// Evento para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('panel-detalle');
    const overlay = document.querySelector('.panel-detalle-overlay');
    modal.classList.remove('visible');
    overlay.classList.remove('visible');
}

document.querySelector('.cerrar-panel').addEventListener('click', cerrarModal);
document.querySelector('.panel-detalle-overlay').addEventListener('click', cerrarModal);

// Detectar clic en el contenedor de vehículos y abrir el modal con datos
document.getElementById('contenedor-vehiculos').addEventListener('click', (e) => {
    const vehiculoBloque = e.target.closest('.vehiculo-bloque');
    if (vehiculoBloque) {
        abrirModal({
            id: vehiculoBloque.dataset.id, // Incluye el ID del vehículo
            imagen: vehiculoBloque.dataset.imagen,
            marca: vehiculoBloque.dataset.marca,
            descripcion: vehiculoBloque.dataset.descripcion,
            precio: vehiculoBloque.dataset.precio,
        });
    }
});
