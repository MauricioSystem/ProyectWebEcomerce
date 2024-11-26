const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller'); 

module.exports = (client) => {
    facturaController.setClient(client); 


    router.post('/crear', facturaController.crearFactura);

    return router;
};
