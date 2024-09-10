const Apartment = require('../models/apartment.model');  // Ensure the model is correctly imported

// Get all active apartments for the homepage
const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find({ isActive: true });    // Fetch all active apartments
		const provinces = await Apartment.distinct('province');         // Get distinct provinces
		res.render('home', { apartments, provinces });                  // Pass the apartments and provinces to the EJS template
	} catch (error) {
		console.error('Error fetching apartments or provinces:', error);
		res.status(500).send('Error fetching data');
	}
};

// Search apartments based on form data
const searchApartments = async (req, res) => {
	try {
		const { maxPrice, city, province, maxPersons, availableDate, sortOrder } = req.query;
		const query = { isActive: true };

		if (maxPrice) {
			query.price = { $lte: maxPrice };  // Filter by max price
		}

		if (city) {
			query.city = city;  // Filter by city
		}

		if (province) {
			query.province = province;  // Filter by province
		}

		if (maxPersons) {
			query.maxPersons = { $gte: maxPersons };  // Filter by max persons
		}

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
					sortOption.price = 1;  // Sort by price ascending
					break;
				case 'price_desc':
					sortOption.price = -1; // Sort by price descending
					break;
				case 'capacity_asc':
					sortOption.maxPersons = 1;  // Sort by capacity ascending
					break;
				case 'capacity_desc':
					sortOption.maxPersons = -1; // Sort by capacity descending
					break;
				default:
					break;
			}
		}

		// Fetch apartments based on query and sort options
		const apartments = await Apartment.find(query).sort(sortOption);

		// Fetch provinces to be displayed in the dropdown
		const provinces = await Apartment.distinct('province');

		// Render the search results and pass both apartments and provinces to the template
		res.render('home', { apartments, provinces });
	} catch (error) {
		console.error('Error searching for apartments:', error);
		res.status(500).send('Error searching for apartments');
	}
};


// Get distinct cities based on selected province
const getCities = async (req, res) => {
	const { province } = req.query;

	try {
		const cities = await Apartment.distinct('city', { province });  // Fetch distinct cities from the selected province
		res.json({ cities });
	} catch (error) {
		console.error('Error fetching cities:', error);
		res.status(500).json({ error: 'Failed to fetch cities' });
	}
};

// Get details for a specific apartment by ID
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

// Create a new reservation
const createNewReservation = async (req, res) => {
	try {
		const { apartmentId, startDate, endDate, email } = req.body;

		// Ensure start date is before end date
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

		// Check if apartment is available for the selected dates
		const isAvailable = apartment.availableDates.some(availableRange => {
			return start >= availableRange.startDate && end <= availableRange.endDate;
		});
		if (!isAvailable) {
			return res.status(400).json({ message: 'Apartment is not available for the selected dates.' });
		}

		// Create the new reservation (assuming a Reservation model exists)
		const newReservation = await Reservation.create({
			email,
			startDate: start,
			endDate: end,
			apartment: apartment._id
		});

		// Respond with confirmation
		res.json({ message: 'Reservation created successfully!', reservation: newReservation });
	} catch (error) {
		console.error('Error creating reservation:', error);
		res.status(500).json({ message: 'Error creating reservation.', error: error.message });
	}
};

module.exports = {
	getApartments,
	searchApartments,
	getCities,
	getApartmentDetails,
	createNewReservation
};
