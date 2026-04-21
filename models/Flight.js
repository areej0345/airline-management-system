const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Delayed', 'Cancelled', 'Completed'],
    default: 'Scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);