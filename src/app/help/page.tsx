'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import type { User } from '@/lib/types';
import {
  HelpCircle,
  ShieldCheck,
  FileText,
  Truck,
  ChevronDown,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function HelpPage() {
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<'help' | 'privacy' | 'terms'>('help');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const faqs = [
    {
      q: 'How does MarketLink guarantee farm-fresh quality?',
      a: 'All produce is harvested daily by verified partner farmers in Punjab and Sindh. Items are packed in temperature-controlled boxes and delivered directly to your doorstep within hours.'
    },
    {
      q: 'What is Cash on Delivery (COD) and how does it work?',
      a: 'We support 100% Cash on Delivery across Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, and Faisalabad. You inspect your fresh produce upon delivery before handing cash to our courier.'
    },
    {
      q: 'What is your return and refund policy for damaged produce?',
      a: 'We provide a 100% Farm-Fresh Guarantee. If any fruit, vegetable, or dairy item arrives damaged, send us a picture on WhatsApp or through our Contact page for an immediate refund or replacement.'
    },
    {
      q: 'How do I cancel or modify an order?',
      a: 'You can modify or cancel your order up to 6 hours before your scheduled delivery window by contacting support at support@marketlink.pk or via our Help Center.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          clearStoredUser();
        }}
        user={user}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Hero */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
            MarketLink Support & Legal Information
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1D3E2E]">
            Help Center & Policies
          </h1>
          <p className="text-sm sm:text-base text-[#55695E] max-w-xl mx-auto">
            Everything you need to know about delivery policies, privacy, and farm-to-table guarantees.
          </p>

          {/* Policy Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('help')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'help'
                  ? 'bg-[#1D3E2E] text-white shadow-md'
                  : 'bg-white border border-[#E0D8C8] text-[#1D3E2E] hover:border-[#E06D3B]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 inline mr-1.5 text-[#E06D3B]" /> Help Center & FAQs
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#1D3E2E] text-white shadow-md'
                  : 'bg-white border border-[#E0D8C8] text-[#1D3E2E] hover:border-[#E06D3B]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 text-[#E06D3B]" /> Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'terms'
                  ? 'bg-[#1D3E2E] text-white shadow-md'
                  : 'bg-white border border-[#E0D8C8] text-[#1D3E2E] hover:border-[#E06D3B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1.5 text-[#E06D3B]" /> Terms of Service
            </button>
          </div>
        </div>

        {/* TAB 1: HELP CENTER & FAQS */}
        {activeTab === 'help' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DEC9] shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#E06D3B]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1D3E2E]">Frequently Asked Questions</h2>
                  <p className="text-xs text-[#55695E]">Quick solutions for delivery, payment, and freshness</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#E0D8C8] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-[#1D3E2E] bg-[#F4EFE6]/50 hover:bg-[#F4EFE6]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#E06D3B] shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-5 text-xs sm:text-sm text-[#55695E] leading-relaxed border-t border-[#E0D8C8] bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Need More Assistance Banner */}
            <div className="bg-[#1D3E2E] text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <h3 className="font-serif font-bold text-2xl">Still need assistance?</h3>
                <p className="text-xs text-[#C4D6CB] mt-1">Our support team is active 7 days a week from 8:00 AM to 10:00 PM PKT.</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#E06D3B] hover:bg-[#c85a29] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shrink-0"
              >
                <span>Contact Customer Support</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DEC9] shadow-sm space-y-6 text-sm text-[#55695E] leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-[#1D3E2E] border-b border-[#F0EAE0] pb-4">
              Privacy Policy
            </h2>
            <p>
              At MarketLink Pakistan, we respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we handle your personal information when you visit our marketplace platform.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">1. Information We Collect</h3>
            <p>
              We collect information provided directly by you during account creation and order processing, including your full name, email address, delivery street address, city, and phone number.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">2. How We Use Your Data</h3>
            <p>
              Your data is exclusively used to process Cash on Delivery (COD) orders, route farm fresh produce to your local address, communicate delivery timestamps, and improve our partner farm logistics.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">3. Data Security</h3>
            <p>
              We enforce strict encryption protocols and database security parameters to safeguard your personal credentials. We never sell or share customer contact information with third-party marketing agencies.
            </p>
          </div>
        )}

        {/* TAB 3: TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DEC9] shadow-sm space-y-6 text-sm text-[#55695E] leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-[#1D3E2E] border-b border-[#F0EAE0] pb-4">
              Terms of Service
            </h2>
            <p>
              Welcome to MarketLink Pakistan. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions of service.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">1. Cash on Delivery (COD) Agreement</h3>
            <p>
              By placing an order via MarketLink, you agree to receive the order at the specified delivery location and pay the total order amount upon arrival.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">2. Farm-Fresh Produce Availability</h3>
            <p>
              Because our fruits and vegetables are harvested fresh from local Pakistani farms, availability may vary based on weather conditions and crop seasonality. In case of harvest unavailability, we notify you promptly.
            </p>

            <h3 className="font-bold text-base text-[#1D3E2E] pt-2">3. Quality Guarantee</h3>
            <p>
              We guarantee 100% farm-fresh quality. If any item fails to meet freshness standards upon delivery inspection, customers are entitled to an immediate replacement or store credit.
            </p>
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

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={() => setIsQuizOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setStoredUser(u);
        }}
      />
    </div>
  );
}
