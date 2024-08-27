// Importar el modelo Apartment
const Apartment = require('../models/apartment.model'); // Asegúrate de que la ruta sea correcta

// Definir el controlador getApartments
const getApartments = async (req, res) => {
	try {
		// Obtener todos los apartamentos de la base de datos
		const apartments = await Apartment.find();

		// Renderizar la vista 'home' y pasarle los apartamentos
		res.render('home', { apartments });
	} catch (error) {
		// Manejo de errores
		console.error('Error al obtener los apartamentos:', error);
		res.status(500).send('Error al obtener los apartamentos');
	}
};

// Exportar el controlador
module.exports = {
	getApartments
}
