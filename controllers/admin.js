const Apartment = require('../models/apartment.model.js');

// Функция для отображения формы добавления новой квартиры
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
}

// Функция для добавления новой квартиры
const createNewApartment = async (req, res) => {
	try {
		const services = {
			wifi: req.body.wifi === 'on',
			airConditioner: req.body.airConditioner === 'on',
			kitchen: req.body.kitchen === 'on',
			disability: req.body.disability === 'on',
			heater: req.body.heater === 'on',
			tv: req.body.tv === 'on'
		};

		const newApartment = new Apartment({
			title: req.body.title,
			description: req.body.description,
			rules: req.body.rules,
			rooms: req.body.rooms,
			beds: req.body.beds,
			bathrooms: req.body.bathrooms,
			photos: req.body.photos.split(','),
			mainPhoto: req.body.mainPhoto,
			price: req.body.price,
			maxPersons: req.body.maxPersons,
			size: req.body.size,
			services: services,
			province: req.body.province,
			city: req.body.city,
			gps: req.body.gps
		});

		await newApartment.save();

		res.status(201).json({ message: 'Apartment created successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to create apartment', error: error.message });
	}
}

module.exports = {
	getNewApartmentForm,
	createNewApartment
}
