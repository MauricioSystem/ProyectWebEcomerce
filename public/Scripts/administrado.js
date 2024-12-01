document.addEventListener('DOMContentLoaded', async () => {
    const nombreAdmin = document.getElementById('nombre-admin');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    const crearVehiculoBtn = document.getElementById('crear-vehiculo');
    const verFacturasBtn = document.getElementById('ver-facturas'); 

    // mostrar el nombre del admin igual el pinche usuario 
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        nombreAdmin.textContent = nombreUsuario;
    } else {
        nombreAdmin.textContent = 'Administrador'; 
    }

   
    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.clear(); 
        window.location.href = '/public/index.html'; 
    });

    
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


    function mostrarVehiculos(vehiculos) {
        const contenedor = document.getElementById('vehiculos-contenedor');
        if (!contenedor) {
            console.error('Error: No se encontró el contenedor de vehículos.');
            return;
        }

        contenedor.innerHTML = ''; 

        vehiculos.forEach((vehiculo) => {
            const vehiculoBloque = document.createElement('div');
            vehiculoBloque.className = 'vehiculo-bloque';

            
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

            
            vehiculoBloque.querySelector('.eliminar').addEventListener('click', () => eliminarVehiculo(vehiculo.id));
            vehiculoBloque.querySelector('.editar').addEventListener('click', () => abrirModal(vehiculo));

            contenedor.appendChild(vehiculoBloque);
        });
    }

    
    async function eliminarVehiculo(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el vehículo.');
            }
            cargarVehiculos(); 
        } catch (error) {
            console.error('Error al eliminar el vehículo:', error);
        }
    }



    //modal maldiytooooooo
    function abrirModal(vehiculo) {
        const modal = document.getElementById('adminModal');
        const marcaField = document.getElementById('marca');
        const tipoField = document.getElementById('tipo');
        const descripcionField = document.getElementById('descripcion');
        const precioField = document.getElementById('precio');
        const guardarCambiosBtn = document.getElementById('guardarCambios');


        marcaField.value = vehiculo.marca_id || '';
        tipoField.value = vehiculo.tipo_id || '';
        descripcionField.value = vehiculo.descripcion || '';
        precioField.value = vehiculo.precio || '';


        modal.style.display = 'flex';


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
                modal.style.display = 'none';
                cargarVehiculos(); 
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

    


    crearVehiculoBtn.addEventListener('click', () => {
        window.location.href = '/public/crearVehiculo.html';
    });
    verFacturasBtn.addEventListener('click', () => {
        window.location.href = '/public/vistaFactura.html';
    });


    cargarVehiculos();
});
