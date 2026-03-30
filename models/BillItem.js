const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  subServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubService',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  subServiceName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // New stock detail fields
  category: {
    type: String,
    trim: true,
    default: ''
  },
  subCategory: {
    type: String,
    trim: true,
    default: ''
  },
  totalStock: {
    type: Number,
    min: 0,
    default: 0
  },
  // New counting fields
  sheetCount: {
    type: Number,
    min: 0,
    default: 0
  },
  wastCount: {
    type: Number,
    min: 0,
    default: 0
  },
  totalCount: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate amount before saving
billItemSchema.pre('save', function(next) {
  this.amount = this.quantity * this.unitPrice;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BillItem', billItemSchema);
