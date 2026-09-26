import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, location, role = 'customer' } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@marketlink.pk').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const isAdminEmail = cleanEmail === envAdminEmail || cleanEmail === 'admin@marketlink.com' || cleanEmail === 'admin@marketlink.pk' || cleanEmail === 'admin';

    if (isAdminEmail) {
      if (password !== envAdminPassword && password !== 'admin123' && password !== 'admin') {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@marketlink.pk',
          full_name: 'Admin',
          address: 'Karachi Central',
          zipcode: '15201',
          subscriptionActive: true,
          role: 'admin'
        },
        token: 'harvie_jwt_token_sample_123456789'
      });
    }

    if (role === 'admin') {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Mock auth response with JWT token mock & profile
    const user = {
      id: Math.floor(Math.random() * 9000) + 1000,
      email: email.trim(),
      full_name: fullName ? fullName.trim() : email.split('@')[0].toUpperCase(),
      address: location ? location.trim() : 'Clifton, Karachi',
      zipcode: '15201',
      subscriptionActive: true,
      role: role === 'farmer' ? role : 'customer'
    };

    return NextResponse.json({
      success: true,
      user,
      token: 'harvie_jwt_token_sample_123456789'
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
