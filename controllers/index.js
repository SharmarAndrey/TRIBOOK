const Apartment = require('../models/apartment.model');
const Reservation = require('../models/reservation.model');

const getApartments = async (req, res) => {
	try {
		let query = {};
		// Si el usuario no es administrador, filtra por apartamentos activos
		if (!req.session.isAdmin) {
			query.isActive = true;
		}

		const apartments = await Apartment.find(query);
		const provinces = await Apartment.distinct('province');

		res.render('home', { apartments, provinces });
	} catch (error) {
		res.status(500).send('Error fetching apartments');
	}
};

// indexControllers.js
const searchApartments = async (req, res) => {
	try {
		const { maxPrice, city, province, maxPersons, availableDate, sortOrder } = req.query;
		let query = {};

		// Si el usuario no es administrador, filtra por apartamentos activos
		if (!req.session.isAdmin) {
			query.isActive = true;
		}

		// Aplica los filtros de búsqueda proporcionados
		if (maxPrice) query.price = { $lte: maxPrice };
		if (city) query.city = city;
		if (province) query.province = province;
		if (maxPersons) query.maxPersons = { $gte: maxPersons };

		// Filtrar por fecha disponible
		if (availableDate) {
			const date = new Date(availableDate);
			query.availableDates = {
				$elemMatch: {
					startDate: { $lte: date },
					endDate: { $gte: date }
				}
			};
		}

		// Ordenamiento
		let sortOption = {};
		if (sortOrder) {
			switch (sortOrder) {
				case 'price_asc':
					sortOption.price = 1;
					break;
				case 'price_desc':
					sortOption.price = -1;
					break;
				case 'capacity_asc':
					sortOption.maxPersons = 1;
					break;
				case 'capacity_desc':
					sortOption.maxPersons = -1;
					break;
			}
		}

		const apartments = await Apartment.find(query).sort(sortOption);
		const provinces = await Apartment.distinct('province');

		res.render('home', { apartments, provinces });
	} catch (error) {
		console.error('Error searching for apartments:', error);
		res.status(500).send('Error searching for apartments');
	}
};



const getApartmentDetails = async (req, res) => {
	try {
		const apartment = await Apartment.findById(req.params.apartmentId);
		if (!apartment /* || !apartment.isActive */) {
			return res.status(404).send('Apartment not found');
		}
		// Si el apartamento no está activo y el usuario no es administrador, mostrar error o redirigir
		if (!apartment.isActive && !req.session.isAdmin) {
			return res.status(403).send('Este apartamento no está disponible actualmente.');
		}
		res.render('apartment-detail', { apartment });
	} catch (error) {
		res.status(500).send('Error fetching apartment details');
	}
};

const createNewReservation = async (req, res) => {
	try {
		const { apartmentId, startDate, endDate, email } = req.body;

		const start = new Date(startDate);
		const end = new Date(endDate);
		if (start >= end) {
			req.session.messages.push({
				type: 'danger',
				text: 'Start date must be earlier than end date.'
			});
			return res.redirect('back');
		}

		const apartment = await Apartment.findById(apartmentId);
		if (!apartment) {
			req.session.messages.push({
				type: 'danger',
				text: 'Apartment not found.'
			});
			return res.redirect('back');
		}

		const isAvailable = apartment.availableDates.some(availableRange => {
			return start >= availableRange.startDate && end <= availableRange.endDate;
		});
		if (!isAvailable) {
			// Pass a message to the session for the alert
			req.session.messages.push({
				type: 'danger',
				text: 'Apartment is not available for the selected dates.'
			});
			return res.redirect('back');
		}

		// Create new reservation if dates are available
		await Reservation.create({
			email,
			startDate: start,
			endDate: end,
			apartment: apartment._id
		});

		req.session.messages.push({
			type: 'success',
			text: 'Reservation created successfully!'
		});

		res.redirect('/');
	} catch (error) {
		req.session.messages.push({
			type: 'danger',
			text: 'Error creating reservation:  ' + error.message
		});

		res.redirect('back'); // Vuelve a la página anterior
	}
};

const getCities = async (req, res) => {
	const { province } = req.query;

	try {
		const cities = await Apartment.distinct('city', { province });
		res.json({ cities });
	} catch (error) {
		console.error('Error fetching cities:', error);
		res.status(500).json({ error: 'Failed to fetch cities' });
	}
};
module.exports = {
	getApartments,
	searchApartments,
	getApartmentDetails,
	createNewReservation,
	getCities
};
