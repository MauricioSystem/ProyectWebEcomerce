const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');

module.exports = (client) => {
    carritoController.setClient(client);

    router.post('/crear', carritoController.createAnonymousCarrito);   // anunimus ghosface
    router.post('/anadir', carritoController.addToCarrito);       
    router.get('/:sessionId', carritoController.getCarritoBySession);  
    router.put('/editar/:vehiculoId', carritoController.updateCarrito);  
    router.delete('/eliminar/:vehiculoId', carritoController.removeFromCarrito);  

    return router;
};
