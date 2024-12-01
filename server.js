const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Importar rutas
const vehiculosRoutes = require('./src/routes/vehiculos.routes'); 
const usuariosRoutes = require('./src/routes/usuarios.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const facturaRoutes = require('./src/routes/factura.routes');
const detalleFacturaRoutes = require('./src/routes/detalleFactura.routes');
const recuperarPasswordRoutes = require('./src/routes/recuperarPassword.routes');

// Inicializar aplicación
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear directorio para uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuración de la base de datos PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1010',
    port: 5432,
});

// Conexión a PostgreSQL
client.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error al conectar a PostgreSQL:', err));

// Rutas
app.use('/api/vehiculos', vehiculosRoutes(client));
app.use('/api/usuarios', usuariosRoutes(client));
app.use('/api/carrito', carritoRoutes(client));
app.use('/api/factura', facturaRoutes(client));
app.use('/api/detalles_factura', detalleFacturaRoutes(client));
app.use('/api/recuperar-password', recuperarPasswordRoutes(client));

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({ error: 'Ha ocurrido un error inesperado.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
