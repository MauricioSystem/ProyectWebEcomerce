const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');

module.exports = (client) => {
    carritoController.setClient(client);

    router.post('/crear', carritoController.createAnonymousCarrito);   // Ruta para crear carrito anónimo
    router.post('/anadir', carritoController.addToCarrito);       // Añadir al carrito
    router.get('/:sessionId', carritoController.getCarritoBySession);  // Obtener el carrito
    router.put('/editar/:vehiculoId', carritoController.updateCarrito);  // Actualizar cantidad
    router.delete('/eliminar/:vehiculoId', carritoController.removeFromCarrito);  // Eliminar del carrito



    return router;
};
