import { NextResponse } from 'next/server';
import { fetchAdminStats } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const stats = await fetchAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
