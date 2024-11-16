const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller'); 

module.exports = (client) => {
    facturaController.setClient(client); // Configurar el cliente para el controlador

    // Ruta para crear una factura
    router.post('/crear', facturaController.crearFactura);

    return router;
};
