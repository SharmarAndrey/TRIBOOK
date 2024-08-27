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


const getApartmentDetails = async (req, res) => {
	try {
		const apartment = await Apartment.findById(req.params.apartmentId);
		if (!apartment) {
			return res.status(404).send('Apartament no trobat');
		}
		res.render('apartment-detail', { apartment });
	} catch (error) {
		console.error('Error al obtenir els detalls de l\'apartament:', error);
		res.status(500).send('Error al obtenir els detalls de l\'apartament');
	}
};
module.exports = {
	getApartments,
	getApartmentDetails
}
