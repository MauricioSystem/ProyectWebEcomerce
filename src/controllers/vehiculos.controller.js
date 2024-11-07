let client; 

function setClient(dbClient) {
    client = dbClient;
}

const getAllVehiculos = async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id,
                m.nombre AS marca,
                t.tipo AS tipo_vehiculo,
                v.descripcion,
                v.precio,
                v.imagen
            FROM 
                vehiculos v
            INNER JOIN 
                marcas m ON v.marca_id = m.id
            INNER JOIN 
                tipos_vehiculos t ON v.tipo_id = t.id
        `;

        const result = await client.query(query);
        res.json(result.rows); 
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        res.status(500).json({ error: 'Error al obtener los vehículos' });
    }
};

module.exports = {
    getAllVehiculos,
    setClient
};


const getVehiculosByMarcaId = async (req, res) => {
    const marcaId = parseInt(req.params.marcaId, 10); 

    if (isNaN(marcaId)) {
        return res.status(400).json({ error: "ID de marca no válido" });
    }

    try {
        const query = `
            SELECT 
                v.id,
                m.nombre AS marca,
                t.tipo AS tipo_vehiculo,
                v.descripcion,
                v.precio,
                v.imagen
            FROM 
                vehiculos v
            INNER JOIN 
                marcas m ON v.marca_id = m.id
            INNER JOIN 
                tipos_vehiculos t ON v.tipo_id = t.id
            WHERE 
                v.marca_id = $1;
        `;

        const result = await client.query(query, [marcaId]);
        res.json(result.rows); 
    } catch (error) {
        console.error(`Error al obtener los vehículos de la marca con ID ${marcaId}:`, error);
        res.status(500).json({ error: `Error al obtener los vehículos de la marca con ID ${marcaId}` });
    }
};

module.exports = {
    getAllVehiculos,
    getVehiculosByMarcaId,
    setClient
};
