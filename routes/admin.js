// Rutas de administrador

// Rutas "públicas" de la app
const express = require('express');
const router = express.Router();

// importar todos los controladores de controllers/admin.js

// Crear primer endpoint de administrador que es el que nos permite mostrar un formulario para añadir un nuevo apartamento
const adminControllers = require('../controllers/admin.js');

router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);

// Nuevo endpoint de tipo POST para crear un nuevo apartamento
router.post('/apartment/new-apartment', adminControllers.postNewApartment);

module.exports = router;