const Apartment = require('../models/apartment.model');

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find();
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error fetching apartments:', error);
		res.status(500).send('Error fetching apartments');
	}
};

const getApartmentDetails = async (req, res) => {
	try {
		const apartment = await Apartment.findById(req.params.apartmentId);
		if (!apartment) {
			return res.status(404).send('Apartment not found');
		}
		res.render('apartment-detail', { apartment });
	} catch (error) {
		console.error('Error fetching apartment details:', error);
		res.status(500).send('Error fetching apartment details');
	}
};

const searchApartments = async (req, res) => {
	try {
		// Initialize the query object
		const query = {};

		// Parse and validate query parameters
		const maxPersons = parseInt(req.query.maxPersons, 10);
		const maxPrice = parseFloat(req.query.maxPrice);
		const city = req.query.city;
		const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
		const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

		// Add each parameter to the query only if it is provided and valid

		// Add maxPersons to the query if it's a valid number
		if (!isNaN(maxPersons)) {
			query.maxPersons = { $gte: maxPersons };
		}

		// Add maxPrice to the query if it's a valid number
		if (!isNaN(maxPrice)) {
			query.price = { $lte: maxPrice };
		}

		// Add city to the query if it's provided
		if (city) {
			query.city = city;
		}

		// Add availableDates to the query if both startDate and endDate are valid
		if (startDate && endDate) {
			query.availableDates = { $elemMatch: { startDate: { $lte: startDate }, endDate: { $gte: endDate } } };
		}

		// Fetch apartments matching the query
		const apartments = await Apartment.find(query);

		// Render the filtered apartments
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error searching for apartments:', error);
		res.status(500).send('Error searching for apartments');
	}
};

module.exports = {
	getApartments,
	getApartmentDetails,
	searchApartments
};
