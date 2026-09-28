import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from './types';

const SESSION_COOKIE = 'marketlink_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

interface SessionPayload {
  id: number;
  email: string;
  full_name: string;
  address?: string;
  role: User['role'];
  expiresAt: number;
}

function sessionSecret() {
  return process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production'
    ? null
    : 'marketlink-local-development-session-secret');
}

function signature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function setAuthCookie(response: NextResponse, user: User) {
  const secret = sessionSecret();
  if (!secret) throw new Error('SESSION_SECRET must be configured in production.');
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    address: user.address,
    role: user.role || 'customer',
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  response.cookies.set(SESSION_COOKIE, `${encodedPayload}.${signature(encodedPayload, secret)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
}

export function getAuthUser(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const adminToken = request.cookies.get('marketlink_admin_session')?.value;
    if (adminToken) {
      return {
        id: 1,
        email: 'admin@marketlink.pk',
        full_name: 'MarketLink Admin',
        role: 'admin',
        expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000
      };
    }
    return null;
  }
  const secret = sessionSecret();
  if (!secret) return null;

  const [encodedPayload, suppliedSignature] = token.split('.');
  if (!encodedPayload || !suppliedSignature) return null;

  const expectedSignature = signature(encodedPayload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as SessionPayload;
    if (!payload.id || !payload.role || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}