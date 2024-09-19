const Apartment = require('../models/apartment.model');

// Controlador para obtener apartamentos
const getApartments = async (req, res) => {
	try {
		// Lógica del controlador
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

// Exportar ambos controladores
module.exports = {
	getApartments,
	searchApartments
};
