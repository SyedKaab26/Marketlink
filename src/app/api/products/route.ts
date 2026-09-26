import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, saveProduct, deleteProduct } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const tag = searchParams.get('tag') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const products = await fetchProducts(categoryId, tag, search);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }
    const success = await deleteProduct(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
