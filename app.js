const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const indexRoutes = require('./routes/index.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Настройка сессий
app.use(session({
	secret: 'yourSecretKey',
	resave: false,
	saveUninitialized: true
}));

const PORT = process.env.PORT || 4000;

app.use(morgan('tiny'));

// Middleware для передачи переменной isAdmin во все представления
app.use((req, res, next) => {
	res.locals.isAdmin = req.session.isAdmin || false;
	next();
});

app.use('/admin', adminRoutes);
app.use('/', indexRoutes);

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to the database');
	} catch (err) {
		console.log('Database connection error:', err);
	}
}

connectDB();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
