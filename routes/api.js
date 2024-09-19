const express = require('express');
const router = express.Router();

// Importar los controladores
const { getApartments, searchApartments } = require('../controllers/api');

// Rutas de la API
router.get('/apartments', getApartments);
router.get('/apartments/search', searchApartments);

module.exports = router;
