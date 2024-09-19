const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

const app = express();
const apiRoutes = require('./routes/api.js');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('tiny'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Session setup
app.use(session({
	secret: process.env.SESSION_SECRET || 'yourSecretKey',
	resave: false,
	saveUninitialized: true
}));

// Middleware para inicializar mensajes flash
app.use((req, res, next) => {
	if (!req.session.messages) {
		req.session.messages = [];
	}
	next();
});


// Middleware para pasar mensajes a las vistas y limpiarlos de la sesión
app.use((req, res, next) => {
	res.locals.messages = req.session.messages;
	req.session.messages = [];
	next();
});
// Middleware to pass session variables to views
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId ? true : false;
	res.locals.isAdmin = req.session.isAdmin || false;
	res.locals.username = req.session.username || '';
	next();
});

// Routes
app.use('/admin', adminRoutes);
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
