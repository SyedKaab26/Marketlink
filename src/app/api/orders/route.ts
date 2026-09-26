import { NextRequest, NextResponse } from 'next/server';
import { fetchOrders, saveOrder, updateOrderStatus, deleteOrder } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
  try {
    const orders = await fetchOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, deliveryDate, user_id, shipping_address } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'Account login is required to place an order. Please log in first.' },
        { status: 401 }
      );
    }

    if (!shipping_address || typeof shipping_address !== 'string' || !shipping_address.trim()) {
      return NextResponse.json(
        { success: false, error: 'Delivery location and address are required to place an order.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart items cannot be empty' }, { status: 400 });
    }

    const result = await saveOrder({
      user_id,
      total: total || 0,
      items,
      deliveryDate: deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shipping_address: shipping_address.trim()
    });

    return NextResponse.json({
      success: true,
      orderId: typeof result === 'object' && result !== null && 'insertId' in result
        ? result.insertId
        : Math.floor(Math.random() * 90000) + 10000,
      message: 'Order placed successfully! Delivery route assigned.'
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }

    const success = await updateOrderStatus(id, status);
    return NextResponse.json({ success, message: `Order ${id} status updated to ${status}` });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
    }

    const success = await deleteOrder(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
