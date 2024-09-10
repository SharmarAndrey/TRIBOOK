const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers/index');  // Import your main controllers
const authControllers = require('../controllers/auth');    // Import your auth controllers

// Public routes
router.get('/', indexControllers.getApartments);          // Home route to list apartments
router.get('/search', indexControllers.searchApartments); // Route to handle search
router.get('/getCities', indexControllers.getCities);     // Route to fetch cities based on the selected province
router.get('/apartment/:apartmentId', indexControllers.getApartmentDetails); // Route to view a single apartment

// Reservation route
router.post('/apartment/new-reservation', indexControllers.createNewReservation);

// Authentication routes
router.get('/login', authControllers.getLogin);
router.post('/login', authControllers.postLogin);
router.get('/logout', authControllers.logout);
router.get('/register', authControllers.getRegister);
router.post('/register', authControllers.postRegister);

module.exports = router;
