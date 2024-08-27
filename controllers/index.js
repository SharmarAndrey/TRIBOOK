const Apartment = require('../models/apartment.model');

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find();
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error al obtener los apartamentos:', error);
		res.status(500).send('Error al obtener los apartamentos');
	}
};

module.exports = {
	getApartments
}
