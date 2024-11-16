// CatalogoApi.js

async function obtenerVehiculos() { 
    try {
        const response = await fetch('http://localhost:3000/api/vehiculos', { mode: 'cors' });
        const vehiculos = await response.json();
        mostrarVehiculos(vehiculos);
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
    }
}

function mostrarVehiculos(vehiculos) {
    const contenedor = document.getElementById('contenedor-vehiculos');
    contenedor.innerHTML = '';

    vehiculos.forEach(vehiculo => {
        const vehiculoBloque = document.createElement('div');
        vehiculoBloque.className = 'vehiculo-bloque';

        // Asignar todos los atributos de datos incluyendo el ID
        vehiculoBloque.dataset.id = vehiculo.id;
        vehiculoBloque.dataset.imagen = vehiculo.imagen;
        vehiculoBloque.dataset.marca = vehiculo.marca;
        vehiculoBloque.dataset.descripcion = vehiculo.descripcion;
        vehiculoBloque.dataset.precio = vehiculo.precio;

        vehiculoBloque.innerHTML = `
            <img src="${vehiculo.imagen}" alt="${vehiculo.descripcion}" class="imagen-vehiculo">
            <p class="marca">Marca: ${vehiculo.marca}</p>
            <p class="precio">${vehiculo.precio} Bs.</p>
            <p class="descripcion">${vehiculo.descripcion}</p>
        `;

        // Evento para abrir el modal
        vehiculoBloque.addEventListener('click', () => {
            abrirModal({
                id: vehiculo.id,
                imagen: vehiculo.imagen,
                marca: vehiculo.marca,
                descripcion: vehiculo.descripcion,
                precio: vehiculo.precio
            });
        });

        contenedor.appendChild(vehiculoBloque);
    });
}
3000
document.addEventListener('DOMContentLoaded', obtenerVehiculos);

async function obtenerVehiculosPorMarca(marcaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/vehiculos/marca/${marcaId}`);
        const vehiculos = await response.json();
        mostrarVehiculos(vehiculos); 
    } catch (error) {
        console.error(`Error al obtener los vehículos de la marca con ID ${marcaId}:`, error);
    }
}

document.querySelectorAll('#marcas-autos li, #marcas-motos li').forEach((item) => {
    item.addEventListener('click', () => {
        const marcaId = item.getAttribute('data-id'); 
        obtenerVehiculosPorMarca(marcaId); 
    });
});
