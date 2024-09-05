const Apartment = require('../models/apartment.model');
const Reservation = require('../models/reservation.model'); // Assuming the Reservation model is already created

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find({ isActive: true });
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error fetching apartments:', error);
		res.status(500).send('Error fetching apartments');
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
		console.error('Error fetching apartment details:', error);
		res.status(500).send('Error fetching apartment details');
	}
};

const searchApartments = async (req, res) => {
	try {
		// Parse the maximum price from the query string
		const { maxPrice } = req.query;

		// Find apartments where the price is less than or equal to the maxPrice
		const apartments = await Apartment.find({
			isActive: true,
			price: { $lte: maxPrice },
		});

		// Render the 'home' view and pass the filtered apartments
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error searching for apartments:', error);
		res.status(500).send('Error searching for apartments');
	}
};

const createNewReservation = async (req, res) => {
	try {
		const { apartmentId, startDate, endDate, email } = req.body;

		// Ensure startDate is before endDate
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (start >= end) {
			return res.status(400).json({ message: 'Start date must be earlier than end date.' });
		}

		// Find the apartment by its ID
		const apartment = await Apartment.findById(apartmentId);
		if (!apartment) {
			return res.status(404).json({ message: 'Apartment not found.' });
		}

		// Ensure apartment is available for the selected dates
		const isAvailable = apartment.availableDates.some(availableRange => {
			return start >= availableRange.startDate && end <= availableRange.endDate;
		});
		if (!isAvailable) {
			return res.status(400).json({ message: 'Apartment is not available for the selected dates.' });
		}

		// Create the new reservation
		const newReservation = await Reservation.create({
			email,
			startDate: start,
			endDate: end,
			apartment: apartment._id,  // Reference to the apartment
		});

		// Respond with a confirmation
		res.json({ message: 'Reservation created successfully!', reservation: newReservation });
	} catch (error) {
		console.error('Error creating reservation:', error);
		res.status(500).json({ message: 'Error creating reservation.', error: error.message });
	}
};

module.exports = {
	getApartments,
	getApartmentDetails,
	searchApartments,
	createNewReservation,
};
