
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

module.exports = (client) => {
    usuariosController.setClient(client);

    router.post('/register', usuariosController.crearUsuario);

    router.post('/login', usuariosController.iniciarSesion);

    return router;
};
