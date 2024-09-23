const Apartment = require('../models/apartment.model');
const CommercialPartner = require('../models/commercialPartner.model'); // Asegúrate de tener este modelo

// Controlador para obtener apartamentos
const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find();
		res.status(200).json(apartments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error interno del servidor' });
	}
};

// Controlador para buscar apartamentos
const searchApartments = async (req, res) => {
	try {
		const { q } = req.query;

		if (!q || q.length < 3 || q.length > 100) {
			return res.status(400).json({
				message: "El valor de 'q' debe tener entre 3 y 100 caracteres."
			});
		}

		const query = {
			$or: [
				{ title: { $regex: q, $options: 'i' } },
				{ description: { $regex: q, $options: 'i' } }
			]
		};

		const apartments = await Apartment.find(query);

		res.status(200).json({
			message: "Consulta ejecutada exitosamente",
			results: apartments
		});
	} catch (error) {
		console.error("Error al buscar apartamentos:", error);
		res.status(500).json({
			message: "Error interno del servidor",
			error: error.message
		});
	}
};

// Controlador para crear un nuevo apartamento (con validación de token)
const createNewApartment = async (req, res) => {
	try {
		const { tokenId, title, price, rooms, beds, bathrooms, mainPhoto, size, availableDates } = req.body;

		// Validar que el tokenId pertenece a un socio comercial
		const partner = await CommercialPartner.findOne({ tokenId });
		if (!partner) {
			return res.status(403).json({ message: "Unauthorized operation: invalid tokenId." });
		}

		// Validaciones de campos
		if (!title || title.length < 3) {
			return res.status(400).json({ message: "Invalid title: must be at least 3 characters long." });
		}
		if (!price || price <= 0) {
			return res.status(400).json({ message: "Invalid price: must be greater than 0." });
		}
		if (!rooms || rooms <= 0 || !beds || beds <= 0 || !bathrooms || bathrooms <= 0) {
			return res.status(400).json({ message: "Rooms, beds, and bathrooms must be positive numbers." });
		}
		const urlRegex = /^https?:\/\/.+/;
		if (!mainPhoto || !urlRegex.test(mainPhoto)) {
			return res.status(400).json({ message: "Invalid mainPhoto URL." });
		}

		// Validar fechas disponibles
		const dates = availableDates ? JSON.parse(availableDates) : [];
		dates.forEach(date => {
			const start = new Date(date.startDate);
			const end = new Date(date.endDate);
			if (isNaN(start) || isNaN(end) || start >= end) {
				throw new Error("Invalid date range in availableDates.");
			}
		});

		// Crear apartamento
		const newApartment = new Apartment({
			...req.body,
			services: {
				wifi: req.body.wifi === 'on',
				airConditioner: req.body.airConditioner === 'on',
				kitchen: req.body.kitchen === 'on',
				disability: req.body.disability === 'on',
				heater: req.body.heater === 'on',
				tv: req.body.tv === 'on'
			},
			availableDates: dates
		});

		const savedApartment = await newApartment.save();

		// Respuesta de éxito
		res.status(201).json({
			message: "Apartment created successfully",
			apartmentId: savedApartment._id
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to create apartment", error: error.message });
	}
};

// Añadir la nueva ruta para crear un apartamento
module.exports = {
	getApartments,
	searchApartments,
	createNewApartment
};
