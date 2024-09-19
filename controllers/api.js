const Apartment = require('../models/apartment.model'); // Ensure the correct path

const getApartments = async (req, res) => {
	try {
		const apartments = await Apartment.find({}).limit(100000);
		res.status(200).json({
			message: "Query executed successfully",
			results: apartments
		});
	} catch (error) {
		console.error("Error fetching apartments:", error);
		res.status(500).json({
			message: "Internal Server Error",
			error: error.message
		});
	}
}

module.exports = {
	getApartments
}
