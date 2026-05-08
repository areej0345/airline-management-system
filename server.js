const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Patch Express internal options handler
const originalOptions = app.options.bind(app);
app.options = function(path, ...handlers) {
  if (path === '*') path = '/{*splat}';
  return originalOptions(path, ...handlers);
};

// Manual CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/airlineDB')
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Connection Failed:', err));

app.use('/api/flights', require('./routes/flights'));
app.use('/api/passengers', require('./routes/passengers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.json({ message: '✈️ Airline Management System Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));