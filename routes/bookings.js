const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Passenger = require('../models/Passenger');
const {
  sendEmail, sendSMS,
  bookingConfirmEmail, bookingCancelEmail,
  bookingConfirmSMS, bookingCancelSMS
} = require('../backend/notificationService');

const CANCEL_HOURS = 0.5;
const PENALTY_PCT  = 20;
const REFUND_DAYS  = 7;

// Get All Bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('flight').populate('passenger');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New Booking
router.post('/', async (req, res) => {
  try {
    const flight = await Flight.findById(req.body.flight);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    if (flight.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

    const bookingReference = 'PK' + Date.now().toString().slice(-6);
    const booking = new Booking({
      bookingReference,
      flight: req.body.flight,
      passenger: req.body.passenger,
      seatNumber: req.body.seatNumber,
      seatClass: req.body.seatClass,
      fare: req.body.fare,
      paymentStatus: req.body.paymentStatus,
      bookingDate: new Date()
    });

    const saved = await booking.save();
    flight.availableSeats -= 1;
    await flight.save();

    const passenger = await Passenger.findById(req.body.passenger);
    if (passenger) {
      if (passenger.email) {
        await sendEmail(
          passenger.email,
          `✈️ Booking Confirmed — ${bookingReference}`,
          bookingConfirmEmail(passenger.name, bookingReference, flight.flightNumber, flight.origin, flight.destination, req.body.fare, req.body.seatNumber, req.body.seatClass, flight.departureTime)
        );
      }
      if (passenger.phone) {
        await sendSMS(passenger.phone, bookingConfirmSMS(passenger.name, bookingReference, flight.flightNumber, flight.origin, flight.destination));
      }
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Single Booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight').populate('passenger');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancellation Info
router.get('/:id/cancel-info', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight').populate('passenger');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const hoursDiff = (new Date() - new Date(booking.bookingDate || booking.createdAt)) / 3600000;
    const isFree    = hoursDiff <= CANCEL_HOURS;
    const penalty   = isFree ? 0 : Math.round(booking.fare * PENALTY_PCT / 100);
    const refund    = booking.fare - penalty;
    const deadline  = new Date(new Date(booking.bookingDate || booking.createdAt).getTime() + CANCEL_HOURS * 3600000);

    res.json({
      isFree,
      hoursSinceBooking: Math.round(hoursDiff),
      cancellationDeadline: deadline,
      cancellationDeadlineHours: CANCEL_HOURS,
      originalFare: booking.fare,
      penalty,
      refundAmount: refund,
      refundDays: REFUND_DAYS,
      message: isFree
        ? `Free cancellation available! Deadline: ${deadline.toLocaleString()}`
        : `Cancellation will incur 20% penalty (Rs ${penalty.toLocaleString()}). Refund: Rs ${refund.toLocaleString()} in ${REFUND_DAYS} days.`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel Booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight').populate('passenger');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const hoursDiff = (new Date() - new Date(booking.bookingDate || booking.createdAt)) / 3600000;
    const isFree    = hoursDiff <= CANCEL_HOURS;
    const penalty   = isFree ? 0 : Math.round(booking.fare * PENALTY_PCT / 100);
    const refund    = booking.fare - penalty;

    const flight = await Flight.findById(booking.flight);
    if (flight) { flight.availableSeats += 1; await flight.save(); }

    const passenger = booking.passenger;
    const flightData = booking.flight;

    if (passenger) {
      if (passenger.email) {
        await sendEmail(
          passenger.email,
          `❌ Booking Cancelled — ${booking.bookingReference}`,
          bookingCancelEmail(passenger.name, booking.bookingReference, flightData ? flightData.flightNumber : 'N/A', flightData ? flightData.origin : 'N/A', flightData ? flightData.destination : 'N/A', booking.fare, penalty, refund, isFree)
        );
      }
      if (passenger.phone) {
        await sendSMS(passenger.phone, bookingCancelSMS(booking.bookingReference, refund, isFree));
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Booking cancelled successfully',
      isFree,
      penalty,
      refundAmount: refund,
      refundDays: REFUND_DAYS
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;