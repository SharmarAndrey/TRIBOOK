const { Schema, model } = require('mongoose');

const apartmentSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	size: {
		type: Number,
		required: true,
		min: 0,
	},
	mainPhoto: {
		type: String,
		required: true,
		match: [/^(https?|ftp):\/\/[-\w+&@#/%=~_|!:,.;]+[-\w+&@#/%=~_|]$/, "URL not valid"],
	},
	services: {
		wifi: Boolean,
		airConditioner: Boolean,
		kitchen: Boolean,
		disability: Boolean,
		heater: Boolean,
		tv: Boolean
	}
});

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;
