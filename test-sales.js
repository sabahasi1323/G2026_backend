const axios = require('axios');

async function testSalesAPI() {
  try {
    console.log('Testing sales API...');
    const response = await axios.get('http://localhost:5000/api/sales');
    console.log('Sales API Response:', response.status);
    console.log('Sales Data:', response.data);
    
    // Test customer search
    console.log('\nTesting customer search...');
    const searchResponse = await axios.get('http://localhost:5000/api/sales/search/customers?q=test');
    console.log('Customer Search Response:', searchResponse.status);
    console.log('Customer Search Data:', searchResponse.data);
    
  } catch (error) {
    console.error('Error testing sales API:', error.response?.data || error.message);
  }
}

testSalesAPI();
