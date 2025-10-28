import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check for SendGrid API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Email to Art Riot (notification)
    const notificationEmail = {
      to: 'info@artriot.live',
      from: process.env.SENDGRID_FROM_EMAIL || 'info@artriot.live',
      subject: `Contact Form: ${subject}`,
      text: `
New contact form submission from ${name}

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from ArtRiot.live contact form
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #f11568; border-bottom: 2px solid #f11568; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #f11568;">${email}</a></p>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #333;">Message:</h3>
    <div style="background: white; padding: 15px; border-left: 4px solid #f11568; border-radius: 4px;">
      ${message.replace(/\n/g, '<br>')}
    </div>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Sent from ArtRiot.live contact form on ${new Date().toLocaleDateString()}
  </p>
</div>
      `,
    };

    // Confirmation email to submitter
    const confirmationEmail = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'info@artriot.live',
      subject: 'Thank you for contacting Art Riot!',
      text: `
Hi ${name},

Thank you for reaching out to Art Riot! We've received your message about "${subject}" and appreciate you taking the time to connect with us.

We'll review your message and get back to you soon. In the meantime, feel free to:

• Join our Facebook community: https://www.facebook.com/groups/artriot
• Explore our virtual events: https://artriot.live/register/art-meditation
• Learn about Art Riot Live sessions: https://artriot.live/in-person-events

Keep creating,
The Art Riot Team

---
This is an automated confirmation. Please don't reply to this email.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #fff; margin: 0;">
      Art<span style="color: #f11568;">Riot</span>
    </h1>
  </div>
  
  <h2 style="color: #f11568; margin-bottom: 20px;">Thank you for contacting us!</h2>
  
  <p style="color: #ccc; line-height: 1.6;">Hi ${name},</p>
  
  <p style="color: #ccc; line-height: 1.6;">
    Thank you for reaching out to Art Riot! We've received your message about 
    <strong style="color: #fff;">"${subject}"</strong> and appreciate you taking the time to connect with us.
  </p>
  
  <p style="color: #ccc; line-height: 1.6;">
    We'll review your message and get back to you soon.
  </p>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f11568;">
    <h3 style="color: #fff; margin-top: 0;">In the meantime, feel free to:</h3>
    <ul style="color: #ccc; line-height: 1.8;">
      <li>Join our <a href="https://www.facebook.com/groups/artriot" style="color: #f11568; text-decoration: none;">Facebook community</a></li>
      <li>Explore our <a href="https://artriot.live/register/art-meditation" style="color: #f11568; text-decoration: none;">virtual events</a></li>
      <li>Learn about <a href="https://artriot.live/in-person-events" style="color: #f11568; text-decoration: none;">Art Riot Live sessions</a></li>
    </ul>
  </div>
  
  <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">
    Keep creating,<br>
    <strong style="color: #fff;">The Art Riot Team</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
  <p style="color: #666; font-size: 12px; text-align: center;">
    This is an automated confirmation. Please don't reply to this email.
  </p>
</div>
      `,
    };

    // Send both emails
    await Promise.all([
      sgMail.send(notificationEmail),
      sgMail.send(confirmationEmail)
    ]);

    // Log successful submission
    console.log('Contact form submission processed:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Message sent successfully! Check your email for confirmation.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's a SendGrid error
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as { response?: { body?: unknown } };
      console.error('SendGrid error:', sendGridError.response?.body);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact us directly.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}