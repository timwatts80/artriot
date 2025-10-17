// Debug newsletter signup with detailed logging
require('dotenv').config({ path: './.env.local' });

async function debugNewsletterSignup() {
  console.log('🔍 Debugging newsletter signup process...');
  
  const email = 'debug-test@example.com';
  
  try {
    console.log('\n1. 📧 Testing sendWelcomeEmail function directly...');
    
    // Test the welcome email function exactly as it's called in the API
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Welcome to the ArtRiot Community! 🎨'
      }],
      from: { 
        email: process.env.SENDGRID_FROM_EMAIL || 'tim@onemorelight.cc',
        name: 'ArtRiot Team'
      },
      content: [{
        type: 'text/html',
        value: generateWelcomeEmailHTML(email)
      }]
    };

    console.log(`From: ${emailData.from.email}`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${emailData.personalizations[0].subject}`);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ SendGrid API error: ${error}`);
      throw new Error(`SendGrid API error: ${response.statusText}`);
    } else {
      console.log('✅ Email sent successfully via SendGrid API');
    }

    console.log('\n2. 🔍 Testing via localhost API...');
    
    const apiResponse = await fetch('http://localhost:3000/api/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'api-test@example.com' }),
    });

    const apiResult = await apiResponse.json();
    console.log(`API Response:`, apiResult);

  } catch (error) {
    console.error('❌ Error in debug:', error.message);
  }
}

function generateWelcomeEmailHTML(email) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ArtRiot!</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
    }
    .logo { 
      max-width: 200px; 
      height: auto; 
      margin-bottom: 10px; 
    }
    .content { 
      margin: 20px 0; 
    }
    .cta-button { 
      background-color: #f11568; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 5px; 
      display: inline-block;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer { 
      text-align: center; 
      color: #666; 
      font-size: 14px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://artriot.timwatts.art/Art_Riot_Horizontal.png" alt="ArtRiot" class="logo">
    <h1>🎨 Welcome to ArtRiot!</h1>
  </div>
  
  <div class="content">
    <p>Hey there, creative rebel!</p>
    
    <p>Welcome to ArtRiot – a playful rebellion against perfection! We're thrilled you've joined our community of mindful creators.</p>
    
    <p><strong>What you can expect:</strong></p>
    <ul>
      <li>🎨 <strong>Event Updates</strong> – Be the first to know about our art sessions and workshops</li>
      <li>💡 <strong>Creative Inspiration</strong> – Tips, techniques, and mindful art practices</li>
      <li>🤝 <strong>Community Highlights</strong> – Stories from fellow artists in our community</li>
      <li>🎁 <strong>Exclusive Content</strong> – Special offers and early access to new programs</li>
    </ul>
    
    <p>We regularly host mindful art sessions and creative workshops. Keep an eye on your inbox for announcements about upcoming events!</p>
    
    <div style="text-align: center;">
      <a href="https://artriot.timwatts.art" class="cta-button">
        Visit ArtRiot →
      </a>
    </div>
    
    <p>Remember: At ArtRiot, there's no such thing as "perfect" art – only authentic expression. We're here to create freely, express mindfully, and connect with community.</p>
    
    <p>Looking forward to creating with you!</p>
    <p><strong>The ArtRiot Team</strong></p>
  </div>
  
  <div class="footer">
    <p>ArtRiot - A playful rebellion against perfection</p>
    <p>You received this because you signed up for updates at artriot.timwatts.art</p>
  </div>
</body>
</html>`;
}

debugNewsletterSignup();