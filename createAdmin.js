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

		// Удаление существующего пользователя
		await User.deleteOne({ username });

		const password = 'admin';
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		console.log('Generated hash:', hashedPassword); // Лог хэша

		const newUser = new User({
			username,
			password: hashedPassword,  // Использование уже хэшированного пароля
			isAdmin: true,
			isPasswordHashed: true  // Устанавливаем флаг, что пароль уже хэширован
		});

		await newUser.save();
		console.log('Admin user created successfully');

		// Повторная проверка, что пользователь был сохранен
		const savedUser = await User.findOne({ username });
		console.log('Saved user hash:', savedUser.password);

		// Проверка пароля сразу после создания пользователя
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
