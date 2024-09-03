const Apartment = require('../models/apartment.model.js');

// Функция для отображения формы добавления новой квартиры
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
}

// Функция для создания новой квартиры
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

		const availableDates = req.body.availableDates ? JSON.parse(req.body.availableDates) : [];

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
			gps: req.body.gps,
			availableDates: availableDates
		});

		await newApartment.save();

		res.status(201).json({ message: 'Apartment created successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to create apartment', error: error.message });
	}
}

// Функция для отображения формы редактирования квартиры
const getEditApartmentForm = async (req, res) => {
	try {
		const apartment = await Apartment.findById(req.params.id);
		if (!apartment) {
			return res.status(404).send('Apartment not found');
		}
		res.render('edit-apartment', { apartment });
	} catch (error) {
		res.status(500).send('Error fetching apartment details');
	}
};

// Функция для обновления квартиры
const updateApartment = async (req, res) => {
	try {
		const apartmentData = {
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
			services: {
				wifi: req.body.wifi === 'on',
				airConditioner: req.body.airConditioner === 'on',
				kitchen: req.body.kitchen === 'on',
				disability: req.body.disability === 'on',
				heater: req.body.heater === 'on',
				tv: req.body.tv === 'on'
			},
			province: req.body.province,
			city: req.body.city,
			gps: req.body.gps,
			availableDates: req.body.availableDates ? JSON.parse(req.body.availableDates) : []
		};

		await Apartment.findByIdAndUpdate(req.params.id, apartmentData);
		res.status(200).json({ message: 'Apartment updated successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to update apartment', error: error.message });
	}
}

// Функция для удаления квартиры
const deleteApartment = async (req, res) => {
	try {
		await Apartment.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Apartment deleted successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete apartment', error: error.message });
	}
}

// Функция для деактивации квартиры
const deactivateApartment = async (req, res) => {
	try {
		await Apartment.findByIdAndUpdate(req.params.id, { isActive: false });
		res.status(200).json({ message: 'Apartment deactivated successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to deactivate apartment', error: error.message });
	}
}

module.exports = {
	getNewApartmentForm,
	createNewApartment,
	getEditApartmentForm,
	updateApartment,
	deleteApartment,
	deactivateApartment
};
