const express = require('express');
const router = express.Router();
const { query } = require('express-validator'); // Import the validation functions
const { getApartments, searchApartments } = require('../controllers/api');

// Route to get all apartments
router.get('/apartments', getApartments);

// Define search route with validation for query 'q'
router.get('/apartments/search', [
	query('q').isLength({ min: 3, max: 100 }).withMessage("Search query must be between 3 and 100 characters")
], searchApartments);

module.exports = router;
