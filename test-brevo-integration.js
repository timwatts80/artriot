// Test the Brevo integration to debug the issue
require('dotenv').config({ path: '.env.local' });

async function testBrevoIntegration() {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('BREVO_API_KEY not found in environment');
    return;
  }

  console.log('Testing Brevo integration...');
  console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

  // Test data similar to what would come from a registration
  const testContactData = {
    email: 'test-new@example.com',
    attributes: {
      FIRSTNAME: 'Test',
      LASTNAME: 'NewUser',
      SMS: '+15551234567', // Different phone number
      CONFIRMATION_NUMBER: '789012',
      EXT_ID: '789012'
    },
    listIds: [8],
    updateEnabled: true
  };

  console.log('\nSending test contact data:');
  console.log(JSON.stringify(testContactData, null, 2));

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(testContactData)
    });

    console.log('\nBrevo API Response Status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('Success! Response:', responseData);
      
      // Now try to fetch the contact back to verify
      console.log('\nVerifying contact was created...');
      const verifyResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent('test-new@example.com')}`, {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey
        }
      });
      
      if (verifyResponse.ok) {
        const contactData = await verifyResponse.json();
        console.log('Contact verification successful:');
        console.log('- Email:', contactData.email);
        console.log('- EXT_ID attribute:', contactData.attributes?.EXT_ID);
        console.log('- CONFIRMATION_NUMBER attribute:', contactData.attributes?.CONFIRMATION_NUMBER);
        console.log('- All attributes:', contactData.attributes);
      } else {
        console.log('Could not verify contact:', verifyResponse.status);
      }
    } else {
      const errorData = await response.text();
      console.error('Brevo API Error:', errorData);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testBrevoIntegration();