import { NextResponse } from 'next/server';
import { getVoucher } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const voucher = await getVoucher(code);

    if (!voucher) {
      return NextResponse.json(
        { valid: false, message: 'Invalid code' },
        { status: 200 }
      );
    }

    if (voucher.status !== 'active') {
      return NextResponse.json(
        { valid: false, message: 'This voucher has already been redeemed' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: voucher.code,
      valueType: voucher.value_type
    });

  } catch (error) {
    console.error('Error validating voucher:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
