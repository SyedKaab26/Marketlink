import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, saveProduct, deleteProduct, getOrCreateFarmerProducer } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { getAuthUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const tag = searchParams.get('tag') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const products = await fetchProducts(categoryId, tag, search);
    if (searchParams.get('scope') === 'farmer') {
      const user = getAuthUser(request);
      if (!user || user.role !== 'farmer') {
        return NextResponse.json({ success: false, error: 'Farmer login required.' }, { status: 401 });
      }
      const producer = await getOrCreateFarmerProducer(user);
      const ownedProducts = products.filter((product) => product.producer_id === producer?.id);
      return NextResponse.json({ success: true, count: ownedProducts.length, products: ownedProducts });
    }
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = getAuthUser(request);
    if (!user || !['farmer', 'admin'].includes(user.role || '')) {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    const producer = user.role === 'farmer' ? await getOrCreateFarmerProducer(user) : null;
    const product = await saveProduct(user.role === 'farmer' ? { ...body, producer_id: producer?.id } : body);
    return NextResponse.json({ success: true, product });
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
    if (user.role === 'farmer') {
      const producer = await getOrCreateFarmerProducer(user);
      const existing = (await fetchProducts()).find((item) => item.id === Number(body.id));
      if (!producer || existing?.producer_id !== producer.id) {
        return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
      }
      body.producer_id = producer.id;
    }
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user || !['farmer', 'admin'].includes(user.role || '')) {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }
    if (user.role === 'farmer') {
      const producer = await getOrCreateFarmerProducer(user);
      const existing = (await fetchProducts()).find((item) => item.id === id);
      if (!producer || existing?.producer_id !== producer.id) {
        return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
      }
    }
    const success = await deleteProduct(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
