const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `✈️ AirLine MS <${process.env.EMAIL_USER}>`,
      to, subject, html
    });
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.log(`❌ Email error: ${err.message}`);
    return { success: false, message: err.message };
  }
}

async function sendSMS(to, message) {
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const phone = to.startsWith('+') ? to : '+92' + to.replace(/^0/, '');
    await client.messages.create({ body: message, from: process.env.TWILIO_PHONE, to: phone });
    console.log(`✅ SMS sent to ${phone}`);
    return { success: true };
  } catch (err) {
    console.log(`❌ SMS error: ${err.message}`);
    return { success: false, message: err.message };
  }
}

function bookingConfirmEmail(name, ref, flightNo, origin, dest, fare, seat, seatClass, depTime) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f4f8;padding:20px;">
    <div style="background:linear-gradient(135deg,#1e3a5f,#0ea5e9);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:white;margin:0;letter-spacing:2px;">✈ AIRLINE MS</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Booking Confirmation</p>
    </div>
    <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
      <h2 style="color:#1e293b;">Booking Confirmed! 🎉</h2>
      <p style="color:#64748b;">Dear <b>${name}</b>, your flight has been booked successfully.</p>
      <div style="background:#f0f9ff;border:1px solid #e0f2fe;border-radius:10px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#64748b;padding:8px 0;">Booking Ref</td><td style="font-weight:700;color:#0ea5e9;text-align:right;">${ref}</td></tr>
          <tr style="border-top:1px solid #e0f2fe;"><td style="color:#64748b;padding:8px 0;">Flight</td><td style="font-weight:600;color:#1e293b;text-align:right;">${flightNo}</td></tr>
          <tr style="border-top:1px solid #e0f2fe;"><td style="color:#64748b;padding:8px 0;">Route</td><td style="font-weight:600;color:#1e293b;text-align:right;">${origin} → ${dest}</td></tr>
          <tr style="border-top:1px solid #e0f2fe;"><td style="color:#64748b;padding:8px 0;">Seat</td><td style="font-weight:600;color:#1e293b;text-align:right;">${seat} (${seatClass})</td></tr>
          <tr style="border-top:1px solid #e0f2fe;"><td style="color:#64748b;padding:8px 0;">Fare</td><td style="font-weight:700;color:#16a34a;text-align:right;">Rs ${fare.toLocaleString()}</td></tr>
        </table>
      </div>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;">
        <p style="color:#d97706;font-size:13px;margin:0;">⚠️ Free cancellation within 30 minutes. After that, 20% penalty applies. Refund in 7 working days.</p>
      </div>
    </div>
  </div>`;
}

function bookingCancelEmail(name, ref, flightNo, origin, dest, fare, penalty, refundAmount, isFree) {
  const headerBg = isFree ? 'linear-gradient(135deg,#16a34a,#34d399)' : 'linear-gradient(135deg,#dc2626,#f87171)';
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f4f8;padding:20px;">
    <div style="background:${headerBg};padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:white;margin:0;">✈ AIRLINE MS</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Booking Cancellation</p>
    </div>
    <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
      <h2 style="color:${isFree ? '#16a34a' : '#dc2626'};">${isFree ? 'Full Refund ✅' : 'Penalty Applied ⚠️'}</h2>
      <p style="color:#64748b;">Dear <b>${name}</b>, your booking has been cancelled.</p>
      <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#64748b;padding:8px 0;">Booking Ref</td><td style="font-weight:700;color:#dc2626;text-align:right;">${ref}</td></tr>
          <tr style="border-top:1px solid #fecaca;"><td style="color:#64748b;padding:8px 0;">Route</td><td style="text-align:right;">${origin} → ${dest}</td></tr>
          <tr style="border-top:1px solid #fecaca;"><td style="color:#64748b;padding:8px 0;">Original Fare</td><td style="text-align:right;">Rs ${fare.toLocaleString()}</td></tr>
          ${!isFree ? `<tr style="border-top:1px solid #fecaca;"><td style="color:#dc2626;padding:8px 0;">Penalty (20%)</td><td style="color:#dc2626;text-align:right;">- Rs ${penalty.toLocaleString()}</td></tr>` : ''}
          <tr style="border-top:1px solid #fecaca;"><td style="color:#64748b;padding:8px 0;">Refund Amount</td><td style="font-weight:700;color:#16a34a;text-align:right;">Rs ${refundAmount.toLocaleString()}</td></tr>
        </table>
      </div>
      <p style="color:#0369a1;font-size:13px;">💳 Refund will be processed within <b>7 working days</b>.</p>
    </div>
  </div>`;
}

function flightDelayEmail(name, flightNo, origin, dest, origTime, newTime, reason) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f4f8;padding:20px;">
    <div style="background:linear-gradient(135deg,#d97706,#fbbf24);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:white;margin:0;">✈ AIRLINE MS</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Flight Delay Notice</p>
    </div>
    <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
      <h2 style="color:#d97706;">Flight Delayed ⚠️</h2>
      <p style="color:#64748b;">Dear <b>${name}</b>, your flight has been delayed.</p>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#64748b;padding:8px 0;">Flight</td><td style="text-align:right;">${flightNo}</td></tr>
          <tr style="border-top:1px solid #fde68a;"><td style="color:#64748b;padding:8px 0;">Route</td><td style="text-align:right;">${origin} → ${dest}</td></tr>
          <tr style="border-top:1px solid #fde68a;"><td style="color:#64748b;padding:8px 0;">Original Time</td><td style="text-decoration:line-through;color:#dc2626;text-align:right;">${new Date(origTime).toLocaleString()}</td></tr>
          <tr style="border-top:1px solid #fde68a;"><td style="color:#64748b;padding:8px 0;">New Time</td><td style="font-weight:700;color:#16a34a;text-align:right;">${new Date(newTime).toLocaleString()}</td></tr>
          <tr style="border-top:1px solid #fde68a;"><td style="color:#64748b;padding:8px 0;">Reason</td><td style="text-align:right;">${reason}</td></tr>
        </table>
      </div>
    </div>
  </div>`;
}

function bookingConfirmSMS(name, ref, flightNo, origin, dest) {
  return `AirLine MS\nBooking Confirmed!\nRef: ${ref}\nFlight: ${flightNo}\nRoute: ${origin} to ${dest}\nFree cancellation within 30 minutes.`;
}

function bookingCancelSMS(ref, refundAmount, isFree) {
  return `AirLine MS\nBooking Cancelled\nRef: ${ref}\nRefund: Rs ${refundAmount.toLocaleString()}\n${isFree ? 'Full refund' : '20% penalty applied'}\nRefund in 7 working days.`;
}

function flightDelaySMS(flightNo, origin, dest, newTime) {
  return `AirLine MS\nFlight Delay\nFlight: ${flightNo}\nRoute: ${origin} to ${dest}\nNew Time: ${new Date(newTime).toLocaleString()}`;
}

module.exports = {
  sendEmail, sendSMS,
  bookingConfirmEmail, bookingCancelEmail, flightDelayEmail,
  bookingConfirmSMS, bookingCancelSMS, flightDelaySMS
};