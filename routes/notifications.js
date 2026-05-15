const express = require('express');
const router = express.Router();

const {
  sendEmailNotification,
  sendSMSNotification,
  bookingEmailTemplate,
  flightStatusEmailTemplate
} = require('../backend/notificationService');


// =============================
// BOOKING CONFIRMATION ROUTE
// =============================
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
      fare
    } = req.body;

    // Send Email
    const emailResult = await sendEmailNotification(
      email,
      `✈️ Booking Confirmed — ${bookingRef}`,
      bookingEmailTemplate(
        passengerName,
        bookingRef,
        flightNo,
        origin,
        destination,
        fare
      )
    );

    // Send SMS
    const smsMessage =
      `✈️ AirLine MS: Booking Confirmed!\n` +
      `Ref: ${bookingRef}\n` +
      `Flight: ${flightNo}\n` +
      `Route: ${origin} → ${destination}\n` +
      `Fare: Rs ${fare}`;

    const smsResult = await sendSMSNotification(phone, smsMessage);

    res.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: 'Booking notifications sent successfully!'
    });

  } catch (err) {
    console.error('❌ Booking Notification Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// =============================
// FLIGHT STATUS UPDATE ROUTE
// =============================
router.post('/flight-status', async (req, res) => {
  try {
    const {
      email,
      phone,
      passengerName,
      flightNo,
      status,
      origin,
      destination
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

    // Send SMS
    const smsMessage =
      `✈️ AirLine MS: Flight ${flightNo} is now ${status}.\n` +
      `Route: ${origin} → ${destination}`;

    const smsResult = await sendSMSNotification(phone, smsMessage);

    res.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: 'Flight status notifications sent successfully!'
    });

  } catch (err) {
    console.error('❌ Flight Status Notification Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;