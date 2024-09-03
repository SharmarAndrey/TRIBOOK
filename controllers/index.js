const Apartment = require('../models/apartment.model');

Apartment.updateMany({}, { $set: { isActive: true } })
/* 	.then(result => {
		console.log('Update successful:', result);
	})
	.catch(err => {
		console.error('Update failed:', err);
	}); */

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find(/* { isActive: true } */);
		//console.log('Fetched Apartments:', apartments);
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error fetching apartments:', error);
		res.status(500).send('Error fetching apartments');
	}
};

const getApartmentDetails = async (req, res) => {
	try {
		const apartment = await Apartment.findById(req.params.apartmentId);
		if (!apartment || !apartment.isActive) {
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
		const query = { isActive: true };

		const maxPersons = parseInt(req.query.maxPersons, 10);
		const maxPrice = parseFloat(req.query.maxPrice);
		const city = req.query.city;
		const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
		const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

		if (!isNaN(maxPersons)) {
			query.maxPersons = { $gte: maxPersons };
		}

		if (!isNaN(maxPrice)) {
			query.price = { $lte: maxPrice };
		}

		if (city) {
			query.city = city;
		}

		if (startDate && endDate) {
			query.availableDates = { $elemMatch: { startDate: { $lte: startDate }, endDate: { $gte: endDate } } };
		}

		const apartments = await Apartment.find(query);
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
