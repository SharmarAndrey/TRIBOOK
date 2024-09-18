const express = require('express');
const router = express.Router();
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
router.post('/apartment/new-apartment', isAdmin, adminControllers.createNewApartment);
router.get('/apartment/:id/edit', isAdmin, adminControllers.getEditApartmentForm);
router.post('/apartment/:id', isAdmin, adminControllers.updateApartment);
router.post('/apartment/:id/delete', isAdmin, adminControllers.deleteApartment);
router.get('/reservations', isAdmin, adminControllers.getReservations);
router.post('/reservations/cancel/:reservationId', isAdmin, adminControllers.cancelReservation);

module.exports = router;

