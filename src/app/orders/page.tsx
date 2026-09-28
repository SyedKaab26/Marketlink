'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import QuizModal from '@/components/QuizModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import { clearStoredUser, setStoredUser, useStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import type { Order, OrderItem } from '@/lib/types';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  ArrowRight,
  RefreshCw,
  LogIn,
  AlertCircle
} from 'lucide-react';

type DisplayOrderItem = OrderItem & { qty?: number };

export default function OrdersPage() {
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const user = useStoredUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUserOrders(currentUser: ReturnType<typeof useStoredUser>) {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        if (currentUser) {
          const userOrders = data.orders.filter(
            (o: Order) =>
              o.user_id === currentUser.id ||
              (o.customer_email && o.customer_email.toLowerCase() === currentUser.email.toLowerCase())
          );
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => fetchUserOrders(user));
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
          </span>
        );
      case 'In transit':
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
            <Truck className="w-3.5 h-3.5 text-sky-600" /> {status}
          </span>
        );
      case 'Ready to ship':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            <Package className="w-3.5 h-3.5 text-amber-600" /> Ready to Ship
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Processing
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          clearStoredUser();
        }}
        user={user}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
              Order Management & History
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1D3E2E] mt-1">
              My Orders & Deliveries
            </h1>
            <p className="text-sm text-[#55695E] mt-1">
              Track farm-fresh deliveries, view Cash on Delivery details, and order history.
            </p>
          </div>

          {!user ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1D3E2E] hover:bg-[#E06D3B] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4 text-[#E06D3B]" /> Log In to View Personal Orders
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#55695E] bg-white px-4 py-2 rounded-2xl border border-[#E0D8C8]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Logged in as <strong className="text-[#1D3E2E]">{user.full_name || user.email}</strong></span>
            </div>
          )}
        </div>

        {!user && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-center gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Showing sample market orders.</p>
              <p>Log in to your account to view your exact delivery status and track real-time orders.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#E06D3B] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#1D3E2E]">Fetching your recent orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E0D8C8] shadow-sm space-y-4 my-6">
            <ShoppingBag className="w-16 h-16 text-[#B5A893] mx-auto stroke-1" />
            <h2 className="font-serif text-2xl font-bold text-[#1D3E2E]">No Orders Found Yet</h2>
            <p className="text-sm text-[#55695E] max-w-md mx-auto">
              You haven&apos;t placed any farm-fresh orders yet. Explore our market catalog to order organic produce directly from Pakistani farms.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#E06D3B] hover:bg-[#c85a29] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
            >
              <span>Explore Products & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items: DisplayOrderItem[] = typeof order.items_json === 'string'
                ? (() => { try { return JSON.parse(order.items_json) as DisplayOrderItem[]; } catch { return []; } })()
                : Array.isArray(order.items_json) ? order.items_json : [];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#E0D8C8] shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-[#F4EFE6] px-6 py-4 border-b border-[#E8E2D5] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B7355]">Order ID</span>
                        <h3 className="font-bold text-base text-[#1D3E2E]">{order.id}</h3>
                      </div>
                      <div className="hidden sm:block border-l border-[#DCD3C1] h-8" />
                      <div className="hidden sm:block">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B7355]">Customer</span>
                        <p className="text-xs font-bold text-[#1D3E2E]">{order.customer_name || 'Walk-in Customer'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="font-serif font-bold text-lg text-[#E06D3B]">
                        Rs. {Number(order.total_amount || 0).toLocaleString('en-PK')}
                      </span>
                    </div>
                  </div>

                  {/* Order Body Details */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8B7355] border-b border-[#F0EAE0] pb-2">
                        Harvest Items ({items.length})
                      </h4>
                      {items.length === 0 ? (
                        <p className="text-xs text-[#55695E]">MarketLink Organic Bundle</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item: DisplayOrderItem, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#F8F5EE] last:border-0">
                              <span className="font-semibold text-[#1D3E2E]">
                                {item.quantity || item.qty || 1}x {item.name || item.product?.name || 'Organic Harvest Item'}
                              </span>
                              <span className="font-bold text-[#8B7355]">
                                Rs. {Number(item.price || 500).toLocaleString('en-PK')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Shipping & Delivery Info */}
                    <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-[#EAE3D2] space-y-3 text-xs">
                      <h4 className="font-bold text-[#1D3E2E] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#E06D3B]" /> Shipping Location
                      </h4>
                      <p className="text-[#55695E] leading-relaxed">
                        {order.shipping_address || 'Karachi Central Delivery Route, Sindh'}
                      </p>

                      <div className="pt-2 border-t border-[#E5DEC9] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">Payment Method:</span>
                          <span className="font-bold text-[#1D3E2E] flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" /> COD
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">Estimated Delivery:</span>
                          <span className="font-bold text-[#1D3E2E]">
                            {order.delivery_date || '2026-09-28'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <DbStatusBadge />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setStoredUser(u);
        }}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={() => setIsQuizOpen(false)}
      />
    </div>
  );
}
