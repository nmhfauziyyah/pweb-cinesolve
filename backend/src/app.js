const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const filmRoutes = require('./routes/filmRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/movies', filmRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => res.json({ message: 'CineSolve API' }));

module.exports = app;
