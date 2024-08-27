// Importar el modelo
const Apartment = require('../models/apartment.model.js');

// Función para renderizar el formulario de nuevo apartamento
const getNewApartmentForm = (req, res) => {
	res.render('new-apartment.ejs');
}

// Función para manejar la creación de un nuevo apartamento
const createNewApartment = async (req, res) => {
	try {
		// Crear un nuevo objeto Apartment con los datos recibidos del formulario
		const newApartment = new Apartment({
			title: req.body.title,
			price: req.body.price,
			size: req.body.size,
			mainPhoto: req.body.mainPhoto,
			services: {
				wifi: req.body.wifi || false,
				airConditioner: req.body.airConditioner || false,
				kitchen: req.body.kitchen || false,
				disability: req.body.disability || false,
				heater: req.body.heater || false,
				tv: req.body.tv || false
			}
		});

		// Guardar el nuevo apartamento en la base de datos
		await newApartment.save();

		// Responder al cliente con un mensaje de éxito
		res.status(201).json({ message: 'Apartment created successfully!' });
	} catch (error) {
		// Manejar errores y responder al cliente
		res.status(500).json({ message: 'Failed to create apartment', error: error.message });
	}
}

// Exportar las funciones
module.exports = {
	getNewApartmentForm,
	createNewApartment
}
