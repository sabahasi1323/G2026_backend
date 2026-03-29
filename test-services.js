const axios = require('axios');

async function testServiceEndpoints() {
  try {
    // Test creating a service
    console.log('Testing service creation...');
    const serviceResponse = await axios.post('http://localhost:5000/api/services', {
      serviceName: 'Test Service',
      description: 'This is a test service',
      isActive: true
    });
    console.log('Service created:', serviceResponse.data);

    // Test getting all services
    console.log('\nTesting get all services...');
    const servicesResponse = await axios.get('http://localhost:5000/api/services');
    console.log('All services:', servicesResponse.data);

    // Test creating a sub-service
    if (servicesResponse.data.length > 0) {
      console.log('\nTesting sub-service creation...');
      const subServiceResponse = await axios.post('http://localhost:5000/api/subservices', {
        subServiceName: 'Test Sub-Service',
        description: 'This is a test sub-service',
        serviceId: servicesResponse.data[0]._id,
        price: 100,
        unit: 'hour',
        isActive: true
      });
      console.log('Sub-service created:', subServiceResponse.data);

      // Test getting all sub-services
      console.log('\nTesting get all sub-services...');
      const subServicesResponse = await axios.get('http://localhost:5000/api/subservices');
      console.log('All sub-services:', subServicesResponse.data);
    }

    console.log('\n✅ All endpoints are working correctly!');
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.response?.data || error.message);
  }
}

testServiceEndpoints();
