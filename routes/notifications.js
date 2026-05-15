const express = require('express');
const router = express.Router();

const {
  sendEmail,
  sendSMS,
  bookingConfirmEmail,
  flightDelayEmail
} = require('../backend/notificationService');

// Send Booking Confirmation
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
      seatNo,
      seatClass,
      departureTime
    } = req.body;

    // Send Email
    const emailResult = await sendEmail(
      email,
      '✈️ Booking Confirmed — ' + bookingRef,
      bookingConfirmEmail(
        passengerName,
        bookingRef,
        flightNo,
        origin,
        destination,
        fare,
        seatNo || 'N/A',
        seatClass || 'Economy',
        departureTime || new Date()
      )
    );

    // Send SMS only if configured
    let smsResult = { success: false, message: 'SMS disabled' };

    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE
    ) {
      const smsMessage =
        `✈️ AirLine MS: Booking Confirmed!\n` +
        `Ref: ${bookingRef}\n` +
        `Flight: ${flightNo}\n` +
        `Route: ${origin} → ${destination}\n` +
        `Fare: Rs ${fare}`;

      smsResult = await sendSMS(phone, smsMessage);
    }

    res.json({
      success: emailResult.success,
      email: emailResult,
      sms: smsResult,
      message: emailResult.success
        ? 'Booking notification sent successfully!'
        : 'Booking email failed'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Send Flight Status Update
router.post('/flight-status', async (req, res) => {
  try {
    const {
      email,
      phone,
      passengerName,
      flightNo,
      status,
      origin,
      destination,
      originalTime,
      newTime,
      reason
    } = req.body;

    // Send Email
    const emailResult = await sendEmail(
      email,
      `⚠️ Flight ${flightNo} — ${status}`,
      flightDelayEmail(
        passengerName,
        flightNo,
        origin,
        destination,
        originalTime || new Date(),
        newTime || new Date(),
        reason || status
      )
    );

    // Send SMS only if configured
    let smsResult = { success: false, message: 'SMS disabled' };

    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE
    ) {
      const smsMessage =
        `✈️ AirLine MS: Flight ${flightNo} is now ${status}.\n` +
        `Route: ${origin} → ${destination}`;

      smsResult = await sendSMS(phone, smsMessage);
    }

    res.json({
      success: emailResult.success,
      email: emailResult,
      sms: smsResult,
      message: emailResult.success
        ? 'Flight status notification sent!'
        : 'Flight status email failed'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;