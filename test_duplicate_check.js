const axios = require('axios');

// Test script to verify the duplicate check API works correctly
async function testDuplicateCheck() {
  try {
    // Test the API endpoint directly
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8082';
    
    console.log('Testing duplicate check API...');
    
    // Test with a sample DOI
    const response = await axios.post(`${baseUrl}/api/articles/check-duplicate`, {
      doi: '10.1000/test-doi',
      excludeId: '1'  // This should exclude article with ID '1' from results
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response:', response.data);
    console.log('✓ Duplicate check API test passed');
    
  } catch (error) {
    console.error('✗ Error testing duplicate check API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testDuplicateCheck();