const Apartment = require('../models/apartment.model');
const Reservation = require('../models/reservation.model');

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find({ isActive: true });
		const provinces = await Apartment.distinct('province');
		res.render('home', { apartments, provinces });
	} catch (error) {
		res.status(500).send('Error fetching apartments');
	}
};

const searchApartments = async (req, res) => {
	try {
		const { maxPrice, city, province, maxPersons, availableDate, sortOrder } = req.query;
		const query = { isActive: true };

		// Only add these filters if values are provided
		if (maxPrice) query.price = { $lte: maxPrice };
		if (city) query.city = city;
		if (province) query.province = province;
		if (maxPersons) query.maxPersons = { $gte: maxPersons };

		// Available date filter
		if (availableDate) {
			const date = new Date(availableDate);
			query.availableDates = {
				$elemMatch: {
					startDate: { $lte: date },
					endDate: { $gte: date }
				}
			};
		}

		// Sorting logic
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
		if (!apartment || !apartment.isActive) {
			return res.status(404).send('Apartment not found');
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
			return res.status(400).json({ message: 'Start date must be earlier than end date.' });
		}

		const apartment = await Apartment.findById(apartmentId);
		if (!apartment) {
			return res.status(404).json({ message: 'Apartment not found.' });
		}

		const isAvailable = apartment.availableDates.some(availableRange => {
			return start >= availableRange.startDate && end <= availableRange.endDate;
		});
		if (!isAvailable) {
			return res.status(400).json({ message: 'Apartment is not available for the selected dates.' });
		}

		const newReservation = await Reservation.create({
			email,
			startDate: start,
			endDate: end,
			apartment: apartment._id
		});

		res.json({ message: 'Reservation created successfully!', reservation: newReservation });
	} catch (error) {
		res.status(500).json({ message: 'Error creating reservation.', error: error.message });
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
