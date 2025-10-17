// Test script to send a sample registration email
// Run with: node test-email.js

const fetch = require('node:fetch');

async function sendTestEmail() {
  const testRegistration = {
    name: 'Tim Watts (Test)',
    email: 'tim_watts@ymail.com'
  };

  try {
    console.log('Sending test email to:', testRegistration.email);
    
    const response = await fetch('http://localhost:3000/api/register-meditation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRegistration),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!', result.message);
      console.log('Check tim_watts@ymail.com for the confirmation email');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

sendTestEmail();