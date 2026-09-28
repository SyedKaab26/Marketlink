import { NextRequest, NextResponse } from 'next/server';
import { fetchUsers, deleteUser, saveUser } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { getAuthUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const users = await fetchUsers();
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
    }
    const { email, password, full_name, address, role = 'customer' } = await request.json();

    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password || typeof full_name !== 'string' || !full_name.trim()) {
      return NextResponse.json({ success: false, error: 'Email, password and full name are required' }, { status: 400 });
    }

    const newUser = await saveUser({
      email: email.trim(),
      password,
      full_name: full_name.trim(),
      address: address ? address.trim() : '',
      role: role === 'farmer' || role === 'admin' ? role : 'customer'
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }
    const success = await deleteUser(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
