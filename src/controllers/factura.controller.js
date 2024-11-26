let client;

function setClient(dbClient) {
    client = dbClient;
}

const crearFactura = async (req, res) => {
    const { sessionId, usuarioId } = req.body;

    if (!sessionId || !usuarioId) {
        return res.status(400).json({ error: 'sessionId y usuarioId son requeridos.' });
    }

    try {
        const carritoQuery = `
            SELECT cv.vehiculo_id, cv.cantidad, v.precio
            FROM carrito_vehiculos cv
            INNER JOIN carrito c ON cv.carrito_id = c.id
            INNER JOIN vehiculos v ON cv.vehiculo_id = v.id
            WHERE c.session_id = $1
        `;
        const carritoResult = await client.query(carritoQuery, [sessionId]);
        const carritoItems = carritoResult.rows;

        if (carritoItems.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío.' });
        }

        const total = carritoItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0);


        const facturaQuery = `
            INSERT INTO facturas (usuario_id, total) 
            VALUES ($1, $2) RETURNING id
        `;
        const facturaResult = await client.query(facturaQuery, [usuarioId, total]);
        const facturaId = facturaResult.rows[0].id;

        const detallesQuery = `
            INSERT INTO detalles_factura (factura_id, vehiculo_id, cantidad, precio_unitario)
            VALUES ($1, $2, $3, $4)
        `;
        for (const item of carritoItems) {
            await client.query(detallesQuery, [
                facturaId,
                item.vehiculo_id,
                item.cantidad,
                item.precio
            ]);
        }

        const vaciarCarritoQuery = `
            DELETE FROM carrito_vehiculos
            WHERE carrito_id = (SELECT id FROM carrito WHERE session_id = $1)
        `;
        await client.query(vaciarCarritoQuery, [sessionId]);

        res.status(201).json({ message: 'Factura creada con éxito.', facturaId });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ error: 'Error al crear la factura.' });
    }
};


module.exports = {
    setClient,
    crearFactura,
};
