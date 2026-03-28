const mongoose = require('mongoose');
const Service = require('./models/Service');
const ExpenseCategory = require('./models/ExpenseCategory');
require('dotenv').config();

const seedAllSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/machinery_maintenance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await ExpenseCategory.deleteMany({});
    console.log('Cleared existing settings data');

    // Create default services
    const defaultServices = [
      {
        serviceName: 'Machine Maintenance',
        description: 'Regular maintenance and repair services for all machinery',
        isActive: true
      },
      {
        serviceName: 'Installation Service',
        description: 'Professional installation of new machinery and equipment',
        isActive: true
      },
      {
        serviceName: 'Technical Support',
        description: '24/7 technical support and troubleshooting services',
        isActive: true
      },
      {
        serviceName: 'Training Service',
        description: 'Operator training and safety certification programs',
        isActive: true
      },
      {
        serviceName: 'Consultation Service',
        description: 'Expert consultation for machinery optimization and efficiency',
        isActive: true
      }
    ];

    // Create default expense categories
    const defaultExpenseCategories = [
      {
        name: 'Office Supplies',
        description: 'Stationery, office equipment, and other office necessities',
        isActive: true
      },
      {
        name: 'Maintenance',
        description: 'Equipment maintenance, repairs, and spare parts',
        isActive: true
      },
      {
        name: 'Utilities',
        description: 'Electricity, water, internet, and other utility bills',
        isActive: true
      },
      {
        name: 'Travel',
        description: 'Business travel, accommodation, and transportation',
        isActive: true
      },
      {
        name: 'Marketing',
        description: 'Advertising, promotions, and marketing materials',
        isActive: true
      },
      {
        name: 'Other Expenses',
        description: 'Miscellaneous expenses and other costs',
        isActive: true
      }
    ];

    // Insert services
    const createdServices = await Service.insertMany(defaultServices);
    console.log('Created services:');
    createdServices.forEach(service => {
      console.log(`- ${service.serviceName} (${service.isActive ? 'Active' : 'Inactive'})`);
    });

    // Insert expense categories
    const createdCategories = await ExpenseCategory.insertMany(defaultExpenseCategories);
    console.log('Created expense categories:');
    createdCategories.forEach(category => {
      console.log(`- ${category.name} (${category.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('Settings seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAllSettings();
