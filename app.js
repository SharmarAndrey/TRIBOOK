const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override'); // To handle DELETE and PUT methods via forms

dotenv.config();

const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Session setup
app.use(session({
	secret: process.env.SESSION_SECRET || 'yourSecretKey',
	resave: false,
	saveUninitialized: true
}));

// Method override for form-based DELETE and PUT requests
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 4000;

// Use morgan for logging HTTP requests
app.use(morgan('tiny'));

// Middleware to pass session variables to views
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId ? true : false; // User authentication check
	res.locals.isAdmin = req.session.isAdmin || false; // Admin rights check
	res.locals.userId = req.session.userId || null; // Pass userId to views
	res.locals.username = req.session.username || '';
	next();
});

// Routes
app.use('/admin', adminRoutes);
app.use('/', indexRoutes);

// Connect to the database
async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to the database');
	} catch (err) {
		console.error('Database connection error:', err);
	}
}

connectDB();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
