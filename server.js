const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Client } = require('pg');
const vehiculosRoutes = require('./src/routes/vehiculos.routes'); 
const usuariosRoutes = require('./src/routes/usuarios.routes');

const app = express();
const PORT = 3000;

// Configura el middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json());
app.use(express.static('public'));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1010',
    port: 5432,
});

client.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error al conectar a PostgreSQL:', err));

app.use('/api/vehiculos', vehiculosRoutes(client));
app.use('/api/usuarios', usuariosRoutes(client));

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});


