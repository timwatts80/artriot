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