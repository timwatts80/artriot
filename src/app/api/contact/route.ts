import { NextRequest, NextResponse } from 'next/server';

// Function to send email via Brevo
async function sendBrevoEmail(to: string, subject: string, htmlContent: string, from: string = 'info@artriot.live') {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured, skipping email');
    return;
  }

  try {
    const emailData = {
      sender: { email: from, name: 'Art Riot Live' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log('Email sent successfully via Brevo to:', to);
    } else {
      const errorData = await response.text();
      console.error('Brevo email error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
  }
}

// Function to add contact to Brevo list
async function addToBrevoList(email: string, firstName: string, lastName: string = '', confirmationNumber: string = '', phone: string = '') {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured, skipping Brevo integration');
    return;
  }

  try {
    const contactData: {
      email: string;
      attributes: Record<string, string>;
      listIds: number[];
      updateEnabled: boolean;
      extId?: string;
    } = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName
      },
      listIds: [8], // Add to list ID #8
      updateEnabled: true // Update if contact already exists
    };

    // Add phone number if provided - format for international use
    if (phone) {
      // Format phone number for Brevo (remove any non-digits and add +1 if US number)
      let formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone; // Add US country code if 10 digits
      } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
        formattedPhone = '+' + formattedPhone; // Add + if 11 digits starting with 1
      }
      contactData.attributes.SMS = formattedPhone;
    }

    // Only add extId if confirmation number is provided
    if (confirmationNumber) {
      contactData.extId = confirmationNumber;
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      console.log('Contact added to Brevo list #8:', email, confirmationNumber ? `with confirmation: ${confirmationNumber}` : '(contact form)');
    } else {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to add contact to Brevo:', error);
  }
}

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

    // Check for Brevo API key
    if (!process.env.BREVO_API_KEY) {
      console.error('Brevo API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Email to Art Riot (notification)
    const notificationEmailHTML = `
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
    `;

    // Confirmation email to submitter
    const confirmationEmailHTML = `
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
    `;

    // Send both emails via Brevo
    await Promise.all([
      sendBrevoEmail('info@artriot.live', `Contact Form: ${subject}`, notificationEmailHTML),
      sendBrevoEmail(email, 'Thank you for contacting Art Riot!', confirmationEmailHTML)
    ]);

    // Add contact to Brevo list #8
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';
    await addToBrevoList(email, firstName, lastName);

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
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}