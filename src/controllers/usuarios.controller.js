const bcrypt = require('bcrypt'); 
let client;

function setClient(dbClient) {
    client = dbClient;
}


const crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        //no verifica nadaaaaaaaaaaaaaaaaaaaaa
        const checkUserQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const userExist = await client.query(checkUserQuery, [email]);
        
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        //aaaaaaaaaaaaaa esto no funciona
        const hashedPassword = await bcrypt.hash(password, 10);


        const insertUserQuery = `
            INSERT INTO usuarios (nombre, email, password, rol) 
            VALUES ($1, $2, $3, $4) RETURNING id, nombre
        `;
        const newUser = await client.query(insertUserQuery, [nombre, email, hashedPassword, rol]);
        const userId = newUser.rows[0].id;


        const insertCarritoQuery = `
            INSERT INTO carrito (usuario_id) 
            VALUES ($1) RETURNING session_id
        `;
        const newCarrito = await client.query(insertCarritoQuery, [userId]);


        res.status(201).json({ 
            message: 'Usuario y carrito creados con éxito', 
            user: { id: userId, nombre: newUser.rows[0].nombre, session_id: newCarrito.rows[0].session_id } 
        });
    } catch (error) {
        console.error('Error al crear usuario y carrito:', error);
        res.status(500).json({ error: 'Error al crear usuario y carrito' });
    }
};


const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const userResult = await client.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Obtener el session_id del carrito del usuario
        const carritoQuery = 'SELECT session_id FROM carrito WHERE usuario_id = $1';
        const carritoResult = await client.query(carritoQuery, [user.id]);
        const sessionId = carritoResult.rows[0]?.session_id;


        res.status(200).json({
            message: 'Usuario logeado correctamente',
            user: {
                id: user.id,
                nombre: user.nombre,
                sessionId,
                rol: user.rol 
            }
        });
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
