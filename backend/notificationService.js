const dns = require('dns');
const nodemailer = require('nodemailer');

// ✅ FORCE IPV4 (Render Gmail fix)
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4,
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

// ======================
// SEND EMAIL
// ======================
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `✈️ AirLine MS <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent to ${to}`);
    return { success: true };

  } catch (err) {
    console.log(`❌ Email error: ${err.message}`);
    return {
      success: false,
      message: err.message
    };
  }
}

// ======================
// SEND SMS
// ======================
async function sendSMS(to, message) {
  try {
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const phone = to.startsWith('+')
      ? to
      : '+92' + to.replace(/^0/, '');

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    console.log(`✅ SMS sent to ${phone}`);
    return { success: true };

  } catch (err) {
    console.log(`❌ SMS error: ${err.message}`);
    return {
      success: false,
      message: err.message
    };
  }
}

// ======================
// BOOKING CONFIRM EMAIL
// ======================
function bookingConfirmEmail(
  name,
  ref,
  flightNo,
  origin,
  dest,
  fare,
  seat,
  seatClass,
  depTime
) {
  return `
    <h2>✈️ Booking Confirmed</h2>
    <p>Dear ${name},</p>
    <p>Your booking has been confirmed successfully.</p>
    <ul>
      <li>Reference: ${ref}</li>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Departure: ${new Date(depTime).toLocaleString()}</li>
      <li>Seat: ${seat} (${seatClass})</li>
      <li>Fare: Rs ${fare}</li>
    </ul>
    <p>Free cancellation within 24 hours.</p>
  `;
}

// ======================
// BOOKING CANCEL EMAIL
// ======================
function bookingCancelEmail(
  name,
  ref,
  flightNo,
  origin,
  dest,
  fare,
  penalty,
  refundAmount,
  isFree
) {
  return `
    <h2>❌ Booking Cancelled</h2>
    <p>Dear ${name},</p>
    <p>Your booking ${ref} has been cancelled.</p>
    <ul>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Fare: Rs ${fare}</li>
      <li>Penalty: Rs ${penalty}</li>
      <li>Refund: Rs ${refundAmount}</li>
    </ul>
  `;
}

// ======================
// FLIGHT DELAY EMAIL
// ======================
function flightDelayEmail(
  name,
  flightNo,
  origin,
  dest,
  origTime,
  newTime,
  reason
) {
  return `
    <h2>⚠️ Flight Delay Notice</h2>
    <p>Dear ${name},</p>
    <p>Your flight has been delayed.</p>
    <ul>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Original Time: ${new Date(origTime).toLocaleString()}</li>
      <li>New Time: ${new Date(newTime).toLocaleString()}</li>
      <li>Reason: ${reason}</li>
    </ul>
  `;
}

// ======================
// SMS TEMPLATES
// ======================
function bookingConfirmSMS(name, ref, flightNo, origin, dest) {
  return `AirLine MS
Booking Confirmed!
Ref: ${ref}
Flight: ${flightNo}
Route: ${origin} to ${dest}`;
}

function bookingCancelSMS(ref, refundAmount, isFree) {
  return `AirLine MS
Booking Cancelled
Ref: ${ref}
Refund: Rs ${refundAmount}`;
}

function flightDelaySMS(flightNo, origin, dest, newTime) {
  return `AirLine MS
Flight Delayed
Flight: ${flightNo}
Route: ${origin} to ${dest}
New Time: ${new Date(newTime).toLocaleString()}`;
}

// ======================
// EXPORTS
// ======================
module.exports = {
  sendEmail,
  sendSMS,
  bookingConfirmEmail,
  bookingCancelEmail,
  flightDelayEmail,
  bookingConfirmSMS,
  bookingCancelSMS,
  flightDelaySMS
};const dns = require('dns');
const nodemailer = require('nodemailer');

// ✅ FORCE IPV4 (Render Gmail fix)
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4,
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

// ======================
// SEND EMAIL
// ======================
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `✈️ AirLine MS <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent to ${to}`);
    return { success: true };

  } catch (err) {
    console.log(`❌ Email error: ${err.message}`);
    return {
      success: false,
      message: err.message
    };
  }
}

// ======================
// SEND SMS
// ======================
async function sendSMS(to, message) {
  try {
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const phone = to.startsWith('+')
      ? to
      : '+92' + to.replace(/^0/, '');

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    console.log(`✅ SMS sent to ${phone}`);
    return { success: true };

  } catch (err) {
    console.log(`❌ SMS error: ${err.message}`);
    return {
      success: false,
      message: err.message
    };
  }
}

// ======================
// BOOKING CONFIRM EMAIL
// ======================
function bookingConfirmEmail(
  name,
  ref,
  flightNo,
  origin,
  dest,
  fare,
  seat,
  seatClass,
  depTime
) {
  return `
    <h2>✈️ Booking Confirmed</h2>
    <p>Dear ${name},</p>
    <p>Your booking has been confirmed successfully.</p>
    <ul>
      <li>Reference: ${ref}</li>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Departure: ${new Date(depTime).toLocaleString()}</li>
      <li>Seat: ${seat} (${seatClass})</li>
      <li>Fare: Rs ${fare}</li>
    </ul>
    <p>Free cancellation within 24 hours.</p>
  `;
}

// ======================
// BOOKING CANCEL EMAIL
// ======================
function bookingCancelEmail(
  name,
  ref,
  flightNo,
  origin,
  dest,
  fare,
  penalty,
  refundAmount,
  isFree
) {
  return `
    <h2>❌ Booking Cancelled</h2>
    <p>Dear ${name},</p>
    <p>Your booking ${ref} has been cancelled.</p>
    <ul>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Fare: Rs ${fare}</li>
      <li>Penalty: Rs ${penalty}</li>
      <li>Refund: Rs ${refundAmount}</li>
    </ul>
  `;
}

// ======================
// FLIGHT DELAY EMAIL
// ======================
function flightDelayEmail(
  name,
  flightNo,
  origin,
  dest,
  origTime,
  newTime,
  reason
) {
  return `
    <h2>⚠️ Flight Delay Notice</h2>
    <p>Dear ${name},</p>
    <p>Your flight has been delayed.</p>
    <ul>
      <li>Flight: ${flightNo}</li>
      <li>Route: ${origin} → ${dest}</li>
      <li>Original Time: ${new Date(origTime).toLocaleString()}</li>
      <li>New Time: ${new Date(newTime).toLocaleString()}</li>
      <li>Reason: ${reason}</li>
    </ul>
  `;
}

// ======================
// SMS TEMPLATES
// ======================
function bookingConfirmSMS(name, ref, flightNo, origin, dest) {
  return `AirLine MS
Booking Confirmed!
Ref: ${ref}
Flight: ${flightNo}
Route: ${origin} to ${dest}`;
}

function bookingCancelSMS(ref, refundAmount, isFree) {
  return `AirLine MS
Booking Cancelled
Ref: ${ref}
Refund: Rs ${refundAmount}`;
}

function flightDelaySMS(flightNo, origin, dest, newTime) {
  return `AirLine MS
Flight Delayed
Flight: ${flightNo}
Route: ${origin} to ${dest}
New Time: ${new Date(newTime).toLocaleString()}`;
}

// ======================
// EXPORTS
// ======================
module.exports = {
  sendEmail,
  sendSMS,
  bookingConfirmEmail,
  bookingCancelEmail,
  flightDelayEmail,
  bookingConfirmSMS,
  bookingCancelSMS,
  flightDelaySMS
};