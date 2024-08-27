const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin.js');

router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);
router.post('/apartment/new-apartment', adminControllers.createNewApartment);

module.exports = router;
