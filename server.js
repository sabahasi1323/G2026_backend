const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/machinery_maintenance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

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
app.use('/api/users', require('./routes/users'));
app.use('/api/expense-categories', require('./routes/expense-categories'));

app.get('/', (req, res) => {
  res.json({ message: 'Machinery Maintenance Management System API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
