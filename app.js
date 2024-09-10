const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const methodOverride = require('method-override'); // For handling DELETE/PUT methods via forms
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import routes
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

// Use morgan for logging HTTP requests
app.use(morgan('tiny'));

// Middleware to pass session variables to views
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId ? true : false;  // User authentication check
	res.locals.isAdmin = req.session.isAdmin || false;               // Admin rights check
	res.locals.username = req.session.username || '';                // Pass username to views
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

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
