// Send test emails to your actual email to debug delivery
require('dotenv').config({ path: './.env.local' });

async function sendTestEmails() {
  const testEmail = 'tim_watts@ymail.com'; // Using your actual email
  
  console.log('📧 Sending test emails to check delivery...');
  console.log(`Target email: ${testEmail}`);
  
  // Test 1: Newsletter-style email (like the welcome email)
  console.log('\n1. Testing Newsletter Welcome Email...');
  try {
    const newsletterData = {
      personalizations: [{
        to: [{ email: testEmail }],
        subject: '[TEST] Newsletter Welcome Email'
      }],
      from: { 
        email: process.env.SENDGRID_FROM_EMAIL || 'tim@onemorelight.cc',
        name: 'ArtRiot Team'
      },
      content: [{
        type: 'text/html',
        value: `
          <h1>🎨 Test Newsletter Email</h1>
          <p>This is a test of the newsletter welcome email system.</p>
          <p>If you receive this, the newsletter emails are working!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        `
      }]
    };

    const response1 = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData),
    });

    console.log(`Newsletter email status: ${response1.status}`);
    if (response1.ok) {
      console.log('✅ Newsletter test email sent');
    } else {
      const error = await response1.text();
      console.log('❌ Newsletter email failed:', error);
    }
  } catch (error) {
    console.log('❌ Newsletter email error:', error.message);
  }

  // Test 2: Registration-style email  
  console.log('\n2. Testing Registration Confirmation Email...');
  try {
    const registrationData = {
      personalizations: [{
        to: [{ email: testEmail, name: 'Tim Test' }],
        subject: '[TEST] Registration Confirmation Email'
      }],
      from: { 
        email: process.env.SENDGRID_FROM_EMAIL || 'hello@artriot.com',
        name: 'ArtRiot Team'
      },
      content: [{
        type: 'text/html',
        value: `
          <h1>🎨 Test Registration Email</h1>
          <p>This is a test of the registration confirmation email system.</p>
          <p>If you receive this, the registration emails are working!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        `
      }]
    };

    const response2 = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    console.log(`Registration email status: ${response2.status}`);
    if (response2.ok) {
      console.log('✅ Registration test email sent');
    } else {
      const error = await response2.text();
      console.log('❌ Registration email failed:', error);
    }
  } catch (error) {
    console.log('❌ Registration email error:', error.message);
  }

  console.log('\n📬 Check your email (tim_watts@ymail.com) for both test emails');
  console.log('📱 Also check spam/junk folders');
  console.log('⏰ Emails may take 1-5 minutes to arrive');
  console.log('\n💡 If only one email arrives, we\'ll know which system has the issue');
}

sendTestEmails();