import { NextRequest, NextResponse } from 'next/server';
import { fetchUsers, deleteUser, saveUser } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password = 'password123', full_name, address, role = 'customer' } = await request.json();

    if (!email || !full_name) {
      return NextResponse.json({ success: false, error: 'Email and Full Name are required' }, { status: 400 });
    }

    const newUser = await saveUser({
      email: email.trim(),
      password,
      full_name: full_name.trim(),
      address: address ? address.trim() : '',
      role
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
