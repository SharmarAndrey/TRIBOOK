const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers/index');

router.get('/', indexControllers.getApartments);

// Paso 2 Buscar apartamentos: Crear una nueva ruta al endpoint /search . Debe ejecutar el controlador indexControllers.searchApartments
router.get('/search', indexControllers.searchApartments);

router.get('/apartment/:apartmentId', indexControllers.getApartmentDetails);

module.exports = router;
