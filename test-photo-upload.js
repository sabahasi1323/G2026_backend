const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

// Create a test image file (1x1 PNG)
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, // width: 1
  0x00, 0x00, 0x00, 0x01, // height: 1
  0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
  0x90, 0x77, 0x53, 0xDE, // CRC
  0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
  0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, // image data
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // padding
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
  0xAE, 0x42, 0x60, 0x82 // CRC
]);

// Write test image to disk
fs.writeFileSync('test-image.png', testImageBuffer);

// Test photo upload
async function testPhotoUpload() {
  try {
    // First get a customer ID
    const customersResponse = await axios.get('http://localhost:5000/api/customers');
    const customerId = customersResponse.data[0]._id;
    console.log('Using customer ID:', customerId);

    // Create form data
    const formData = new FormData();
    formData.append('photo', fs.createReadStream('test-image.png'), 'test-photo.png');

    // Upload photo
    const uploadResponse = await axios.post(
      `http://localhost:5000/api/customers/${customerId}/photo`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    console.log('Upload successful:', uploadResponse.data);

    // Clean up test file
    fs.unlinkSync('test-image.png');

  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
  }
}

testPhotoUpload();
