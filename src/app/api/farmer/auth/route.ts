import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, getOrCreateFarmerProducer } from '@/lib/db';
import { setAuthCookie } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await findUserByEmail(cleanEmail);
    const userPassword = user?.password || user?.password_hash;
    if (!user || user.role !== 'farmer' || !userPassword || password !== userPassword) {
      return NextResponse.json({ success: false, error: 'Invalid farmer credentials.' }, { status: 401 });
    }

    const producer = await getOrCreateFarmerProducer(user);
    if (!producer) {
      return NextResponse.json({ success: false, error: 'Farmer profile is unavailable.' }, { status: 500 });
    }
    const authenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      address: user.address,
      role: 'farmer' as const,
      producer_id: producer.id,
    };
    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
    });
    setAuthCookie(response, user);
    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 400 });
  }
}