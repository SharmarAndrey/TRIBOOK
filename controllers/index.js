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

module.exports = {
	getApartments,
	getApartmentDetails
}
