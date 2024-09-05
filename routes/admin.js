const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin');

// Middleware to check admin rights
function isAdmin(req, res, next) {
	if (req.session.isAdmin) {
		next();
	} else {
		res.redirect('/login');
	}
}

// Apartment management routes for admin
router.get('/apartment/new-apartment', isAdmin, adminControllers.getNewApartmentForm);
router.post('/apartment/new-apartment', isAdmin, adminControllers.createNewApartment);
router.get('/apartment/:id/edit', isAdmin, adminControllers.getEditApartmentForm);
router.post('/apartment/:id', isAdmin, adminControllers.updateApartment);
router.delete('/apartment/:id', isAdmin, adminControllers.deleteApartment);
router.post('/apartment/deactivate/:id', isAdmin, adminControllers.deactivateApartment);

module.exports = router;
