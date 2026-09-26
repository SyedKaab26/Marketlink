import { NextRequest, NextResponse } from 'next/server';
import { fetchQuizResponses, saveQuizResponse } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const responses = await fetchQuizResponses();
    return NextResponse.json({ success: true, count: responses.length, responses });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zipcode, dietary_prefs, shopping_type, household_size } = body;

    if (!zipcode) {
      return NextResponse.json({ success: false, error: 'Zipcode is required' }, { status: 400 });
    }

    const result = await saveQuizResponse({
      zipcode,
      dietary_prefs: dietary_prefs || [],
      shopping_type: shopping_type || 'Weekly Subscription',
      household_size: household_size || 2
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully!',
      result
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
