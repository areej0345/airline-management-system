const dns = require('dns');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    family: 4,
    rejectUnauthorized: false
  }
});

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
    return { success: false, message: err.message };
  }
}