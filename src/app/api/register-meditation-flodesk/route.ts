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

    // Add to Flodesk subscriber list
    const subscriber = await addToFlodesk(name, email);
    
    // Add to segment to trigger email workflow
    try {
      await addToFlodeskSegment(subscriber.id);
    } catch (error) {
      // Don't fail the whole registration if segment fails
      console.warn('Failed to add to segment for email trigger:', error);
    }

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

async function addToFlodesk(name: string, email: string) {
  const flodeskApiKey = process.env.FLODESK_API_KEY;

  if (!flodeskApiKey) {
    console.error('FLODESK_API_KEY not configured');
    throw new Error('Flodesk API key not configured');
  }

  // Add subscriber to Flodesk with tags to trigger workflows
  const subscriberData = {
    email: email,
    first_name: name,
    tags: ['art-meditation-registrant'], // This tag will trigger the email workflow
    custom_fields: {
      source: 'Art Meditation Registration',
      signup_date: new Date().toISOString(),
      event_name: 'Art Meditation',
      event_date: ART_MEDITATION_EVENT.date,
      zoom_link: ART_MEDITATION_EVENT.meetingLink,
      zoom_passcode: ART_MEDITATION_EVENT.passcode
    }
  };

  const response = await fetch('https://api.flodesk.com/v1/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(flodeskApiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscriberData),
  });

  console.log('Flodesk response status:', response.status);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Flodesk error:', error);
    throw new Error(`Flodesk error: ${error}`);
  }

  const result = await response.json();
  console.log('Flodesk success:', result);
  
  return result;
}

async function addToFlodeskSegment(subscriberId: string) {
  const flodeskApiKey = process.env.FLODESK_API_KEY;
  const segmentId = process.env.FLODESK_SEGMENT_ID;

  if (!flodeskApiKey) {
    console.error('FLODESK_API_KEY not configured');
    throw new Error('Flodesk API key not configured');
  }

  if (!segmentId || segmentId === 'your-segment-id-here') {
    console.log('FLODESK_SEGMENT_ID not configured - skipping email workflow');
    console.log('Subscriber was added to Flodesk, but no confirmation email will be sent');
    console.log('To enable emails: Create a segment in Flodesk, create a workflow triggered by that segment, and add the segment ID to .env.local');
    return;
  }

  // Add subscriber to segment (this triggers the workflow)
  const response = await fetch(`https://api.flodesk.com/v1/subscribers/${subscriberId}/segments`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(flodeskApiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      segment_ids: [segmentId]
    }),
  });

  console.log('Flodesk segment response status:', response.status);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Flodesk segment error:', error);
    console.warn(`Failed to add subscriber ${subscriberId} to segment ${segmentId}: ${error}`);
    return;
  }

  console.log(`Successfully added subscriber ${subscriberId} to segment ${segmentId} - email workflow should trigger`);
}