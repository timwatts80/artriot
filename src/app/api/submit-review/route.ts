import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Function to send email via Brevo
async function sendBrevoEmail(to: string, subject: string, htmlContent: string, from: string = 'info@artriot.live') {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured, skipping email');
    return;
  }

  try {
    console.log('Attempting to send email to:', to, 'with subject:', subject);
    
    const emailData = {
      sender: { email: from, name: 'ArtRiot Live' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    console.log('Email data prepared:', { 
      sender: emailData.sender, 
      to: emailData.to, 
      subject: emailData.subject,
      htmlContentLength: htmlContent.length 
    });

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Email sent successfully via Brevo to:', to);
      console.log('Brevo response:', responseData);
    } else {
      const errorData = await response.text();
      console.error('Brevo email error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
  }
}

// Function to generate discount email HTML
function generateDiscountEmailHTML(data: {
  reviewerName: string;
  discountCode: string;
  eventName: string;
  rating: number;
}) {
  const starDisplay = '⭐'.repeat(data.rating);
  
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #fff; margin: 0;">
      Art<span style="color: #f11568;">Riot</span> Live
    </h1>
  </div>
  
  <h2 style="color: #f11568; margin-bottom: 20px;">Thank You for Your Review! 🎉</h2>
  
  <p style="color: #ccc; line-height: 1.6;">Hi ${data.reviewerName},</p>
  
  <p style="color: #ccc; line-height: 1.6;">
    Thank you so much for taking the time to share your experience at <strong style="color: #fff;">${data.eventName}</strong>! 
    Your ${starDisplay} rating means the world to us.
  </p>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f11568; text-align: center;">
    <h3 style="color: #fff; margin-top: 0;">Your Exclusive Discount</h3>
    <div style="background: #000; padding: 20px; border-radius: 8px; margin: 15px 0;">
      <div style="color: #f11568; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
        ${data.discountCode}
      </div>
      <p style="color: #fff; font-size: 18px; margin: 10px 0;"><strong>20% OFF</strong></p>
      <p style="color: #ccc; margin: 5px 0;">your next ArtRiot session</p>
    </div>
    <p style="color: #888; font-size: 14px; margin: 10px 0;">
      Valid for 90 days • Use at checkout when booking
    </p>
  </div>
  
  <h3 style="color: #fff;">Ready for Your Next Creative Adventure?</h3>
  <p style="color: #ccc; line-height: 1.6;">
    Use your discount code when booking any of our transformative sessions.
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://artriot.live/in-person-events" style="background: #f11568; color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block;">
      Book Your Next Session
    </a>
  </div>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #fff; margin-top: 0;">Share the Creative Joy:</h3>
    <p style="color: #ccc; line-height: 1.6;">
      Know someone who would love our sessions? Invite them to join our community:
    </p>
    <div style="margin: 15px 0;">
      <a href="https://www.facebook.com/groups/artriot" style="color: #f11568; text-decoration: none; font-weight: bold;">
        Join our Facebook Group →
      </a>
    </div>
  </div>
  
  <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">
    We can't wait to create with you again soon!
  </p>
  
  <p style="color: #ccc; line-height: 1.6;">
    With gratitude,<br>
    <strong style="color: #fff;">The ArtRiot Team</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
  
  <p style="color: #666; font-size: 12px; text-align: center;">
    Questions? Reply to this email or contact us at info@artriot.live<br>
    © 2025 ArtRiot Live. All rights reserved.
  </p>
</div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { rating, review, name, email, eventType } = await request.json();

    // Validate required fields
    if (!rating || !review || !name || !email || !eventType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create reviews table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        reviewer_email VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        discount_code VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Generate discount code (THANKYOU20 + random suffix for uniqueness)
    const discountCode = 'THANKYOU20';
    
    // Insert review into database
    const insertQuery = `
      INSERT INTO reviews (rating, review_text, reviewer_name, reviewer_email, event_type, discount_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at
    `;
    
    const result = await pool.query(insertQuery, [
      rating,
      review,
      name,
      email,
      eventType,
      discountCode
    ]);

    console.log(`Review submitted successfully:`, {
      id: result.rows[0].id,
      rating,
      reviewerName: name,
      eventType,
      createdAt: result.rows[0].created_at
    });

    // Get event name for email
    const eventNames: { [key: string]: string } = {
      'frequencies-flow': 'Frequencies + Flow',
      'meditation': 'Breathe & Create: Deep Meditation Studio',
      'somatic-movement': 'Body Wisdom: Somatic Art Journey',
      'art-meditation': 'Art & Meditation (Virtual)'
    };
    
    const eventName = eventNames[eventType] || eventType;

    // Send discount code email via Brevo
    const emailHTML = generateDiscountEmailHTML({
      reviewerName: name,
      discountCode: discountCode,
      eventName: eventName,
      rating: rating
    });

    await sendBrevoEmail(
      email, 
      'Your 20% Discount Code - Thank You! 🎨',
      emailHTML
    );

    console.log('Discount email sent to:', email);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      discountCode: discountCode,
      reviewId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}