import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || '';

    if (envAdminEmail && envAdminPassword && cleanEmail === envAdminEmail && password === envAdminPassword) {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: cleanEmail,
          full_name: 'MarketLink Admin',
          role: 'admin'
        }
      });
      response.cookies.set('marketlink_admin_session', 'authenticated_admin_token_99', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('marketlink_admin_session');
  return response;
}
