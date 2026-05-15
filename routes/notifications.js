const express = require('express');
const router = express.Router();
const {
  sendEmailNotification,
  sendSMSNotification,
  bookingEmailTemplate,
  flightStatusEmailTemplate
} = require('../backend/notificationService');

// Send Booking Confirmation
router.post('/booking-confirm', async (req, res) => {
  try {
    const {
      email, phone, passengerName,
      bookingRef, flightNo,
      origin, destination, fare
    } = req.body;

    // Send Email
    const emailResult = await sendEmailNotification(
      email,
      '✈️ Booking Confirmed — ' + bookingRef,
      bookingEmailTemplate(
        passengerName,
        bookingRef,
        flightNo,
        origin,
        destination,
        fare
      )
    );

    // Send SMS only if Twilio available
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

      smsResult = await sendSMSNotification(phone, smsMessage);
    }

    res.json({
      success: emailResult.success,
      email: emailResult,
      sms: smsResult,
      message: emailResult.success
        ? 'Email sent successfully!'
        : 'Email failed'
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
      email, phone, passengerName,
      flightNo, status,
      origin, destination
    } = req.body;

    // Send Email
    const emailResult = await sendEmailNotification(
      email,
      `⚠️ Flight ${flightNo} — ${status}`,
      flightStatusEmailTemplate(
        passengerName,
        flightNo,
        status,
        origin,
        destination
      )
    );

    // Send SMS only if Twilio available
    let smsResult = { success: false, message: 'SMS disabled' };

    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE
    ) {
      const smsMessage =
        `✈️ AirLine MS: Flight ${flightNo} is now ${status}.\n` +
        `Route: ${origin} → ${destination}`;

      smsResult = await sendSMSNotification(phone, smsMessage);
    }

    res.json({
      success: emailResult.success,
      email: emailResult,
      sms: smsResult,
      message: emailResult.success
        ? 'Flight status email sent!'
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