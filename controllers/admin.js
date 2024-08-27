const Apartment = require('../models/apartment.model.js');

// Function  para render de form de nuevo apartamento 
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
}

//function para anadir New Apartment
const createNewApartment = async (req, res) => {
	try {
		// Convert checkbox values to boolean
		const services = {
			wifi: req.body.wifi === 'on',
			airConditioner: req.body.airConditioner === 'on',
			kitchen: req.body.kitchen === 'on',
			disability: req.body.disability === 'on',
			heater: req.body.heater === 'on',
			tv: req.body.tv === 'on'
		};

		// Create a new Apartment object with the converted values
		const newApartment = new Apartment({
			title: req.body.title,
			price: req.body.price,
			size: req.body.size,
			mainPhoto: req.body.mainPhoto,
			services: services
		});

		// Save the new apartment to the database
		await newApartment.save();

		// Respond to the client with a success message
		res.status(201).json({ message: 'Apartment created successfully!' });
	} catch (error) {
		// Handle errors and respond to the client
		res.status(500).json({ message: 'Failed to create apartment', error: error.message });
	}
}

module.exports = {
	getNewApartmentForm,
	createNewApartment
}
