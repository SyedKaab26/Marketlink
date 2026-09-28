import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const farmerEmail = (process.env.FARMER_EMAIL || '').trim().toLowerCase();
    const farmerPassword = process.env.FARMER_PASSWORD || '';

    if (farmerEmail && farmerPassword && cleanEmail === farmerEmail && password === farmerPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid farmer credentials.' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 400 });
  }
}