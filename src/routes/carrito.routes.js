const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');

module.exports = (client) => {
    carritoController.setClient(client);

    // Ruta para crear un carrito 
    router.post('/carrito/crear', carritoController.createAnonymousCarrito);

    // Ruta para asociar un carrito a un usuario al iniciar sesión
    router.put('/carrito/asociar/:usuarioId', carritoController.associateCarritoToUser);

    // Ruta para añadir 
    router.post('/carrito/anadir', carritoController.addToCarrito);

    // Ruta para eliminar 
    router.delete('/carrito/eliminar/:vehiculoId', carritoController.removeFromCarrito);

    // Ruta para editar la cantidad de un producto en el carrito
    router.put('/carrito/editar/:vehiculoId', carritoController.updateCarrito);

    return router;
};
