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
import {
  User as UserIcon,
  Mail,
  MapPin,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Store,
  CheckCircle2,
  LogIn
} from 'lucide-react';

export default function ProfilePage() {
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const user = useStoredUser();

  const handleLogout = () => {
    clearStoredUser();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-[#E8E2D5] pb-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
            Account & Preferences
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1D3E2E] mt-1">
            My Account Profile
          </h1>
          <p className="text-sm text-[#55695E] mt-1">
            Manage your personal contact info, delivery address, and account status.
          </p>
        </div>

        {!user ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E0D8C8] shadow-sm text-center space-y-4 my-6">
            <UserIcon className="w-16 h-16 text-[#B5A893] mx-auto stroke-1" />
            <h2 className="font-serif text-2xl font-bold text-[#1D3E2E]">Not Logged In</h2>
            <p className="text-sm text-[#55695E] max-w-md mx-auto">
              Please log in to your MarketLink account to view your saved addresses and profile preferences.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1D3E2E] hover:bg-[#E06D3B] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
            >
              <LogIn className="w-4 h-4 text-[#E06D3B]" />
              <span>Log In / Register Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Card Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D8C8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E06D3B] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-[#1D3E2E]">{user.full_name || 'MarketLink Member'}</h2>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-[#8B7355] mt-1 capitalize">Role: <strong>{user.role || 'Customer'} Account</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-full text-xs font-bold transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout Account
                </button>
              </div>
            </div>

            {/* Profile Details Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E0D8C8] shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#1D3E2E] border-b border-[#F0EAE0] pb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E06D3B]" /> Personal Information
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#8B7355] block">Full Name</label>
                    <p className="font-bold text-[#1D3E2E] text-sm mt-0.5">{user.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#8B7355] block">Email Address</label>
                    <p className="font-bold text-[#1D3E2E] text-sm mt-0.5">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#8B7355] block">Subscription Status</label>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Farm Produce Member
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E0D8C8] shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#1D3E2E] border-b border-[#F0EAE0] pb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E06D3B]" /> Default Delivery Address
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#8B7355] block">Street & Location</label>
                    <p className="font-bold text-[#1D3E2E] text-sm mt-0.5">{user.address || 'Clifton, Karachi, Pakistan'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#8B7355] block">ZIP / Postal Code</label>
                    <p className="font-bold text-[#1D3E2E] text-sm mt-0.5">{user.zipcode || '75500'}</p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/orders"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#E06D3B] hover:underline"
                    >
                      <ShoppingBag className="w-4 h-4" /> View Orders for this address &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Switch Shortcut */}
            {user.role === 'admin' && (
              <div className="bg-[#1D3E2E] text-white rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg">Admin Control Center</h4>
                  <p className="text-xs text-[#C4D6CB] mt-0.5">Manage inventory, producers, and customer orders.</p>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-[#E06D3B] hover:bg-[#c85a29] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow"
                >
                  Open Dashboard
                </Link>
              </div>
            )}

            {user.role === 'farmer' && (
              <div className="bg-[#1D3E2E] text-white rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg">Farmer & Vendor Portal</h4>
                  <p className="text-xs text-[#C4D6CB] mt-0.5">Manage crops, stock, and bank payouts.</p>
                </div>
                <Link
                  href="/farmer"
                  className="bg-[#E06D3B] hover:bg-[#c85a29] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow"
                >
                  Open Farmer Portal
                </Link>
              </div>
            )}
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
