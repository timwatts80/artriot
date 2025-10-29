import { NextRequest, NextResponse } from 'next/server';
import { checkTicketAvailability, getEvent } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const eventType = url.searchParams.get('eventType');

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    // Get event details and availability
    const [event, availability] = await Promise.all([
      getEvent(eventType),
      checkTicketAvailability(eventType)
    ]);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      event: {
        eventType: event.event_type,
        eventName: event.event_name,
        eventDate: event.event_date,
        priceInCents: event.price_cents,
        totalTickets: event.total_tickets,
        soldTickets: event.sold_tickets,
      },
      availability: {
        available: availability.available,
        total: availability.total,
        soldOut: availability.available <= 0
      }
    });

  } catch (error) {
    console.error('Error checking event availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}