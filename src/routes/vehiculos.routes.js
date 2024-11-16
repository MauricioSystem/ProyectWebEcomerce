const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculos.controller');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

module.exports = (client) => {
    vehiculosController.setClient(client);

    router.get('/', vehiculosController.getAllVehiculos);
    router.get('/marca/:marcaId', vehiculosController.getVehiculosByMarcaId);
    router.post('/', upload.single('imagen'), vehiculosController.createVehiculo);
    router.put('/:id', upload.single('imagen'), vehiculosController.updateVehiculo);
    router.delete('/:id', vehiculosController.deleteVehiculo);

    return router;
};
