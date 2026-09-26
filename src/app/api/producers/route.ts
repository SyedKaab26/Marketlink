import { NextRequest, NextResponse } from 'next/server';
import { fetchProducers, saveProducer, toggleProducerVerified, deleteProducer } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const producers = await fetchProducers();
    return NextResponse.json({ success: true, producers });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const producer = await saveProducer(body);
    return NextResponse.json({ success: true, producer });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Producer ID required' }, { status: 400 });
    }
    const success = await toggleProducerVerified(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Producer ID required' }, { status: 400 });
    }
    const success = await deleteProducer(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
