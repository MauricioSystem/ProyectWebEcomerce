const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');
const multer = require('multer'); // Importar multer
const path = require('path');

// Configurar Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ storage }); // Inicializar Multer

module.exports = (client) => {
    carritoController.setClient(client);

    router.post('/crear', carritoController.createAnonymousCarrito); // Crear carrito anónimo
    router.post('/anadir', carritoController.addToCarrito); // Añadir al carrito
    router.get('/:sessionId', carritoController.getCarritoBySession); // Obtener carrito por sesión
    router.put('/editar/:vehiculoId', carritoController.updateCarrito); // Editar cantidad de producto en carrito
    router.delete('/eliminar/:vehiculoId', carritoController.removeFromCarrito); // Eliminar producto del carrito

    // Confirmar compra con comprobante
    router.post('/confirmar-compra', upload.single('file'), carritoController.confirmarCompra);

    return router;
};
