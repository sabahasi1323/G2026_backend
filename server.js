const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  'https://celebrated-kashata-1a90d0.netlify.app',
'https://g2026-frontend.onrender.com', 
  'https://jazzy-dolphin-0bcd29.netlify.app'
  ];

// Middleware
app.use(cors({
  origin: ['https://g2026-frontend.onrender.com', 'https://jazzy-dolphin-0bcd29.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/machinery_maintenance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  // Test database connection
  mongoose.connection.db.admin().ping()
    .then(() => console.log('Database ping successful'))
    .catch(err => console.error('Database ping failed:', err));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
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
app.use('/api/test', require('./routes/test'));

app.get('/', (req, res) => {
  res.json({ message: 'Machinery Maintenance Management System API' });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
