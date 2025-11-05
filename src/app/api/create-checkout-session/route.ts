import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkTicketAvailability } from '@/lib/db';
import { STRIPE_CONFIG } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      eventType, 
      participantInfo,
      emergencyContact,
      eventDate 
    } = body;

    // Validate required fields
    if (!eventType || !participantInfo || !emergencyContact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the appropriate price ID and event details
    let priceId: string;
    let eventName: string;

    switch (eventType) {
      case 'frequencies-flow':
        priceId = STRIPE_CONFIG.FREQUENCIES_FLOW_PRICE_ID;
        eventName = 'Frequencies + Flow: Creative Expression';
        break;
      case 'somatic-movement':
        priceId = STRIPE_CONFIG.SOMATIC_MOVEMENT_PRICE_ID;
        eventName = 'Body Wisdom: Somatic Art Journey';
        break;
      case 'meditation':
        priceId = STRIPE_CONFIG.MEDITATION_PRICE_ID;
        eventName = 'Breathe & Create: Deep Meditation Studio';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    // Check ticket availability (but don't reserve yet - only check)
    try {
      const availability = await checkTicketAvailability(eventType);
      
      if (availability.available <= 0) {
        return NextResponse.json(
          { error: 'Sorry, this event is sold out' },
          { status: 400 }
        );
      }
      
      console.log(`Event ${eventType}: ${availability.available}/${availability.total} tickets available - proceeding to checkout`);
    } catch (error) {
      console.error('Error checking ticket availability:', error);
      return NextResponse.json(
        { error: 'Unable to check ticket availability. Please try again.' },
        { status: 500 }
      );
    }

    // Generate 6-digit confirmation number
    const confirmationNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${request.nextUrl.origin}/register/in-person/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/register/in-person/cancel`,
      metadata: {
        confirmationNumber,
        eventType,
        eventName,
        eventDate,
        participantName: `${participantInfo.firstName} ${participantInfo.lastName}`.trim(),
        participantFirstName: participantInfo.firstName,
        participantLastName: participantInfo.lastName,
        participantEmail: participantInfo.email,
        participantPhone: participantInfo.phone,
        participantDateOfBirth: participantInfo.dateOfBirth,
        emergencyContactName: emergencyContact.name,
        emergencyContactPhone: emergencyContact.phone,
        emergencyContactRelation: emergencyContact.relation,
        dietaryRestrictions: participantInfo.dietaryRestrictions || '',
        medicalConditions: participantInfo.medicalConditions || '',
        experience: participantInfo.experience || '',
      },
      customer_email: participantInfo.email,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}