const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Отображение формы входа
const getLogin = (req, res) => {
	res.render('login');
};

// Обработка входа
const postLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).send('Неправильное имя пользователя или пароль.');
		}

		// Диагностика проверки пароля при входе
		console.log(`Checking password: ${password} against hash: ${user.password}`);
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).send('Неправильное имя пользователя или пароль.');
		}

		req.session.isAdmin = user.isAdmin;
		res.redirect('/');
	} catch (error) {
		console.error('Ошибка входа:', error);
		res.status(500).send('Ошибка входа.');
	}
};

// Выход
const logout = (req, res) => {
	req.session.destroy();
	res.redirect('/');
};

module.exports = {
	getLogin,
	postLogin,
	logout
};
