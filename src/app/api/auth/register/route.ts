import { NextRequest, NextResponse } from 'next/server';
import { saveUser } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { setAuthCookie } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, location, role = 'customer' } = await request.json();

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }
    if (typeof password !== 'string' || !password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }
    if (typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    const newUser = await saveUser({
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      address: location ? location.trim() : '',
      role: role === 'farmer' ? 'farmer' : 'customer'
    });

    const response = NextResponse.json({
      success: true,
      user: {
        ...newUser,
        subscriptionActive: true
      }
    });
    setAuthCookie(response, newUser);
    return response;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
