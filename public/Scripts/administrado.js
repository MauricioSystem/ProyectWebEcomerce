document.addEventListener('DOMContentLoaded', async () => {
    const nombreAdmin = document.getElementById('nombre-admin');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    const crearVehiculoBtn = document.getElementById('crear-vehiculo');

    // Mostrar el nombre del administrador dinámicamente
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        nombreAdmin.textContent = nombreUsuario;
    } else {
        nombreAdmin.textContent = 'Administrador'; // Fallback si no hay datos
    }

    // Manejo del botón de cerrar sesión
    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.clear(); // Limpia la sesión
        window.location.href = '/public/inicioSesion.html'; // Redirige al inicio de sesión
    });

    // Cargar y mostrar los vehículos
    async function cargarVehiculos() {
        try {
            const response = await fetch('http://localhost:3000/api/vehiculos', { mode: 'cors' });
            if (!response.ok) {
                throw new Error('Error al obtener los vehículos.');
            }
            const vehiculos = await response.json();
            mostrarVehiculos(vehiculos);
        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
        }
    }

    // Mostrar los vehículos en el contenedor
    function mostrarVehiculos(vehiculos) {
        const contenedor = document.getElementById('vehiculos-contenedor');
        if (!contenedor) {
            console.error('Error: No se encontró el contenedor de vehículos.');
            return;
        }

        contenedor.innerHTML = ''; // Limpiar contenido previo

        vehiculos.forEach((vehiculo) => {
            const vehiculoBloque = document.createElement('div');
            vehiculoBloque.className = 'vehiculo-bloque';

            // Asignar todos los atributos de datos
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
                <div class="acciones">
                    <button class="editar" data-id="${vehiculo.id}">Editar</button>
                    <button class="eliminar" data-id="${vehiculo.id}">Eliminar</button>
                </div>
            `;

            // Agregar eventos para eliminar y editar
            vehiculoBloque.querySelector('.eliminar').addEventListener('click', () => eliminarVehiculo(vehiculo.id));
            vehiculoBloque.querySelector('.editar').addEventListener('click', () => abrirModal(vehiculo));

            contenedor.appendChild(vehiculoBloque);
        });
    }

    // Eliminar un vehículo
    async function eliminarVehiculo(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el vehículo.');
            }
            alert('Vehículo eliminado correctamente.');
            cargarVehiculos(); // Recargar la lista de vehículos
        } catch (error) {
            console.error('Error al eliminar el vehículo:', error);
        }
    }

    // Abrir modal para editar un vehículo
    function abrirModal(vehiculo) {
        const modal = document.getElementById('adminModal');
        const marcaField = document.getElementById('marca');
        const tipoField = document.getElementById('tipo');
        const descripcionField = document.getElementById('descripcion');
        const precioField = document.getElementById('precio');
        const guardarCambiosBtn = document.getElementById('guardarCambios');

        // Prellenar el formulario con los datos del vehículo
        marcaField.value = vehiculo.marca_id;
        tipoField.value = vehiculo.tipo_id;
        descripcionField.value = vehiculo.descripcion;
        precioField.value = vehiculo.precio;

        // Mostrar el modal
        modal.style.display = 'flex';

        // Agregar el evento de guardar cambios
        guardarCambiosBtn.onclick = async function () {
            const data = {
                marca_id: parseInt(marcaField.value, 10),
                tipo_id: parseInt(tipoField.value, 10),
                descripcion: descripcionField.value,
                precio: parseFloat(precioField.value),
            };

            try {
                const response = await fetch(`http://localhost:3000/api/vehiculos/${vehiculo.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el vehículo.');
                }

                alert('Vehículo actualizado correctamente.');
                modal.style.display = 'none'; // Cerrar el modal
                cargarVehiculos(); // Recargar la lista
            } catch (error) {
                console.error('Error al actualizar el vehículo:', error);
                alert('Hubo un problema al actualizar el vehículo.');
            }
        };
    }

    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        const modal = document.getElementById('adminModal');
        modal.style.display = 'none';
    });

    // Crear un nuevo vehículo (Redirige a la página de creación)
    crearVehiculoBtn.addEventListener('click', () => {
        window.location.href = '/public/crearVehiculo.html';
    });

    
    cargarVehiculos();
});
