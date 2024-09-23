const { validationResult } = require('express-validator'); // Ensure validationResult is imported
const Apartment = require('../models/apartment.model');

// Controller to get apartments
const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find();
		res.status(200).json(apartments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Controller to search apartments
const searchApartments = async (req, res) => {
	try {
		// Use validationResult here to check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array()[0].msg });
		}

		const { q } = req.query;

		if (!q || q.length < 3 || q.length > 100) {
			return res.status(400).json({
				message: "Search query 'q' must be between 3 and 100 characters."
			});
		}

		const query = {
			$or: [
				{ title: { $regex: q, $options: 'i' } },
				{ description: { $regex: q, $options: 'i' } }
			]
		};

		const apartments = await Apartment.find(query);

		res.status(200).json({
			message: "Search executed successfully",
			results: apartments
		});
	} catch (error) {
		console.error("Error searching apartments:", error);
		res.status(500).json({
			message: "Internal server error",
			error: error.message
		});
	}
};

module.exports = {
	getApartments,
	searchApartments
};
