const dns = require('dns');
const nodemailer = require('nodemailer');

cconst transporter = nodemailer.createTransport({
  host: "74.125.69.108",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    servername: "smtp.gmail.com",
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