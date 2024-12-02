const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let client;

function setClient(dbClient) {
    client = dbClient;
}

const enviarCodigo = async (req, res) => {
    const { email } = req.body;

    try {
       
        const userQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const userResult = await client.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'El correo no está registrado.' });
        }

        const codigo = Math.floor(1000 + Math.random() * 9000).toString();
        const expiracion = new Date(Date.now() + 1 * 60 * 1000);  // 1 * 60 * 1000

        // Guardar el código 
        const codigoQuery = `
            INSERT INTO codigos_verificacion (email, codigo, expiracion)
            VALUES ($1, $2, $3)
            ON CONFLICT (email)
            DO UPDATE SET codigo = $2, expiracion = $3;
        `;
        await client.query(codigoQuery, [email, codigo, expiracion]);


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'codeservernazamanu@gmail.com',
                pass: 'iwpd uvlx twai xmdc',
            },
        });

        const mailOptions = {
            from: 'tu_email@gmail.com',
            to: email,
            subject: 'Código de recuperación',
            text: `Tu código de recuperación es: ${codigo}. Expira en 5 minutos.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Código enviado al correo.' });
    } catch (error) {
        console.error('Error al enviar el código:', error);
        res.status(500).json({ error: 'Error al enviar el código.' });
    }
};

const verificarCodigoYActualizarPassword = async (req, res) => {
    const { email, codigo, nuevaPassword } = req.body;

    try {
        const codigoQuery = `
            SELECT * FROM codigos_verificacion
            WHERE email = $1 AND codigo = $2 AND expiracion > NOW();
        `;
        const result = await client.query(codigoQuery, [email, codigo]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Código inválido o expirado.' });
        }

        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        const updateQuery = `UPDATE usuarios SET password = $1 WHERE email = $2`;
        await client.query(updateQuery, [hashedPassword, email]);

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar contraseña.' });
    }
};

module.exports = {
    setClient,
    enviarCodigo,
    verificarCodigoYActualizarPassword,
};
