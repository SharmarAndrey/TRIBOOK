const mongoose = require('mongoose');
const { Schema } = mongoose;

const commercialPartnerSchema = new Schema({
	name: { type: String, required: true },
	tokenId: { type: String, required: true, unique: true },
	contactEmail: { type: String }
});

const CommercialPartner = mongoose.model('CommercialPartner', commercialPartnerSchema);

module.exports = CommercialPartner;
