import { NextRequest, NextResponse } from 'next/server';
import { fetchAdminStats } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { getAuthUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const stats = await fetchAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
