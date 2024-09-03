const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin.js');

router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);
router.post('/apartment/new-apartment', adminControllers.createNewApartment);
/* router.get('/apartment/edit/:id', adminControllers.getEditApartmentForm); */
router.get('/apartment/:id/edit', adminControllers.getEditApartmentForm);

router.post('/apartment/:id', adminControllers.updateApartment);
router.delete('/apartment/:id', adminControllers.deleteApartment);
router.post('/apartment/deactivate/:id', adminControllers.deactivateApartment);

module.exports = router;
