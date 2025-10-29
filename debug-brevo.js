// Debug script to check Brevo contact fields
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function debugBrevoContact() {
  const email = 'info@timwatts.art'; // Use the email that we know was successfully created (id: 7)
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('BREVO_API_KEY not found in environment');
    return;
  }

  try {
    console.log('Fetching contact:', email);
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    const response = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (response.ok) {
      const contactData = await response.json();
      console.log('\n=== FULL CONTACT DATA ===');
      console.log(JSON.stringify(contactData, null, 2));
      
      console.log('\n=== FIELD ANALYSIS ===');
      console.log('Email:', contactData.email);
      console.log('ID:', contactData.id);
      console.log('ExtId:', contactData.extId);
      console.log('Attributes:', contactData.attributes);
      console.log('Lists:', contactData.listIds);
      console.log('Created:', contactData.createdAt);
      console.log('Modified:', contactData.modifiedAt);
      
      // Check all top-level fields
      console.log('\n=== ALL TOP-LEVEL FIELDS ===');
      Object.keys(contactData).forEach(key => {
        console.log(`${key}:`, typeof contactData[key], contactData[key]);
      });
      
    } else {
      const errorData = await response.text();
      console.error('Error fetching contact:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to fetch contact:', error);
  }
}

// Also check available contact attributes/fields
async function checkAvailableFields() {
  const apiKey = process.env.BREVO_API_KEY;
  
  try {
    console.log('\n=== CHECKING AVAILABLE ATTRIBUTES ===');
    const response = await fetch('https://api.brevo.com/v3/contacts/attributes', {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (response.ok) {
      const attributesData = await response.json();
      console.log('Available attributes:');
      console.log(JSON.stringify(attributesData, null, 2));
    } else {
      const errorData = await response.text();
      console.error('Error fetching attributes:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to fetch attributes:', error);
  }
}

// Run both functions
async function main() {
  await debugBrevoContact();
  await checkAvailableFields();
}

main();