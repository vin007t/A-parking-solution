const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Extend a booking session
exports.extendBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEndTime } = req.body;
    const updated = await Booking.findByIdAndUpdate(id, { endTime: newEndTime }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to extend booking' });
  }
};
