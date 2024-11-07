let client;

function setClient(dbClient) {
    client = dbClient;
}

// Crear un carrito sin usuario (carrito anónimo)
const createAnonymousCarrito = async (req, res) => {
    try {
        const result = await client.query(`
            INSERT INTO carrito (session_id) VALUES (gen_random_uuid())
            RETURNING id, session_id
        `);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear carrito anónimo:', error);
        res.status(500).json({ error: 'Error al crear carrito anónimo' });
    }
};

// Asociar un carrito temporal a un usuario al iniciar sesión
const associateCarritoToUser = async (req, res) => {
    const { usuarioId } = req.params;
    const { sessionId } = req.body;

    try {
        await client.query(`
            UPDATE carrito 
            SET usuario_id = $1 
            WHERE session_id = $2
        `, [usuarioId, sessionId]);

        res.status(200).json({ message: 'Carrito asociado al usuario' });
    } catch (error) {
        console.error('Error al asociar carrito al usuario:', error);
        res.status(500).json({ error: 'Error al asociar carrito al usuario' });
    }
};


const addToCarrito = async (req, res) => {
    const { sessionId, vehiculoId, cantidad } = req.body;
    try {
        const carritoResult = await client.query(`
            SELECT id FROM carrito 
            WHERE session_id = $1
        `, [sessionId]);

        const carritoId = carritoResult.rows[0]?.id;
        if (!carritoId) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        await client.query(`
            INSERT INTO carrito_vehiculos (carrito_id, vehiculo_id, cantidad) 
            VALUES ($1, $2, $3)
            ON CONFLICT (carrito_id, vehiculo_id) 
            DO UPDATE SET cantidad = carrito_vehiculos.cantidad + $3
        `, [carritoId, vehiculoId, cantidad]);

        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(500).json({ error: 'Error al añadir al carrito' });
    }
};

const removeFromCarrito = async (req, res) => {
    const { sessionId, vehiculoId } = req.params;
    try {
        const result = await client.query(`
            DELETE FROM carrito_vehiculos 
            USING carrito
            WHERE carrito.id = carrito_vehiculos.carrito_id 
            AND carrito.session_id = $1
            AND carrito_vehiculos.vehiculo_id = $2
        `, [sessionId, vehiculoId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        } else {
            res.status(200).json({ message: 'Producto eliminado del carrito' });
        }
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
};


const updateCarrito = async (req, res) => {
    const { sessionId, vehiculoId, cantidad } = req.body;
    try {
        const result = await client.query(`
            UPDATE carrito_vehiculos 
            SET cantidad = $1
            FROM carrito
            WHERE carrito.id = carrito_vehiculos.carrito_id 
            AND carrito.session_id = $2 
            AND carrito_vehiculos.vehiculo_id = $3
        `, [cantidad, sessionId, vehiculoId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        } else {
            res.status(200).json({ message: 'Carrito actualizado' });
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};

module.exports = {
    setClient,
    createAnonymousCarrito,
    associateCarritoToUser,
    addToCarrito,
    removeFromCarrito,
    updateCarrito
};
