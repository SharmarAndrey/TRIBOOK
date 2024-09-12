const mongoose = require('mongoose');
const { Schema } = mongoose;

const apartmentSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	rules: { type: String, required: true },
	rooms: { type: Number, required: true, min: 1 },
	beds: { type: Number, required: true, min: 1 },
	bathrooms: { type: Number, required: true, min: 1 },
	photos: { type: [String], required: true },
	mainPhoto: { type: String, required: true, match: [/^https?:\/\/.+/, "URL not valid"] },
	price: { type: Number, required: true, min: 1 },
	maxPersons: { type: Number, required: true, min: 1 },
	size: { type: Number, required: true, min: 0 },
	services: {
		wifi: Boolean,
		airConditioner: Boolean,
		kitchen: Boolean,
		disability: Boolean,
		heater: Boolean,
		tv: Boolean
	},
	province: { type: String, required: true },
	city: { type: String, required: true },
	gps: { type: String },
	availableDates: [{
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true }
	}],
	isActive: { type: Boolean, default: true }
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
