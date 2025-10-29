require('dotenv').config({ path: '.env.local' });

async function testBrevoIntegration() {
  console.log('🧪 Testing Live Brevo Integration...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? 'SET' : 'MISSING'}`);
  console.log('');

  if (!process.env.BREVO_API_KEY) {
    console.log('❌ Brevo API key is missing!');
    return;
  }

  try {
    // Test 1: Send email
    console.log('📧 Testing Email Send...');
    const emailData = {
      sender: { email: 'info@artriot.live', name: 'Art Riot Live' },
      to: [{ email: 'tim@onemorelight.cc' }],
      subject: 'Test Email - Live Registration Debug',
      htmlContent: `
        <h2>Test Email</h2>
        <p>This is a test email to verify Brevo integration is working.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    };

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      console.log('✅ Email sent successfully:', emailResult.messageId);
    } else {
      const error = await emailResponse.text();
      console.log('❌ Email failed:', emailResponse.status, error);
    }

    // Test 2: Add contact to list
    console.log('\n👤 Testing Contact Addition...');
    const contactData = {
      email: 'test@example.com',
      attributes: {
        FIRSTNAME: 'Test',
        LASTNAME: 'User',
        SMS: '+1234567890',
        EXT_ID: '123456'
      },
      listIds: [8],
      updateEnabled: true
    };

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    if (contactResponse.ok) {
      const contactResult = await contactResponse.json();
      console.log('✅ Contact added successfully:', contactResult.id);
    } else {
      const error = await contactResponse.text();
      console.log('❌ Contact addition failed:', contactResponse.status, error);
    }

    // Test 3: Check sender verification
    console.log('\n🔐 Checking Sender Verification...');
    const sendersResponse = await fetch('https://api.brevo.com/v3/senders', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      }
    });

    if (sendersResponse.ok) {
      const sendersData = await sendersResponse.json();
      console.log('📤 Available senders:');
      sendersData.senders?.forEach((sender, index) => {
        console.log(`${index + 1}. ${sender.email} (${sender.active ? 'Active' : 'Inactive'})`);
      });
      
      const infoSender = sendersData.senders?.find(s => s.email === 'info@artriot.live');
      if (infoSender) {
        console.log('✅ info@artriot.live is verified and active');
      } else {
        console.log('⚠️  info@artriot.live not found in verified senders');
      }
    } else {
      console.log('❌ Could not check senders');
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testBrevoIntegration();