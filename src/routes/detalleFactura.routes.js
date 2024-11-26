const express = require('express');
const router = express.Router();
const detalleFacturaController = require('../controllers/detalleFactura.controller');

module.exports = (client) => {
    detalleFacturaController.setClient(client);

    router.get('/', detalleFacturaController.obtenerDetallesFactura);

    router.get('/usuario/:usuarioId', detalleFacturaController.getDetallesFacturaPorUsuario);
    

    return router;
};
