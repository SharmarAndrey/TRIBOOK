const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const bcrypt = require('bcrypt');

dotenv.config();

async function createAdminUser() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to the database');

		const username = 'admin';

		// Remove existing user
		await User.deleteOne({ username });

		const password = 'admin';
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		console.log('Generated hash:', hashedPassword);

		const newUser = new User({
			username,
			password: hashedPassword,  // Already hashed password
			isAdmin: true,
			isPasswordHashed: true
		});

		await newUser.save();
		console.log('Admin user created successfully');

		// Verify the saved user
		const savedUser = await User.findOne({ username });
		console.log('Saved user hash:', savedUser.password);

		// Verify password after creation
		const isMatch = await bcrypt.compare(password, savedUser.password);
		if (isMatch) {
			console.log('Password check passed after creation.');
		} else {
			console.log('Password check failed after creation.');
		}

	} catch (error) {
		console.error('Error creating admin user:', error);
	} finally {
		mongoose.connection.close();
	}
}

createAdminUser();
