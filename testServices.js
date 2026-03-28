const mongoose = require('mongoose');
const Service = require('./models/Service');

const testServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://gdatas:5zyah3fsRly2mxj1@gdatas.avbx9ok.mongodb.net/machinery_maintenance');
    console.log('Connected to MongoDB');

    // Test creating a service
    const testService = new Service({
      serviceName: 'Test Service',
      description: 'This is a test service',
      isActive: true
    });

    const savedService = await testService.save();
    console.log('Test service created:', savedService);

    // Test fetching services
    const services = await Service.find();
    console.log('All services:', services.length);
    services.forEach(service => {
      console.log('- ' + service.serviceName);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testServices();
