const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Display login form
const getLogin = (req, res) => {
	res.render('login');
};

// Handle login
const postLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).send('Invalid username or password.');
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).send('Invalid username or password.');
		}

		req.session.isAdmin = user.isAdmin;
		req.session.userId = user._id;
		req.session.username = user.username; // Store the username in the session
		res.redirect('/');
	} catch (error) {
		console.error('Ошибка входа:', error);
		res.status(500).send('Ошибка входа.');
	}
};

// Display registration form
const getRegister = (req, res) => {
	res.render('register');
};

// Handle registration
const postRegister = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).send('Имя пользователя уже занято.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			password: hashedPassword,
			isAdmin: false // Regular users are not admins
		});

		await newUser.save();
		req.session.userId = newUser._id;
		res.redirect('/');
	} catch (error) {
		console.error('Ошибка регистрации:', error);
		res.status(500).send('Ошибка регистрации.');
	}
};

// Handle logout
const logout = (req, res) => {
	req.session.destroy();
	res.redirect('/');
};

module.exports = {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	logout
};
