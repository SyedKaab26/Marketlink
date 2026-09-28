import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { setAuthCookie } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || '';

    const isAdminEmail = !!envAdminEmail && cleanEmail === envAdminEmail;

    if (isAdminEmail) {
      if (!envAdminPassword || password !== envAdminPassword) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }

      const response = NextResponse.json({
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
      setAuthCookie(response, { id: 1, email: cleanEmail, full_name: 'Admin', role: 'admin' });
      return response;
    }

    // Lookup created user in database
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No account found with this email. Please create an account first.'
      }, { status: 401 });
    }

    // Verify password if set
    const userPassword = user.password || user.password_hash;
    if (userPassword && userPassword !== password) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password. Please try again.'
      }, { status: 401 });
    }

    const authenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      address: user.address || 'Clifton, Karachi',
      zipcode: user.zipcode || '15201',
      subscriptionActive: true,
      role: user.role || 'customer'
    };
    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
      token: 'harvie_jwt_token_sample_123456789'
    });
    setAuthCookie(response, authenticatedUser);
    return response;
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
