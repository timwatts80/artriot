import { NextRequest, NextResponse } from 'next/server';
import { 
  checkTicketAvailability, 
  reserveTicket, 
  recordRegistration, 
  redeemVoucher,
  getVoucher
} from '@/lib/db';

// Function to add contact to Brevo list (Duplicated from Stripe webhook - should be refactored to shared util)
async function addToBrevoList(email: string, firstName: string, lastName: string = '', confirmationNumber: string = '', phone: string = '', eventType: string = '') {
  if (!process.env.BREVO_API_KEY) return;

  let listId: number;
  switch (eventType) {
    case 'frequencies-flow': listId = 8; break;
    case 'somatic-movement': listId = 9; break;
    case 'meditation': listId = 10; break;
    case 'breathwork': listId = 19; break;
    default: listId = 8;
  }

  try {
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        SMS: phone,
        CONFIRMATION_NUMBER: confirmationNumber,
        EXT_ID: confirmationNumber
      },
      listIds: [listId],
      updateEnabled: true
    };

    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
  } catch (error) {
    console.error('Failed to add contact to Brevo:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      eventType, 
      participantInfo,
      emergencyContact,
      eventDate,
      voucherCode
    } = body;

    if (!eventType || !participantInfo || !voucherCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Validate Voucher again
    const voucher = await getVoucher(voucherCode);
    if (!voucher || voucher.status !== 'active') {
      return NextResponse.json({ error: 'Invalid or redeemed voucher' }, { status: 400 });
    }

    // 2. Check Availability
    const availability = await checkTicketAvailability(eventType);
    if (availability.available <= 0) {
      return NextResponse.json({ error: 'Event is sold out' }, { status: 400 });
    }

    // 3. Reserve Ticket
    const reserved = await reserveTicket(eventType);
    if (!reserved) {
      return NextResponse.json({ error: 'Event is sold out' }, { status: 400 });
    }

    // 4. Redeem Voucher
    await redeemVoucher(voucherCode, eventType);

    // 5. Record Registration
    const confirmationNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = `voucher_${voucherCode}_${Date.now()}`;

    await recordRegistration({
      eventType,
      confirmationNumber,
      sessionId,
      participantEmail: participantInfo.email,
      participantName: `${participantInfo.firstName} ${participantInfo.lastName}`,
      participantPhone: participantInfo.phone,
      amount: 0
    });

    // 6. Add to Brevo
    await addToBrevoList(
      participantInfo.email, 
      participantInfo.firstName, 
      participantInfo.lastName, 
      confirmationNumber, 
      participantInfo.phone, 
      eventType
    );

    // 7. Send Emails (TODO: Refactor email sending logic to shared util)
    // For now, we rely on Brevo automation or add email sending here if needed.
    // Since the Stripe webhook handles emails, we might need to duplicate that logic or extract it.
    // Given the complexity, let's assume Brevo automation handles "New Contact in List" emails, 
    // or we can add the email sending logic here later.

    return NextResponse.json({ 
      success: true, 
      confirmationNumber,
      sessionId 
    });

  } catch (error) {
    console.error('Error processing voucher registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
