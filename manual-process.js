require('dotenv').config({ path: '.env.local' });

// Manual trigger for the post-payment process
async function manuallyProcessRegistration(confirmationNumber) {
  console.log(`🔧 Manually processing registration ${confirmationNumber}...\n`);

  // Mock the data that would come from Stripe webhook
  const mockData = {
    participantName: 'Tim Watts',
    participantEmail: 'tim_watts@ymail.com', // Change this to your actual email
    eventName: 'Frequencies & Flow',
    confirmationNumber: confirmationNumber,
    amount: 55
  };

  // Send Brevo email
  try {
    console.log('📧 Sending confirmation email...');
    const emailData = {
      sender: { email: 'info@artriot.live', name: 'Art Riot Live' },
      to: [{ email: mockData.participantEmail }],
      subject: `Registration Confirmed - ${mockData.eventName}`,
      htmlContent: generateEmailHTML(mockData)
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
      console.log('✅ Confirmation email sent');
    } else {
      const error = await emailResponse.text();
      console.log('❌ Email failed:', error);
    }

    // Add to Brevo CRM
    console.log('👤 Adding to Brevo CRM...');
    const contactData = {
      email: mockData.participantEmail,
      attributes: {
        FIRSTNAME: 'Tim',
        LASTNAME: 'Watts',
        EXT_ID: confirmationNumber
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
      console.log('✅ Added to Brevo CRM');
    } else {
      const error = await contactResponse.text();
      console.log('❌ CRM addition failed:', error);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

function generateEmailHTML(data) {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #fff; margin: 0;">
      Art<span style="color: #f11568;">Riot</span> Live
    </h1>
  </div>
  
  <h2 style="color: #f11568; margin-bottom: 20px;">Registration Confirmed! 🎉</h2>
  
  <p style="color: #ccc; line-height: 1.6;">Hi ${data.participantName},</p>
  
  <p style="color: #ccc; line-height: 1.6;">
    Welcome to Art Riot Live! Your registration for <strong style="color: #fff;">${data.eventName}</strong> 
    has been confirmed and your payment has been processed.
  </p>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f11568;">
    <h3 style="color: #fff; margin-top: 0;">Event Details:</h3>
    <p style="color: #ccc; margin: 10px 0;"><strong>Event:</strong> ${data.eventName}</p>
    <p style="color: #ccc; margin: 10px 0;"><strong>Amount Paid:</strong> $${data.amount}</p>
    <p style="color: #ccc; margin: 10px 0;"><strong>Confirmation #:</strong> ${data.confirmationNumber}</p>
  </div>
  
  <div style="background: #2d1810; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b;">
    <h3 style="color: #f59e0b; margin-top: 0;">Important Notice:</h3>
    <p style="color: #fbbf24; line-height: 1.6; margin: 0;">
      This experience is not therapy or medical treatment. Our sessions are designed for educational, creative, and wellness purposes only.
    </p>
  </div>
  
  <p style="color: #ccc; line-height: 1.6;">
    Can't wait to create with you!<br>
    <strong style="color: #fff;">The Art Riot Team</strong>
  </p>
</div>
  `;
}

// Run with the most recent confirmation number
manuallyProcessRegistration('318676');