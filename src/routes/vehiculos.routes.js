const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculos.controller');

module.exports = (client) => {
    vehiculosController.setClient(client);

    
    router.get('/', vehiculosController.getAllVehiculos);

    
    router.get('/marca/:marcaId', vehiculosController.getVehiculosByMarcaId);
    
    return router;
};
