const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override'); // To handle DELETE and PUT methods via forms

dotenv.config();

const indexRoutes = require('./routes/index.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
	secret: 'yourSecretKey',
	resave: false,
	saveUninitialized: true
}));

app.use(methodOverride('_method')); // Method override for DELETE and PUT

const PORT = process.env.PORT || 4000;

app.use(morgan('tiny'));

// Middleware to pass session variables to views
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId ? true : false; // User authentication check
	res.locals.isAdmin = req.session.isAdmin || false; // Admin rights check
	res.locals.userId = req.session.userId || null; // Pass userId to views
	res.locals.username = req.session.username || '';
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
