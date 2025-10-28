import { NextRequest, NextResponse } from 'next/server';
import { ART_MEDITATION_EVENT } from '../../../config/events';

interface RegistrationData {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email }: RegistrationData = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send confirmation email
    await sendConfirmationEmail(name, email);

    // Add to SendGrid contacts list
    await addToSendGridContacts(name, email);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Check your email for the Zoom link.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function addToSendGridContacts(name: string, email: string) {
  const listId = 'a5be9857-e965-4772-9ba5-c8c1ee4171a1'; // Art Riot list
  
  const contactData = {
    list_ids: [listId],
    contacts: [{
      email: email,
      first_name: name,
      custom_fields: {
        'w2_D': new Date().toLocaleDateString('en-US'), // MM/DD/YYYY format for signup_date field
        'w3_T': 'Art Meditation Registration' // source field ID
      }
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });

  console.log('SendGrid contacts response status:', response.status);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('SendGrid contacts error:', error);
    throw new Error(`SendGrid contacts error: ${error}`);
  }

  const result = await response.json();
  console.log('SendGrid contacts success:', result);
}

async function sendConfirmationEmail(name: string, email: string) {
  const emailData = {
    personalizations: [{
      to: [{ email: email, name: name }],
      subject: 'Art Meditation Registration Confirmed - Zoom Link Inside'
    }],
    from: { 
      email: process.env.SENDGRID_FROM_EMAIL || 'hello@artriot.com',
      name: 'ArtRiot Team'
    },
    content: [{
      type: 'text/html',
      value: generateConfirmationEmailHTML(name)
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`SendGrid API error: ${response.statusText}`);
  }
}

function generateConfirmationEmailHTML(name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Art Meditation - You're Registered!</title>
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
      background: #000; 
      color: white; 
      padding: 30px; 
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .logo { 
      max-width: 250px; 
      height: auto; 
      display: block;
      margin: 0 auto 20px auto;
    }
    .content { 
      background: #f9f9f9; 
      padding: 30px; 
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .meet-link { 
      background: #f11568; 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      display: inline-block;
      font-weight: bold;
      margin: 20px 0;
    }
    .details { 
      background: #e8f4f8; 
      padding: 20px; 
      border-radius: 5px;
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
    <img src="https://artriot.timwatts.art/Art_Riot_Horizontal.png" alt="ArtRiot" class="logo" style="max-width: 250px; height: auto; margin-bottom: 20px;">
    <h1>🎨 You're Registered for Art Meditation!</h1>
  </div>
  
  <div class="content">
    <p>Hi ${name},</p>
    
    <p>Welcome to ArtRiot's Art Meditation session! We're excited to have you join us for a mindful creative experience.</p>
    
    <div class="details">
      <h3>📅 Event Details</h3>
      <p><strong>Date:</strong> ${ART_MEDITATION_EVENT.date}</p>
      <p><strong>Time:</strong> ${ART_MEDITATION_EVENT.time}</p>
      <p><strong>Duration:</strong> ${ART_MEDITATION_EVENT.duration}</p>
      <p><strong>Format:</strong> ${ART_MEDITATION_EVENT.format}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 15px; font-size: 18px; color: #333;"><strong>Join Here:</strong></p>
      <a href="${ART_MEDITATION_EVENT.meetingLink}" style="color: #f11568; font-size: 16px; text-decoration: underline; word-break: break-all;">
        ${ART_MEDITATION_EVENT.meetingLink}
      </a>
      <p style="margin-top: 15px; font-size: 16px; color: #666;"><strong>Passcode:</strong> ${ART_MEDITATION_EVENT.passcode}</p>
    </div>
    
    <h3>🎨 What to Prepare</h3>
    <ul>
      <li>Any art supplies you have available (paper, pencils, colors, etc.)</li>
      <li>A quiet, comfortable space where you can create</li>
      <li>An open mind and willingness to explore</li>
      <li>No experience necessary - just curiosity!</li>
    </ul>
    
    <h3>💡 What to Expect</h3>
    <p>This session combines mindfulness with creative expression. We'll start with a brief meditation to center ourselves, then explore art as a form of mindful practice. No pressure, no judgment - just pure creative flow.</p>
    
    <p>Questions? Simply reply to this email - we'd love to help!</p>
    
    <p>Looking forward to creating with you,<br>
    <strong>The ArtRiot Team</strong></p>
  </div>
  
  <div class="footer">
    <p>ArtRiot - A playful rebellion against perfection</p>
    <p>This email was sent because you registered for our Art Meditation session.</p>
  </div>
</body>
</html>`;
}