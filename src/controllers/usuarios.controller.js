// src/controllers/usuarios.controller.js
const bcrypt = require('bcrypt'); // IMPORTACIÓN ÚNICA
let client;

function setClient(dbClient) {
    client = dbClient;
}

// Función para crear un nuevo usuario
const crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        const checkUserQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const userExist = await client.query(checkUserQuery, [email]);
        
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO usuarios (nombre, email, password, rol) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        
        const newUser = await client.query(insertQuery, [nombre, email, hashedPassword, rol]);
        
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

// Función para iniciar sesión
const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        const loginQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await client.query(loginQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.status(200).json({ message: 'Usuario logeado correctamente', user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = {
    setClient,
    crearUsuario,
    iniciarSesion,
};
