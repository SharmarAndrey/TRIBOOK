const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers/index');
const authControllers = require('../controllers/auth');

// Public routes
router.get('/', indexControllers.getApartments);
router.get('/search', indexControllers.searchApartments);
router.get('/apartment/:apartmentId', indexControllers.getApartmentDetails);
router.post('/apartment/new-reservation', indexControllers.createNewReservation);

// Authentication routes
router.get('/login', authControllers.getLogin);
router.post('/login', authControllers.postLogin);
router.get('/logout', authControllers.logout);

router.get('/register', authControllers.getRegister);
router.post('/register', authControllers.postRegister);

router.get('/getCities', async (req, res) => {
	const { province } = req.query;

	// Example cities data (in production, you'd query the database)
	const citiesByProvince = {
		Province1: ['City1', 'City2'],
		Province2: ['City3', 'City4']
	};

	const cities = citiesByProvince[province] || [];

	res.json({ cities });
});


module.exports = router;
