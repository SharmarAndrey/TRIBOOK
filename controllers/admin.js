const Reservation = require('../models/reservation.model');
const Apartment = require('../models/apartment.model');

const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
};

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
			services,
			province: req.body.province,
			city: req.body.city,
			gps: req.body.gps,
			availableDates
		});

		await newApartment.save();
		res.redirect('/');
	} catch (error) {
		res.status(500).json({ message: 'Failed to create apartment', error: error.message });
	}
};

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
			availableDates: req.body.availableDates ? JSON.parse(req.body.availableDates) : [],
			isActive: req.body.isActive === 'true',
		};

		await Apartment.findByIdAndUpdate(req.params.id, apartmentData);

		req.session.messages.push({
			type: 'success',
			text: 'El apartamento ha sido actualizado correctamente.'
		});


		res.redirect('/');
	} catch (error) {
		// Establecer mensaje de error
		req.session.messages.push({
			type: 'danger',
			text: 'Error al actualizar el apartamento: ' + error.message
		});
		res.redirect('/');
	}
};

// Delete Apartment  by POST route
const deleteApartment = async (req, res) => {
	try {
		console.log("Attempting to delete apartment with ID:", req.params.id);
		const result = await Apartment.findByIdAndDelete(req.params.id);
		if (!result) {
			console.log("Apartment not found for deletion.");
			return res.status(404).send("Apartment not found");
		}
		console.log("Apartment successfully deleted", result);
		res.redirect('/');
	} catch (error) {
		console.error('Error deleting apartment:', error);
		res.status(500).send('Error deleting apartment');
	}
};

// Controller to get all reservations
const getReservations = async (req, res) => {
	try {
		const reservations = await Reservation.find().populate('apartment');
		res.render('admin-reservations', { reservations });
	} catch (error) {
		console.error('Error fetching reservations:', error);
		res.status(500).send('Error fetching reservations');
	}
};


// Controller to cancel a reservation
const cancelReservation = async (req, res) => {
	try {
		const reservationId = req.params.reservationId;
		await Reservation.findByIdAndDelete(reservationId);

		req.session.messages.push({
			type: 'success',
			text: 'Reservation canceled successfully.'
		});

		res.redirect('/admin/reservations');
	} catch (error) {
		req.session.messages.push({
			type: 'danger',
			text: 'Error canceling reservation: ' + error.message
		});
		res.redirect('/admin/reservations');
	}
};

const getReservationDetails = async (req, res) => {
	try {
		const reservation = await Reservation.findById(req.params.id).populate('apartment');
		if (!reservation) {
			return res.status(404).send('Reservation not found');
		}
		res.render('reservation-details', { reservation });
	} catch (error) {
		console.error('Error fetching reservation details:', error);
		res.status(500).send('Error fetching reservation details');
	}
};


module.exports = {
	getReservationDetails,
	getReservations,
	cancelReservation,
	getNewApartmentForm,
	createNewApartment,
	getEditApartmentForm,
	updateApartment,
	deleteApartment
};
