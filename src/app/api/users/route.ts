import { NextRequest, NextResponse } from 'next/server';
import { fetchUsers, deleteUser } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
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
