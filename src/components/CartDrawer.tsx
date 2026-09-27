'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Truck, CheckCircle2, Loader2, Sparkles, Banknote, ShieldCheck, ArrowRight, Lock, LogIn, AlertCircle, MapPin } from 'lucide-react';
import { CartItem, User } from '@/lib/types';
import { getStoredUser } from '@/lib/auth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number | string, delta: number) => void;
  onClearCart: () => void;
  onOpenAuth?: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onClearCart, onOpenAuth }: CartDrawerProps) {
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deliveryCity, setDeliveryCity] = useState('Karachi');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const user = getStoredUser();
      setCurrentUser(user);
      if (user?.address) {
        setDeliveryAddress(user.address);
      }
      setAuthError(null);
      setLocationError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    const user = getStoredUser() || currentUser;
    if (!user) {
      setAuthError('Account login is required to place an order. Please log in first.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setLocationError(true);
      setAuthError('Delivery location & complete street address is required.');
      return;
    }

    setOrdering(true);
    setAuthError(null);
    setLocationError(false);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, qty: i.quantity })),
          total,
          payment_method: 'Cash on Delivery',
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user_id: user.id,
          shipping_address: `${deliveryAddress.trim()}, ${deliveryCity}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderSuccess(`Order #${data.orderId || 'MK-8842'} Confirmed via Cash on Delivery! Delivery to: ${deliveryAddress.trim()}, ${deliveryCity}. Total Rs. ${total.toLocaleString('en-PK')} to be paid upon arrival.`);
        onClearCart();
      } else {
        setAuthError(data.error || 'Failed to place order. Please check your login.');
      }
    } catch (e) {
      console.error(e);
      setAuthError('An error occurred while placing your order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1200] overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-screen max-w-md bg-[#F9F6F0] shadow-2xl flex flex-col border-l border-[#E8E2D5]">
          
          {/* Header */}
          <div className="p-6 bg-[#1D3E2E] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E06D3B]" />
              <h2 className="font-serif text-xl font-bold">Your MarketLink Cart</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              title="Close cart"
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-[#2A523E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="bg-[#EAE3D2] px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#1D3E2E] border-b border-[#DFD6C2]">
            <Truck className="w-4 h-4 text-[#E06D3B]" />
            <span>Neighborhood Delivery: Fresh from local Pakistan farms</span>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3 my-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">Order Placed Successfully!</h3>
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Payment Method: Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">{orderSuccess}</p>
                </div>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="bg-[#1D3E2E] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow hover:bg-[#142D21] transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-4 text-[#6A7B71]">
                <ShoppingBag className="w-16 h-16 mx-auto stroke-1 text-[#B5A893]" />
                <p className="font-serif text-lg font-bold text-[#1D3E2E]">Your cart is empty</p>
                <p className="text-xs">Add fresh farm produce, fruits, vegetables, honey & dairy to your cart.</p>
                <button
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-2 bg-[#E06D3B] hover:bg-[#c85a29] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md"
                >
                  <span>Browse Products & Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#E5DEC9] shadow-sm"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-16 h-16 object-cover rounded-xl border border-[#F0EAE0]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1D3E2E] truncate">{product.name}</h4>
                    <p className="text-xs text-[#8B7355] truncate">{product.producer_name || 'Local Producer'}</p>
                    <p className="font-bold text-sm text-[#E06D3B] mt-1">
                      Rs. {(product.price * quantity).toLocaleString('en-PK')}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-[#F4EFE6] rounded-xl p-1 border border-[#E3DAC8]">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#1D3E2E] hover:bg-[#E06D3B] hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-[#1D3E2E]">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#1D3E2E] hover:bg-[#E06D3B] hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && !orderSuccess && (
            <div className="p-6 bg-white border-t border-[#E8E2D5] space-y-4 shadow-lg">
              
              {/* Account / Login Requirement Banner */}
              {!currentUser ? (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Account Login Required</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    You must be logged in to your account to place an order. Please log in or register.
                  </p>
                  {onOpenAuth && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="w-full bg-[#1D3E2E] hover:bg-[#142D21] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-1"
                    >
                      <LogIn className="w-4 h-4 text-[#E06D3B]" />
                      Log In / Register Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Payment Method Notice */}
                  <div className="p-3 bg-[#F0F7F3] border border-[#C6E4D3] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#1D3E2E] flex items-center justify-center text-white shrink-0">
                        <Banknote className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#1D3E2E]">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-[#426853]">Logged in as <span className="font-bold text-[#1D3E2E]">{currentUser.full_name || currentUser.email}</span></p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>

                  {/* Delivery Location Section (Required) */}
                  <div className="p-3.5 bg-[#F9F6F0] border border-[#E5DEC9] rounded-2xl space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#1D3E2E] font-bold text-xs">
                        <MapPin className="w-4 h-4 text-[#E06D3B] shrink-0" />
                        <span>Delivery Location</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#E06D3B] bg-[#FFF0E8] px-2 py-0.5 rounded-full uppercase tracking-wider">Required *</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-[#8B7355] uppercase mb-1">City *</label>
                        <select
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl bg-white border border-[#D5CCBA] text-[#1D3E2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
                        >
                          <option value="Karachi">Karachi</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="Rawalpindi">Rawalpindi</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Quetta">Quetta</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Multan">Multan</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#8B7355] uppercase mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => {
                            setDeliveryAddress(e.target.value);
                            if (e.target.value.trim()) setLocationError(false);
                          }}
                          placeholder="House #, Street, Area"
                          className={`w-full text-xs p-2 rounded-xl bg-white border text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B] ${
                            locationError ? 'border-red-500 ring-2 ring-red-200' : 'border-[#D5CCBA]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-800 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#5B6F64]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1D3E2E]">Rs. {subtotal.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#1D3E2E]">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                {subtotal <= 1500 && (
                  <p className="text-[11px] text-[#E06D3B] italic">
                    Add Rs. {(1500 - subtotal).toLocaleString('en-PK')} more for FREE delivery!
                  </p>
                )}
                <div className="flex justify-between text-base font-bold text-[#1D3E2E] pt-2 border-t border-[#EFEBE1]">
                  <span>Total</span>
                  <span className="text-[#E06D3B]">Rs. {total.toLocaleString('en-PK')}</span>
                </div>
              </div>

              {!currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuth) {
                      onClose();
                      onOpenAuth();
                    } else {
                      setAuthError('Please log in to your account first.');
                    }
                  }}
                  className="w-full bg-[#1D3E2E] hover:bg-[#142D21] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4 text-[#E06D3B]" />
                  Log In to Place Order
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={ordering}
                  className="w-full bg-[#E06D3B] hover:bg-[#C85A29] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  {ordering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Placing Order...
                    </>
                  ) : (
                    <>
                      Confirm COD Order (Rs. {total.toLocaleString('en-PK')}) <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
