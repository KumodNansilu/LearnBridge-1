const mongoose = require('mongoose');

const appointmentBookingSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppointmentSession',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  }
}, { timestamps: true });

module.exports = mongoose.model('AppointmentBooking', appointmentBookingSchema);
