const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
	isPasswordHashed: { type: Boolean, default: false }
});

// Хэширование пароля перед сохранением только в том случае, если он не был хэширован ранее
userSchema.pre('save', async function (next) {
	if (this.isPasswordHashed) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		this.isPasswordHashed = true;  // Устанавливаем флаг, что пароль был хэширован
		next();
	} catch (error) {
		next(error);
	}
});

const User = model('User', userSchema);

module.exports = User;
