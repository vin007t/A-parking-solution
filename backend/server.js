const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/Auth');
const contactRoutes = require('./routes/contact');
const bookingRoutes = require('./routes/Booking');

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/booking', bookingRoutes);

// Set up the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI)
mongoose
  .connect("mongodb://localhost:27017/ainwik")
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
