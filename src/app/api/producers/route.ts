import { NextRequest, NextResponse } from 'next/server';
import { fetchProducers, saveProducer, toggleProducerVerified, deleteProducer, getOrCreateFarmerProducer } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { getAuthUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const producers = await fetchProducers();
    if (new URL(request.url).searchParams.get('scope') === 'farmer') {
      const user = getAuthUser(request);
      if (!user || user.role !== 'farmer') {
        return NextResponse.json({ success: false, error: 'Farmer login required.' }, { status: 401 });
      }
      const producer = await getOrCreateFarmerProducer(user);
      return NextResponse.json({ success: true, producers: producer ? [producer] : [] });
    }
    return NextResponse.json({ success: true, producers });
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
    const body = await request.json();
    const producer = await saveProducer(body);
    return NextResponse.json({ success: true, producer });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const user = getAuthUser(request);
    if (!user || !['farmer', 'admin'].includes(user.role || '')) {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    const owner = user.role === 'farmer' ? await getOrCreateFarmerProducer(user) : null;
    if (user.role === 'farmer' && !owner) {
      return NextResponse.json({ success: false, error: 'Farmer profile is unavailable.' }, { status: 404 });
    }
    const producer = await saveProducer(user.role === 'farmer' ? { ...body, id: owner?.id } : body);
    return NextResponse.json({ success: true, producer });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
    }
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
    const user = getAuthUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin login required.' }, { status: 401 });
    }
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
