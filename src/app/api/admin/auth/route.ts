import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAuthUser, setAuthCookie } from '@/lib/server-auth';
import { findUserByEmail, updateUserPasswordHash } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';
import type { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (user && user.role === 'admin') {
    return NextResponse.json({ success: true, user });
  }
  return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as { email?: unknown; password?: unknown };
    const { email, password } = body;

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail || typeof password !== 'string' || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }
    const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || '';

    const isEnvMatch = Boolean(envAdminEmail && envAdminPassword && cleanEmail === envAdminEmail && password === envAdminPassword);

    let dbUserMatch = false;
    let foundUserObj: (User & { password?: string; password_hash?: string }) | null = null;
    if (!isEnvMatch) {
      const dbUser = await findUserByEmail(cleanEmail);
      const storedPassword = dbUser?.password_hash || dbUser?.password;
      if (dbUser && dbUser.role === 'admin' && storedPassword && await verifyPassword(password, storedPassword)) {
        foundUserObj = dbUser;
        dbUserMatch = true;
        if (!storedPassword.startsWith('scrypt:')) {
          await updateUserPasswordHash(dbUser.id, await hashPassword(password));
        }
      }
    }

    if (isEnvMatch || dbUserMatch) {
      const adminUser: User = foundUserObj ? {
        id: foundUserObj.id,
        email: foundUserObj.email,
        full_name: foundUserObj.full_name,
        role: 'admin',
        address: foundUserObj.address || 'MarketLink HQ',
        zipcode: foundUserObj.zipcode || '75500'
      } : {
        id: 1,
        email: cleanEmail || 'admin@marketlink.pk',
        full_name: 'MarketLink Admin',
        role: 'admin',
        address: 'MarketLink HQ',
        zipcode: '75500'
      };

      const response = NextResponse.json({
        success: true,
        user: adminUser
      });

      setAuthCookie(response, adminUser);
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearAuthCookie(response);
  return response;
}

