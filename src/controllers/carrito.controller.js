
let client;

function setClient(dbClient) {
    client = dbClient;
}


const createAnonymousCarrito = async (req, res) => {
    try {
        const result = await client.query(`
            INSERT INTO carrito (session_id) VALUES (gen_random_uuid())
            RETURNING id, session_id
        `);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear carrito anónimo:", error);
        res.status(500).json({ error: "Error al crear carrito anónimo" });
    }
};


const addToCarrito = async (req, res) => {
    const { sessionId, vehiculoId, cantidad } = req.body;

    if (!sessionId || !vehiculoId) {
        console.error("Faltan parámetros: sessionId o vehiculoId");
        return res.status(400).json({ error: "sessionId y vehiculoId son requeridos" });
    }

    try {

        const carritoResult = await client.query(`SELECT id FROM carrito WHERE session_id = $1`, [sessionId]);
        const carritoId = carritoResult.rows[0]?.id;

        if (!carritoId) {
            console.error(`Carrito no encontrado para sessionId: ${sessionId}`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        console.log(`Añadiendo vehiculoId ${vehiculoId} al carritoId ${carritoId} con cantidad ${cantidad}`);


        const insertResult = await client.query(`
            INSERT INTO carrito_vehiculos (carrito_id, vehiculo_id, cantidad) 
            VALUES ($1, $2, $3)
            ON CONFLICT (carrito_id, vehiculo_id) 
            DO UPDATE SET cantidad = carrito_vehiculos.cantidad + $3
        `, [carritoId, vehiculoId, cantidad]);

        console.log("Resultado de inserción o actualización:", insertResult.rowCount);
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(500).json({ error: 'Error al añadir al carrito' });
    }
};


const getCarritoBySession = async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        console.error("sessionId es requerido");
        return res.status(400).json({ error: "sessionId es requerido" });
    }

    try {
        const result = await client.query(`
            SELECT cv.vehiculo_id, cv.cantidad, v.descripcion, v.precio, m.nombre AS marca
            FROM carrito c
            INNER JOIN carrito_vehiculos cv ON c.id = cv.carrito_id
            INNER JOIN vehiculos v ON cv.vehiculo_id = v.id
            LEFT JOIN marcas m ON v.marca_id = m.id
            WHERE c.session_id = $1
        `, [sessionId]);

        if (result.rows.length === 0) {
            console.log(`esto tienes q eliminar ${sessionId}`);
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
};


const updateCarrito = async (req, res) => {
    const { sessionId, vehiculoId, cantidad } = req.body;

    if (!sessionId || !vehiculoId) {
        console.error("Faltan parámetros: sessionId o vehiculoId");
        return res.status(400).json({ error: "sessionId y vehiculoId son requeridos" });
    }

    try {
        const updateResult = await client.query(`
            UPDATE carrito_vehiculos 
            SET cantidad = $1 
            WHERE vehiculo_id = $2 
            AND carrito_id = (SELECT id FROM carrito WHERE session_id = $3)
        `, [cantidad, vehiculoId, sessionId]);

        if (updateResult.rowCount === 0) {
            console.log(`No se encontró el producto en el carrito para actualizar, vehiculoId: ${vehiculoId}`);
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        res.json({ message: "Carrito actualizado" });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
};


const removeFromCarrito = async (req, res) => {
    const { sessionId, vehiculoId } = req.body;

    if (!sessionId || !vehiculoId) {
        console.error("Faltan parámetros: sessionId o vehiculoId");
        return res.status(400).json({ error: "sessionId y vehiculoId son requeridos" });
    }

    try {
        const deleteResult = await client.query(`
            DELETE FROM carrito_vehiculos 
            WHERE vehiculo_id = $1 
            AND carrito_id = (SELECT id FROM carrito WHERE session_id = $2)
        `, [vehiculoId, sessionId]);

        if (deleteResult.rowCount === 0) {
            console.log(`Producto no encontrado en el carrito para eliminar, vehiculoId: ${vehiculoId}`);
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        res.status(500).json({ error: "Error al eliminar del carrito" });
    }
};

module.exports = {
    setClient,
    createAnonymousCarrito,
    addToCarrito,
    getCarritoBySession,
    updateCarrito,
    removeFromCarrito
};
