const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  location: String,
  date: String,
  startTime: String,
  endTime: String,
  vehicleType: String,
  selectedSlot: String,
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
