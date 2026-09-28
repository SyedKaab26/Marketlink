import { NextRequest, NextResponse } from 'next/server';
import { fetchOrders, fetchProducts, saveOrder, updateOrderStatus, deleteOrder, getOrCreateFarmerProducer } from '@/lib/db';
import { getErrorMessage } from '@/lib/utils';
import { getAuthUser } from '@/lib/server-auth';
import type { OrderItem } from '@/lib/types';

type FarmerOrderItem = OrderItem & { producer_id?: number; product_id?: number };
type CheckoutOrderItem = OrderItem & { producer_id: number; product_id: number };

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    let orders = await fetchOrders();
    if (user.role === 'admin') {
      return NextResponse.json({ success: true, count: orders.length, orders });
    }
    if (user.role === 'customer') {
      orders = orders.filter((order) => Number(order.user_id) === user.id);
      return NextResponse.json({ success: true, count: orders.length, orders });
    }
    if (user.role === 'farmer') {
      const producer = await getOrCreateFarmerProducer(user);
      const products = producer ? (await fetchProducts()).filter((item) => item.producer_id === producer.id) : [];
      const productIds = new Set(products.map((product) => product.id));
      const productNames = new Set(products.map((product) => product.name.trim().toLowerCase()));
      orders = orders.flatMap((order) => {
        const items: FarmerOrderItem[] = typeof order.items_json === 'string'
          ? (() => { try { return JSON.parse(order.items_json) as FarmerOrderItem[]; } catch { return []; } })()
          : Array.isArray(order.items_json) ? order.items_json as FarmerOrderItem[] : [];
        const ownedItems = items.filter((item) =>
          item?.producer_id === producer?.id || item?.product?.producer_id === producer?.id ||
          productIds.has(Number(item?.product_id ?? item?.product?.id)) ||
          productNames.has(String(item?.name || item?.product?.name || '').trim().toLowerCase())
        );
        if (!ownedItems.length) return [];
        const total = ownedItems.reduce((sum: number, item: FarmerOrderItem) =>
          sum + Number(item.price || item.product?.price || 0) * Number(item.quantity || 1), 0);
        return [{
          ...order,
          items_json: ownedItems,
          total_amount: total,
          farmer_can_update_status: ownedItems.length === items.length,
        }];
      });
      return NextResponse.json({ success: true, count: orders.length, orders });
    }
    return NextResponse.json({ success: false, error: 'Access denied.' }, { status: 403 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, user_id, shipping_address, coupon_code } = body;
    const user = getAuthUser(request);

    if (!user || user.role !== 'customer' || Number(user_id) !== user.id) {
      return NextResponse.json(
        { success: false, error: 'A matching customer login is required to place an order.' },
        { status: 401 }
      );
    }

    if (!shipping_address || typeof shipping_address !== 'string' || !shipping_address.trim()) {
      return NextResponse.json(
        { success: false, error: 'Delivery location and address are required to place an order.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return NextResponse.json({ success: false, error: 'Cart items cannot be empty' }, { status: 400 });
    }

    const products = await fetchProducts();
    const orderItems: CheckoutOrderItem[] = [];
    let subtotal = 0;
    for (const item of items) {
      const productId = Number(item?.id);
      const quantity = Number(item?.qty);
      const product = products.find((candidate) => candidate.id === productId);
      if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100 || (product.stock !== undefined && quantity > product.stock)) {
        return NextResponse.json({ success: false, error: 'One or more cart items are invalid or unavailable.' }, { status: 400 });
      }
      orderItems.push({
        id: product.id,
        product_id: product.id,
        producer_id: product.producer_id,
        name: product.name,
        price: product.price,
        quantity
      });
      subtotal += product.price * quantity;
    }

    const discount = coupon_code === 'MARKETLINK2GO' ? Math.round(subtotal * 0.2) : 0;
    const deliveryFee = subtotal > 1500 ? 0 : 150;

    const result = await saveOrder({
      user_id: user.id,
      total: subtotal - discount + deliveryFee,
      items: orderItems,
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    const user = getAuthUser(request);
    if (!user || !['farmer', 'admin'].includes(user.role || '')) {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }

    if (user.role === 'farmer') {
      const producer = await getOrCreateFarmerProducer(user);
      const products = producer ? (await fetchProducts()).filter((item) => item.producer_id === producer.id) : [];
      const productIds = new Set(products.map((product) => product.id));
      const productNames = new Set(products.map((product) => product.name.trim().toLowerCase()));
      const order = (await fetchOrders()).find((item) => String(item.id) === String(id));
      const items: FarmerOrderItem[] = typeof order?.items_json === 'string'
        ? (() => { try { return JSON.parse(order.items_json) as FarmerOrderItem[]; } catch { return []; } })()
        : Array.isArray(order?.items_json) ? order.items_json as FarmerOrderItem[] : [];
      const ownsOrder = items.length > 0 && items.some((item: FarmerOrderItem) =>
        item?.producer_id === producer?.id || item?.product?.producer_id === producer?.id ||
        productIds.has(Number(item?.product_id ?? item?.product?.id)) ||
        productNames.has(String(item?.name || item?.product?.name || '').trim().toLowerCase())
      );
      if (!ownsOrder) return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    const success = await updateOrderStatus(id, status);
    return NextResponse.json({ success, message: `Order ${id} status updated to ${status}` });
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
