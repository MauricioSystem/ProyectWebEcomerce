const fs = require('fs');
const path = require('path');
let client;

function setClient(dbClient) {
    client = dbClient;
}

// Obtener todos los vehículos
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

// Obtener vehículos por marca
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

// Crear un nuevo vehículo
const createVehiculo = async (req, res) => {
    const { marca_id, tipo_id, descripcion, precio } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!marca_id || !tipo_id || !descripcion || !precio) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    try {
        const query = `
            INSERT INTO vehiculos (marca_id, tipo_id, descripcion, precio, imagen)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await client.query(query, [marca_id, tipo_id, descripcion, precio, imagen]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ error: 'Error al crear vehículo' });
    }
};



// Editar un vehículo existente
const updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { marca_id, tipo_id, descripcion, precio } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const query = `
            UPDATE vehiculos
            SET marca_id = $1, tipo_id = $2, descripcion = $3, precio = $4, imagen = COALESCE($5, imagen)
            WHERE id = $6
            RETURNING *;
        `;
        const result = await client.query(query, [marca_id, tipo_id, descripcion, precio, imagen, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        res.status(500).json({ error: 'Error al actualizar vehículo' });
    }
};

// Eliminar un vehículo
const deleteVehiculo = async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar vehículo por ID
        const query = `DELETE FROM vehiculos WHERE id = $1 RETURNING *;`;
        const result = await client.query(query, [id]);

        // Verificar si el vehículo existía
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Eliminar archivo de imagen asociado, si existe
        const vehiculo = result.rows[0];
        if (vehiculo.imagen) {
            const filePath = path.join(__dirname, '../../', vehiculo.imagen);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
};

module.exports = {
    setClient,
    getAllVehiculos,
    getVehiculosByMarcaId,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
};
