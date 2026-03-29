const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ ALLOWED FRONTENDS (IMPORTANT)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://g2026-frontend.onrender.com',
  'https://lighthearted-dieffenbachia-95b49a.netlify.app' // ✅ ADD THIS
];

// ✅ CORS FIX (PRODUCTION READY)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// ✅ Routes
app.use('/api/machines', require('./routes/machines'));
app.use('/api/readings', require('./routes/readings'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/services', require('./routes/services'));
app.use('/api/subservices', require('./routes/subservices'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/expense-categories', require('./routes/expense-categories'));

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ message: 'API running ✅' });
});

// ✅ Health check (Render uses this)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});