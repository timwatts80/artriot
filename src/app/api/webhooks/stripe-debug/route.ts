import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🔍 WEBHOOK DEBUG - Request received at:', new Date().toISOString());
  
  try {
    // Log headers
    console.log('📋 Headers:');
    req.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    // Log raw body
    const body = await req.text();
    console.log('📦 Raw body length:', body.length);
    console.log('📦 Body preview:', body.substring(0, 200) + '...');

    // Log environment variables (safely)
    console.log('🔑 Environment check:');
    console.log('  STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'MISSING');
    console.log('  BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'MISSING');
    console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');

    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      message: 'Debug webhook received successfully'
    });
    
  } catch (error) {
    console.error('💥 Debug webhook error:', error);
    return NextResponse.json({ 
      error: 'Debug webhook failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}