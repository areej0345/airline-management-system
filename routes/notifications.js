const express = require('express');
const router = express.Router();
const {
  sendEmail,
  sendSMS,
  bookingConfirmEmail,
  bookingCancelEmail,
  flightDelayEmail,
  bookingConfirmSMS,
  bookingCancelSMS,
  flightDelaySMS
} = require('../backend/notificationService');

router.post('/booking-confirm', async (req, res) => {
  try {
    const { email, phone, passengerName, bookingRef, flightNo, origin, destination, fare, seatNumber, seatClass, departureTime } = req.body;

    if (email) {
      await sendEmail(email, `✈️ Booking Confirmed — ${bookingRef}`,
        bookingConfirmEmail(passengerName, bookingRef, flightNo, origin, destination, fare, seatNumber, seatClass, departureTime));
    }

    if (phone) {
      await sendSMS(phone, bookingConfirmSMS(passengerName, bookingRef, flightNo, origin, destination));
    }

    res.json({ success: true, message: 'Notifications sent!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/flight-status', async (req, res) => {
  try {
    const { email, phone, passengerName, flightNo, status, origin, destination, newTime, reason } = req.body;

    if (email) {
      await sendEmail(email, `⚠️ Flight ${flightNo} — ${status}`,
        flightDelayEmail(passengerName, flightNo, origin, destination, new Date(), newTime, reason));
    }

    if (phone) {
      await sendSMS(phone, flightDelaySMS(flightNo, origin, destination, newTime));
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;