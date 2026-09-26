import { NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
