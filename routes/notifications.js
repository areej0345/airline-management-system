const express = require('express');
const router = express.Router();

// ✅ CORRECT IMPORTS
const {
  sendEmail,
  sendSMS,
  bookingConfirmEmail,
  flightDelayEmail,
  bookingConfirmSMS,
  flightDelaySMS
} = require('../backend/notificationService');


// ==============================
// BOOKING CONFIRMATION ROUTE
// ==============================
router.post('/booking-confirm', async (req, res) => {
  try {
    const {
      email,
      phone,
      passengerName,
      bookingRef,
      flightNo,
      origin,
      destination,
      fare,
      seatNumber,
      seatClass,
      departureTime
    } = req.body;

    // ✅ EMAIL
    const emailResult = await sendEmail(
      email,
      `✈️ Booking Confirmed — ${bookingRef}`,
      bookingConfirmEmail(
        passengerName,
        bookingRef,
        flightNo,
        origin,
        destination,
        fare,
        seatNumber,
        seatClass,
        departureTime
      )
    );

    // ✅ SMS
    const smsResult = await sendSMS(
      phone,
      bookingConfirmSMS(
        passengerName,
        bookingRef,
        flightNo,
        origin,
        destination
      )
    );

    res.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: 'Booking confirmation sent successfully!'
    });

  } catch (err) {
    console.error('Booking Confirm Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ==============================
// FLIGHT STATUS / DELAY ROUTE
// ==============================
router.post('/flight-status', async (req, res) => {
  try {
    const {
      email,
      phone,
      passengerName,
      flightNo,
      origin,
      destination,
      originalTime,
      newTime,
      reason,
      status
    } = req.body;

    // ✅ EMAIL
    const emailResult = await sendEmail(
      email,
      `⚠️ Flight ${flightNo} — ${status}`,
      flightDelayEmail(
        passengerName,
        flightNo,
        origin,
        destination,
        originalTime,
        newTime,
        reason || status
      )
    );

    // ✅ SMS
    const smsResult = await sendSMS(
      phone,
      flightDelaySMS(
        flightNo,
        origin,
        destination,
        newTime
      )
    );

    res.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: 'Flight notification sent successfully!'
    });

  } catch (err) {
    console.error('Flight Status Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;