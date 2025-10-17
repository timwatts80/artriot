// Test both email functions to see which one fails
require('dotenv').config({ path: './.env.local' });

async function testBothEmailFunctions() {
  console.log('🔍 Testing both email functions...');
  console.log(`SENDGRID_FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || 'NOT SET'}`);
  
  // Test newsletter email
  console.log('\n📧 Testing Newsletter Welcome Email...');
  try {
    const newsletterEmailData = {
      personalizations: [{
        to: [{ email: 'test-newsletter@example.com' }],
        subject: 'Welcome to the ArtRiot Community! 🎨'
      }],
      from: { 
        email: process.env.SENDGRID_FROM_EMAIL || 'tim@onemorelight.cc',
        name: 'ArtRiot Team'
      },
      content: [{
        type: 'text/html',
        value: '<h1>Test Newsletter Email</h1><p>This is a test newsletter welcome email.</p>'
      }]
    };

    console.log(`From email: ${newsletterEmailData.from.email}`);

    const newsletterResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterEmailData),
    });

    if (newsletterResponse.ok) {
      console.log('✅ Newsletter email sent successfully');
    } else {
      const error = await newsletterResponse.text();
      console.log('❌ Newsletter email failed:');
      console.log(`   Status: ${newsletterResponse.status}`);
      console.log(`   Error: ${error}`);
    }

  } catch (error) {
    console.log('❌ Newsletter email error:', error.message);
  }

  // Test registration email
  console.log('\n🎨 Testing Registration Confirmation Email...');
  try {
    const registrationEmailData = {
      personalizations: [{
        to: [{ email: 'test-registration@example.com', name: 'Test User' }],
        subject: 'Art Meditation Registration Confirmed - Google Meet Link Inside'
      }],
      from: { 
        email: process.env.SENDGRID_FROM_EMAIL || 'hello@artriot.com',
        name: 'ArtRiot Team'
      },
      content: [{
        type: 'text/html',
        value: '<h1>Test Registration Email</h1><p>This is a test registration confirmation email.</p>'
      }]
    };

    console.log(`From email: ${registrationEmailData.from.email}`);

    const registrationResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationEmailData),
    });

    if (registrationResponse.ok) {
      console.log('✅ Registration email sent successfully');
    } else {
      const error = await registrationResponse.text();
      console.log('❌ Registration email failed:');
      console.log(`   Status: ${registrationResponse.status}`);
      console.log(`   Error: ${error}`);
    }

  } catch (error) {
    console.log('❌ Registration email error:', error.message);
  }

  // Check verified senders
  console.log('\n🔐 Checking verified senders...');
  try {
    const sendersResponse = await fetch('https://api.sendgrid.com/v3/verified_senders', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (sendersResponse.ok) {
      const sendersData = await sendersResponse.json();
      console.log('Verified senders:');
      sendersData.results?.forEach((sender, index) => {
        console.log(`${index + 1}. ${sender.from_email} (${sender.verified ? 'Verified' : 'Not Verified'})`);
      });
    } else {
      console.log('Could not fetch verified senders');
    }
  } catch (error) {
    console.log('Error checking verified senders:', error.message);
  }
}

testBothEmailFunctions();