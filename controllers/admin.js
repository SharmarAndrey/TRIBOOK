const Apartment = require('../models/apartment.model.js');

// Функция для рендеринга формы добавления нового апартамента
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
}

// Функция для создания нового апартамента
const createNewApartment = async (req, res) => {
	try {
		const newApartment = new Apartment({
			title: req.body.title,
			price: req.body.price,
			size: req.body.size,
			mainPhoto: req.body.mainPhoto,
			services: {
				wifi: req.body.wifi || false,
				airConditioner: req.body.airConditioner || false,
				kitchen: req.body.kitchen || false,
				disability: req.body.disability || false,
				heater: req.body.heater || false,
				tv: req.body.tv || false
			}
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
