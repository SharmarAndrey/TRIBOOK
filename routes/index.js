const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers/index');
const authControllers = require('../controllers/auth');

router.get('/', indexControllers.getApartments);
router.get('/search', indexControllers.searchApartments);
router.get('/apartment/:apartmentId', indexControllers.getApartmentDetails);
router.post('/apartment/new-reservation', indexControllers.createNewReservation);

router.get('/login', authControllers.getLogin);
router.post('/login', authControllers.postLogin);
router.get('/logout', authControllers.logout);

module.exports = router;
