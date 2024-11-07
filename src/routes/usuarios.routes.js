
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

module.exports = (client) => {
    usuariosController.setClient(client);

    // Ruta para crear un nuevo usuario
    router.post('/register', usuariosController.crearUsuario);

    // Ruta para iniciar sesión
    router.post('/login', usuariosController.iniciarSesion);

    return router;
};
