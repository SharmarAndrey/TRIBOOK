// checkPassword.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');

dotenv.config();

async function checkPassword() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to the database');

		const username = 'admin';
		const password = 'admin';

		const user = await User.findOne({ username });
		if (!user) {
			console.log('User not found');
			return;
		}

		// hash of password frome Data base
		console.log(`Stored hash: ${user.password}`);

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			console.log('Password is correct');
		} else {
			console.log('Password is incorrect');
		}
	} catch (error) {
		console.error('Error:', error);
	} finally {
		mongoose.connection.close();
	}
}

checkPassword();
