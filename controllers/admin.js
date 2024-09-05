const Apartment = require('../models/apartment.model.js');

// Get new apartment form
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
};

// Create new apartment
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
			photos: req.body.photos ? req.body.photos.split(',') : [],
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
};

// Get edit apartment form
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

// Update apartment
const updateApartment = async (req, res) => {
	try {
		const apartmentData = {
			title: req.body.title,
			description: req.body.description,
			rules: req.body.rules,
			rooms: req.body.rooms,
			beds: req.body.beds,
			bathrooms: req.body.bathrooms,
			photos: req.body.photos ? req.body.photos.split(',') : [],
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
		res.redirect('/');
	} catch (error) {
		res.status(500).json({ message: 'Failed to update apartment', error: error.message });
	}
};

// Delete apartment
const deleteApartment = async (req, res) => {
	try {
		const apartmentId = req.params.id;

		// Log the ID to ensure it's correct
		console.log(`Attempting to delete apartment with ID: ${apartmentId}`);

		// Check if the apartment exists before trying to delete
		const apartment = await Apartment.findById(apartmentId);
		if (!apartment) {
			console.log('Apartment not found');
			return res.status(404).send('Apartment not found');
		}

		// Perform the delete operation
		await Apartment.findByIdAndDelete(apartmentId);
		console.log(`Apartment with ID: ${apartmentId} has been successfully deleted`);

		// After deletion, redirect to the homepage
		return res.redirect('/');
	} catch (error) {
		console.error('Error deleting apartment:', error);
		return res.status(500).send('Error deleting apartment');
	}
};









// Deactivate apartment
const deactivateApartment = async (req, res) => {
	try {
		await Apartment.findByIdAndUpdate(req.params.id, { isActive: false });
		res.status(200).json({ message: 'Apartment deactivated successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to deactivate apartment', error: error.message });
	}
};

module.exports = {
	getNewApartmentForm,
	createNewApartment,
	getEditApartmentForm,
	updateApartment,
	deleteApartment,
	deactivateApartment
};
