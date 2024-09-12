const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const getLogin = (req, res) => {
	res.render('login');
};

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
		req.session.username = user.username;
		res.redirect('/');
	} catch (error) {
		res.status(500).send('Error logging in.');
	}
};

const getRegister = (req, res) => {
	res.render('register');
};

const postRegister = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).send('Username already taken.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			password: hashedPassword,
			isAdmin: false
		});

		await newUser.save();
		req.session.userId = newUser._id;
		res.redirect('/');
	} catch (error) {
		res.status(500).send('Error registering.');
	}
};

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
