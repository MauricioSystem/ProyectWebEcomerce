function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.classList.toggle('mostrar');
}


document.getElementById('boton-auto').addEventListener('click', (event) => {
    toggleMenu('marcas-autos');
    document.getElementById('marcas-motos').classList.remove('mostrar');
    event.stopPropagation();
});

document.getElementById('boton-moto').addEventListener('click', (event) => {
    toggleMenu('marcas-motos');
    document.getElementById('marcas-autos').classList.remove('mostrar');
    event.stopPropagation();
});

document.addEventListener('click', () => {
    document.getElementById('marcas-autos').classList.remove('mostrar');
    document.getElementById('marcas-motos').classList.remove('mostrar');
});

async function obtenerVehiculosPorMarca(marcaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/vehiculos/marca/${marcaId}`);
        const vehiculos = await response.json();
        mostrarVehiculos(vehiculos);
    } catch (error) {
        console.error(`Error al obtener los vehículos de la marca con ID ${marcaId}:`, error);
    }
}



