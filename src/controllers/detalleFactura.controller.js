let client;

function setClient(dbClient) {
    client = dbClient;
}

const obtenerDetallesFactura = async (req, res) => {
    try {
        const query = `
            SELECT 
                df.id AS detalle_id,
                f.id AS factura_id,
                u.nombre AS cliente,
                v.descripcion AS vehiculo,
                df.cantidad,
                df.precio_unitario,
                (df.cantidad * df.precio_unitario) AS subtotal,
                f.fecha AS fecha_factura
            FROM 
                detalles_factura df
            INNER JOIN 
                facturas f ON df.factura_id = f.id
            INNER JOIN 
                usuarios u ON f.usuario_id = u.id
            INNER JOIN 
                vehiculos v ON df.vehiculo_id = v.id;
        `;

        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de factura:', error);
        res.status(500).json({ error: 'Error al obtener los detalles de factura.' });
    }
};


const getDetallesFacturaPorUsuario = async (req, res) => {
    const usuarioId = req.params.usuarioId;

    if (!usuarioId) {
        return res.status(400).json({ error: 'Usuario ID no proporcionado.' });
    }

    try {
        const query = `
            SELECT 
                df.id AS detalle_id,
                f.id AS factura_id,
                v.descripcion AS vehiculo,
                df.cantidad,
                df.precio_unitario,
                (df.cantidad * df.precio_unitario) AS subtotal,
                f.fecha AS fecha_factura
            FROM 
                detalles_factura df
            INNER JOIN 
                facturas f ON df.factura_id = f.id
            INNER JOIN 
                vehiculos v ON df.vehiculo_id = v.id
            WHERE 
                f.usuario_id = $1;
        `;

        const result = await client.query(query, [usuarioId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener detalles de factura por usuario:', error);
        res.status(500).json({ error: 'Error al obtener detalles de factura por usuario.' });
    }
};

module.exports = {
    setClient,
    obtenerDetallesFactura,
    getDetallesFacturaPorUsuario,
};
