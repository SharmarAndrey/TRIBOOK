const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
	email: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	apartment: { type: Schema.Types.ObjectId, ref: 'Apartment', required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
