import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { recordRegistration } from '@/lib/db';

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

    // Add confirmation number as custom attribute and EXT_ID
    if (confirmationNumber) {
      contactData.attributes.CONFIRMATION_NUMBER = confirmationNumber;
      contactData.attributes.EXT_ID = confirmationNumber; // Also store in EXT_ID field
    }

    console.log('Sending to Brevo:', JSON.stringify(contactData, null, 2));

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
      const responseData = await response.json();
      console.log('Contact added to Brevo list #8:', email, 'with confirmation:', confirmationNumber, 'phone:', contactData.attributes.SMS);
      console.log('Brevo response:', responseData);
      
      // Try to fetch the contact back to verify the extId was set
      if (confirmationNumber) {
        console.log('Attempting to verify EXT_ID was set...');
        try {
          const verifyResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
            headers: {
              'accept': 'application/json',
              'api-key': process.env.BREVO_API_KEY!
            }
          });
          if (verifyResponse.ok) {
            const contactData = await verifyResponse.json();
            console.log('Contact verification - EXT_ID:', contactData.attributes?.EXT_ID, 'CONFIRMATION_NUMBER:', contactData.attributes?.CONFIRMATION_NUMBER);
          }
        } catch (e) {
          console.log('Could not verify contact EXT_ID:', e);
        }
      }
    } else {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
      
      // Handle duplicate contact scenarios
      if (response.status === 400) {
        try {
          const errorObj = JSON.parse(errorData);
          if (errorObj.code === 'duplicate_parameter') {
            console.log('Contact already exists, attempting to update instead...');
            
            // Try to update the existing contact
            try {
              const updateData = {
                attributes: contactData.attributes,
                listIds: contactData.listIds,
              };
              
              const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
                method: 'PUT',
                headers: {
                  'accept': 'application/json',
                  'api-key': process.env.BREVO_API_KEY!,
                  'content-type': 'application/json'
                },
                body: JSON.stringify(updateData)
              });
              
              if (updateResponse.ok) {
                console.log('Successfully updated existing contact in Brevo with confirmation:', confirmationNumber);
              } else {
                const updateError = await updateResponse.text();
                console.error('Failed to update existing contact:', updateError);
              }
            } catch (updateErr) {
              console.error('Error updating existing contact:', updateErr);
            }
          }
        } catch (parseErr) {
          console.error('Could not parse Brevo error response:', errorData);
        }
      }
    }
  } catch (error) {
    console.error('Failed to add contact to Brevo:', error);
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Extract registration data from metadata
        const {
          confirmationNumber,
          eventType,
          eventName,
          eventDate,
          participantName,
          participantFirstName,
          participantLastName,
          participantEmail,
          participantPhone,
          participantDateOfBirth,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelation,
          dietaryRestrictions,
          medicalConditions,
          experience,
        } = session.metadata!;

        // Record registration in database
        try {
          await recordRegistration({
            eventType,
            confirmationNumber,
            sessionId: session.id,
            participantEmail,
            participantName,
            participantPhone,
            amount: session.amount_total! / 100, // Convert from cents
          });
          console.log('Registration recorded in database:', confirmationNumber);
        } catch (dbError) {
          console.error('Failed to record registration in database:', dbError);
          // Don't fail the webhook - the payment was successful
        }
        console.log('Registration completed:', {
          sessionId: session.id,
          eventType,
          participantEmail,
          participantName,
        });

        // Send confirmation email to participant
        const participantEmailHTML = generateParticipantEmailHTML({
          participantName,
          eventName,
          eventDate,
          confirmationNumber,
          sessionId: session.id,
          amount: session.amount_total! / 100, // Convert from cents
        });

        // Send notification email to admin
        const adminEmailHTML = generateAdminEmailHTML({
          confirmationNumber,
          participantName,
          participantEmail,
          participantPhone,
          eventName,
          eventDate,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelation,
          dietaryRestrictions,
          medicalConditions,
          experience,
          sessionId: session.id,
          amount: session.amount_total! / 100,
        });

        // Send both emails via Brevo
        await Promise.all([
          sendBrevoEmail(participantEmail, `Registration Confirmed: ${eventName}`, participantEmailHTML),
          sendBrevoEmail('info@artriot.live', `New Registration: ${eventName}`, adminEmailHTML)
        ]);

        // Add participant to Brevo list #8
        await addToBrevoList(participantEmail, participantFirstName, participantLastName, confirmationNumber, participantPhone);

        console.log('Registration emails sent successfully');

      } catch (error) {
        console.error('Error processing registration:', error);
        // Don't fail the webhook - Stripe should not retry
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

function generateParticipantEmailHTML(data: {
  participantName: string;
  eventName: string;
  eventDate: string;
  confirmationNumber: string;
  sessionId: string;
  amount: number;
}) {
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
    <p style="color: #ccc; margin: 10px 0;"><strong>Date:</strong> ${data.eventDate}</p>
    <p style="color: #ccc; margin: 10px 0;"><strong>Amount Paid:</strong> $${data.amount}</p>
    <p style="color: #ccc; margin: 10px 0;"><strong>Confirmation #:</strong> ${data.confirmationNumber}</p>
  </div>
  
  <h3 style="color: #fff;">What to Expect:</h3>
  <ul style="color: #ccc; line-height: 1.8;">
    <li>We'll send event reminders as the date approaches</li>
    <li>Location details and parking information will be provided</li>
    <li>All art supplies and materials are included</li>
    <li>Wear comfortable clothes you can move in</li>
    <li>Bring water and an open, playful spirit!</li>
  </ul>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #fff; margin-top: 0;">Join Our Community:</h3>
    <p style="color: #ccc;">Connect with other participants:</p>
    <a href="https://www.facebook.com/groups/artriot" style="color: #f11568; text-decoration: none;">
      Join our Facebook Group →
    </a>
  </div>
  
  <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">
    Questions? Reply to this email or contact us at info@artriot.live
  </p>
  
  <p style="color: #ccc; line-height: 1.6;">
    Can't wait to create with you!<br>
    <strong style="color: #fff;">The Art Riot Team</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
  <p style="color: #666; font-size: 12px; text-align: center;">
    Art Riot Live • Intermodal Expressive Arts Experience
  </p>
</div>
  `;
}

function generateAdminEmailHTML(data: {
  confirmationNumber: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  eventName: string;
  eventDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  experience: string;
  sessionId: string;
  amount: number;
}) {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #f11568; border-bottom: 2px solid #f11568; padding-bottom: 10px;">
    New Art Riot Live Registration
  </h2>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Event Information:</h3>
    <p><strong>Confirmation #:</strong> ${data.confirmationNumber}</p>
    <p><strong>Event:</strong> ${data.eventName}</p>
    <p><strong>Date:</strong> ${data.eventDate}</p>
    <p><strong>Amount Paid:</strong> $${data.amount}</p>
    <p><strong>Session ID:</strong> ${data.sessionId}</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Participant Details:</h3>
    <p><strong>Name:</strong> ${data.participantName}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.participantEmail}" style="color: #f11568;">${data.participantEmail}</a></p>
    <p><strong>Phone:</strong> ${data.participantPhone}</p>
    <p><strong>Experience Level:</strong> ${data.experience || 'Not specified'}</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Emergency Contact:</h3>
    <p><strong>Name:</strong> ${data.emergencyContactName}</p>
    <p><strong>Phone:</strong> ${data.emergencyContactPhone}</p>
    <p><strong>Relationship:</strong> ${data.emergencyContactRelation}</p>
  </div>
  
  ${data.dietaryRestrictions || data.medicalConditions ? `
  <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
    <h3 style="margin-top: 0; color: #333;">Important Notes:</h3>
    ${data.dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${data.dietaryRestrictions}</p>` : ''}
    ${data.medicalConditions ? `<p><strong>Medical Conditions:</strong> ${data.medicalConditions}</p>` : ''}
  </div>
  ` : ''}
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Registration completed on ${new Date().toLocaleDateString()} via Art Riot website
  </p>
</div>
  `;
}