const Apartment = require('../models/apartment.model');

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
		const query = { isActive: true };

		const maxPersons = parseInt(req.query.maxPersons, 10);
		const maxPrice = parseFloat(req.query.maxPrice);
		const city = req.query.city;
		const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
		const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

		if (!isNaN(maxPersons)) {
			query.maxPersons = { $gte: maxPersons };
		}

		if (!isNaN(maxPrice)) {
			query.price = { $lte: maxPrice };
		}

		if (city) {
			query.city = city;
		}

		if (startDate && endDate) {
			query.availableDates = { $elemMatch: { startDate: { $lte: startDate }, endDate: { $gte: endDate } } };
		}

		const apartments = await Apartment.find(query);
		res.render('home', { apartments });
	} catch (error) {
		console.error('Error searching for apartments:', error);
		res.status(500).send('Error searching for apartments');
	}
};

const createNewReservation = async (req, res) => {
	try {
		const { apartmentId, startDate, endDate } = req.body;
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (start >= end) {
			return res.status(400).json({ message: 'Дата начала должна быть раньше даты окончания.' });
		}

		const apartment = await Apartment.findById(apartmentId);
		if (!apartment) {
			return res.status(404).json({ message: 'Квартира не найдена.' });
		}

		// Проверка доступности запрашиваемых дат
		const isAvailable = apartment.availableDates.some(availableRange => {
			return (start >= availableRange.startDate && end <= availableRange.endDate);
		});

		if (!isAvailable) {
			return res.status(400).json({ message: 'Квартира недоступна на выбранные даты.' });
		}

		// Если доступно, создаем новую запись в availableDates и уменьшаем доступный диапазон
		apartment.availableDates = apartment.availableDates.map(availableRange => {
			if (start >= availableRange.startDate && end <= availableRange.endDate) {
				return [
					{ startDate: availableRange.startDate, endDate: start },  // диапазон до начала новой резервации
					{ startDate: end, endDate: availableRange.endDate }        // диапазон после окончания новой резервации
				].filter(range => range.startDate < range.endDate);          // удаляем пустые диапазоны
			}
			return availableRange;
		}).flat();

		await apartment.save();

		res.status(201).json({ message: 'Резервация успешно создана.' });
	} catch (error) {
		console.error('Ошибка при создании резервации:', error);
		res.status(500).json({ message: 'Ошибка при создании резервации.', error: error.message });
	}
};

module.exports = {
	getApartments,
	getApartmentDetails,
	searchApartments,
	createNewReservation
};
