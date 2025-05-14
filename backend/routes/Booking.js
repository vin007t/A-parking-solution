const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getBookings);

// Cancel booking
router.put('/cancel/:id', bookingController.cancelBooking);

// Extend booking
router.put('/extend/:id', bookingController.extendBooking);

module.exports = router;
