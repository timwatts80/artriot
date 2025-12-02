import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, eventType, name, listId } = await request.json();

    if (!email || !eventType) {
      return NextResponse.json({ error: 'Email and event type are required' }, { status: 400 });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
    }

    // Get list ID from environment variables based on event type, or use provided listId as fallback
    const getListIdFromEnv = (eventType: string): number => {
      // Special case: map waitlist-frequencies-flow to jade bloom upcoming interest
      if (eventType === 'waitlist-frequencies-flow') {
        const envValue = process.env.BREVO_JADE_BLOOM_UPCOMING_INTEREST_LIST_ID;
        return envValue ? parseInt(envValue) : 15;
      }
      
      // Map homepage notifications to Art Riot interest list
      if (eventType === 'homepage_notifications' || eventType === 'art_riot_interest') {
        const envValue = process.env.BREVO_ART_RIOT_INTEREST_LIST_ID;
        return envValue ? parseInt(envValue) : 16;
      }
      
      // Map workshop SLC to workshop SLC upcoming interest list
      if (eventType === 'workshop_slc' || eventType === 'workshop_slc_upcoming') {
        const envValue = process.env.BREVO_WORKSHOP_SLC_UPCOMING_INTEREST_LIST_ID;
        return envValue ? parseInt(envValue) : 17;
      }
      
      const envKey = `BREVO_${eventType.toUpperCase().replace('-', '_')}_LIST_ID`;
      const envValue = process.env[envKey];
      return envValue ? parseInt(envValue) : 15; // Default to 15 if not found
    };

    const targetListId = listId || getListIdFromEnv(eventType);

    // Add contact to Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name || email.split('@')[0],
          WAITLIST_EVENT: eventType,
        },
        listIds: [targetListId],
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', errorData);
      
      // Check if it's a duplicate contact error (which is actually success)
      if (brevoResponse.status === 400 && errorData.includes('Contact already exist')) {
        // Even if contact exists, we might want to send the welcome email if they are signing up again
        // But usually we don't want to spam. Let's assume if they are re-submitting, they might want the email?
        // For now, let's only send if it's a new signup or if we want to be generous.
        // Actually, the user asked to send a confirmation email to a new subscriber.
        // If they already exist, maybe we shouldn't send it again?
        // But if they are signing up via the modal, they might expect an email.
        // Let's send it only if the add was successful (new contact) OR if we decide to.
        // The prompt says "send a confirmation email to a new subscriber".
        // So if they already exist, maybe skip it?
        // But the code below returns success for duplicates.
        
        // Let's stick to sending it only for successful NEW adds for now to avoid spam, 
        // unless the user specifically asks otherwise.
        // However, if the user was in a different list and now added to this one, Brevo might return success (201 or 204) or error?
        // Brevo returns 400 if contact exists.
        
        return NextResponse.json({ 
          message: 'Successfully added to waitlist',
          status: 'success' 
        });
      }
      
      return NextResponse.json({ 
        error: 'Failed to add to waitlist', 
        details: errorData 
      }, { status: 500 });
    }

    // Send welcome email if it's the general newsletter
    if (eventType === 'art_riot_interest' || eventType === 'homepage_notifications') {
      await sendWelcomeEmail(email, name || email.split('@')[0], BREVO_API_KEY);
    }

    return NextResponse.json({ 
      message: 'Successfully added to waitlist',
      status: 'success' 
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function sendWelcomeEmail(email: string, name: string, apiKey: string) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "ArtRiot Team",
          email: "info@artriot.live"
        },
        to: [
          {
            email: email,
            name: name
          }
        ],
        subject: "Welcome to the ArtRiot Community! 🎨",
        htmlContent: generateWelcomeEmailHTML(name)
      }),
    });

    if (!response.ok) {
      console.error('Failed to send welcome email:', await response.text());
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

function generateWelcomeEmailHTML(name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ArtRiot!</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f4;
      padding-bottom: 40px;
    }
    .container {
      background-color: #ffffff;
      margin: 0 auto;
      max-width: 600px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      background: #000; 
      color: white; 
      padding: 40px 20px; 
    }
    .logo { 
      max-width: 200px; 
      height: auto; 
      margin-bottom: 20px;
    }
    .content { 
      padding: 40px 30px; 
    }
    .button { 
      background: #f11568; 
      color: white !important; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      display: inline-block;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer { 
      text-align: center; 
      color: #888; 
      font-size: 12px;
      padding: 20px;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
    }
    h1 { margin: 0 0 20px 0; font-size: 24px; }
    h2 { color: #f11568; font-size: 20px; margin-top: 30px; }
    p { margin-bottom: 15px; }
    .social-links { margin-top: 20px; }
    .social-links a { color: #f11568; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="wrapper" style="background-color: #f4f4f4; padding: 20px 0;">
    <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
      <div class="header">
        <img src="https://img.mailinblue.com/10104848/images/content_library/original/691f59ae9413d1f6655e06a9.png" alt="ArtRiot" class="logo">
        <h1>Welcome to the Rebellion! 🎨</h1>
      </div>
      
      <div class="content">
        <p>Hi ${name},</p>
        
        <p>You're in! Welcome to the ArtRiot community. We're so glad you're here.</p>
        
        <p>ArtRiot is a playful rebellion against perfection. We believe art should be about expression, connection, and joy—not judgment or rules.</p>
        
        <h2>What to Expect</h2>
        <p>As a subscriber, you'll be the first to know about:</p>
        <ul>
          <li>Upcoming in-person workshops and events</li>
          <li>New art kits and creative resources</li>
          <li>Community highlights and artist spotlights</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="https://www.artriot.live/in-person-events" class="button">View Upcoming Events</a>
        </div>
        
        <h2>Join the Conversation</h2>
        <p>Connect with fellow creators in our daily community group. It's a safe space to share your work, ask questions, and get inspired.</p>
        
        <div style="text-align: center;">
          <a href="https://www.facebook.com/groups/artriot" style="color: #1877F2; text-decoration: none; font-weight: bold;">Join our Facebook Group →</a>
        </div>
        
        <p style="margin-top: 30px;">We can't wait to see what you create!</p>
        
        <p>Creatively yours,<br>
        <strong>The ArtRiot Team</strong></p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} ArtRiot. All rights reserved.</p>
        <p>You received this email because you signed up for updates from ArtRiot.</p>
        <p><a href="https://www.artriot.live" style="color: #888;">artriot.live</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}