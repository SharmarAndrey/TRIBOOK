const express = require('express');
const router = express.Router();
const { body } = require('express-validator');  // Add this line
const adminControllers = require('../controllers/admin');

function isAdmin(req, res, next) {
	if (req.session.isAdmin) {
		console.log('Admin access granted');
		next();
	} else {
		console.log('Admin access denied, redirecting to /login');
		res.redirect('/login');
	}
}

// Routes for managing apartments
router.get('/apartment/new-apartment', isAdmin, adminControllers.getNewApartmentForm);

router.post('/apartment/new-apartment', [
	body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
	body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
	body('rooms').isInt({ gt: 0 }).withMessage('Rooms must be a positive integer'),
	body('mainPhoto').isURL().withMessage('Invalid mainPhoto URL'),
], isAdmin, adminControllers.createNewApartment);

router.get('/apartment/:id/edit', isAdmin, adminControllers.getEditApartmentForm);
router.post('/apartment/:id', isAdmin, adminControllers.updateApartment);
router.post('/apartment/:id/delete', isAdmin, adminControllers.deleteApartment);
router.get('/reservations', isAdmin, adminControllers.getReservations);
router.post('/reservations/cancel/:reservationId', isAdmin, adminControllers.cancelReservation);
router.get('/reservations/:id', isAdmin, adminControllers.getReservationDetails);

module.exports = router;
