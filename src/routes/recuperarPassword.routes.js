const express = require('express');
const router = express.Router();
const recuperarPasswordController = require('../controllers/recuperarPassword.controller');

module.exports = (client) => {
    recuperarPasswordController.setClient(client);

    router.post('/enviar-codigo', recuperarPasswordController.enviarCodigo); // Envía código
    router.put('/verificar-codigo', recuperarPasswordController.verificarCodigoYActualizarPassword); // Verifica y actualiza

    return router;
};
