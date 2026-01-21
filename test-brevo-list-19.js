// Test script to add a contact to Brevo list 19
require('dotenv').config({ path: '.env.local' });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const LIST_ID = 19;
const TEST_EMAIL = 'test-breathwork-' + Date.now() + '@example.com';

async function testBrevoList() {
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is missing in .env.local');
    return;
  }

  console.log(`Testing adding ${TEST_EMAIL} to list ${LIST_ID}...`);

  const contactData = {
    email: TEST_EMAIL,
    attributes: {
      FIRSTNAME: 'Test',
      LASTNAME: 'User'
    },
    listIds: [LIST_ID],
    updateEnabled: true
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Success! Contact added.');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.error('Failed to add contact.');
      console.error('Status:', response.status);
      console.error('Error:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testBrevoList();
