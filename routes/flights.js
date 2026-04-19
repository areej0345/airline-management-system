const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const Passenger = require('../models/Passenger');
const { sendEmail, sendSMS, flightDelayEmail, flightDelaySMS } = require('../backend/notificationService');

// Get All Flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New Flight
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const saved = await flight.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Single Flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Flight
router.put('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Flight Status + Notify Passengers if Delayed
router.put('/:id/status', async (req, res) => {
  try {
    const { status, newDepartureTime, reason } = req.body;

    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { status, ...(newDepartureTime && { departureTime: newDepartureTime }) },
      { new: true }
    );

    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    if (status === 'Delayed') {
      const bookings = await Booking.find({ flight: req.params.id }).populate('passenger');
      let notified = 0;

      for (const booking of bookings) {
        const p = booking.passenger;
        if (!p) continue;

        if (p.email) {
          await sendEmail(
            p.email,
            `⚠️ Flight ${flight.flightNumber} Delayed`,
            flightDelayEmail(p.name, flight.flightNumber, flight.origin, flight.destination, flight.departureTime, newDepartureTime || flight.departureTime, reason || 'Operational reasons')
          );
        }

        if (p.phone) {
          await sendSMS(p.phone, flightDelaySMS(flight.flightNumber, flight.origin, flight.destination, newDepartureTime || flight.departureTime));
        }
        notified++;
      }

      return res.json({ message: `Flight marked Delayed. ${notified} passengers notified via Email & SMS.`, flight, notified });
    }

    res.json({ message: 'Flight status updated successfully.', flight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Flight
router.delete('/:id', async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;