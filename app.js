const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const indexRoutes = require('./routes/index.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 4000;

app.use(morgan('tiny'));

app.use('/admin', adminRoutes);
app.use('/', indexRoutes);

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URI/* , {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} */);
		console.log('Connected to the database');
	} catch (err) {
		console.log('Database connection error:', err);
	}
}

connectDB();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
