const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware


app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type']
}));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/airlineDB')
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Failed:', err);
  });

// Routes
app.use('/api/flights', require('./routes/flights'));
app.use('/api/passengers', require('./routes/passengers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '✈️ Airline Management System Running!' });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});