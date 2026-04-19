const express = require('express');
const router = express.Router();
const Passenger = require('../models/Passenger');

// Get All Passengers
router.get('/', async (req, res) => {
  try {
    const passengers = await Passenger.find();
    res.json(passengers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New Passenger
router.post('/', async (req, res) => {
  try {
    const passenger = new Passenger(req.body);
    const savedPassenger = await passenger.save();
    res.status(201).json(savedPassenger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Single Passenger
router.get('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ message: 'Passenger not found' });
    res.json(passenger);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Passenger
router.put('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(passenger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Passenger
router.delete('/:id', async (req, res) => {
  try {
    await Passenger.findByIdAndDelete(req.params.id);
    res.json({ message: 'Passenger deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;