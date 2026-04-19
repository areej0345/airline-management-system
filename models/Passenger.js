const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true
  },
  nationality: {
    type: String,
    default: 'Pakistani'
  },
  dateOfBirth: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Passenger', passengerSchema);