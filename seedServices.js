const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/machinery_maintenance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

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

    // Insert services
    const createdServices = await Service.insertMany(defaultServices);
    console.log('Created services:');
    createdServices.forEach(service => {
      console.log(`- ${service.serviceName} (${service.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('Services seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedServices();
