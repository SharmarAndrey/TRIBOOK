const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers/index');

router.get('/', indexControllers.getApartments);
router.get('/search', indexControllers.searchApartments);
router.get('/apartment/:apartmentId', indexControllers.getApartmentDetails);

module.exports = router;
