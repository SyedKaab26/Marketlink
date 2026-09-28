'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import ContactWithGlobe from '@/components/ui/contact-with-globe';
import { clearStoredUser, setStoredUser, useStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import {
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export default function ContactPage() {
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const user = useStoredUser();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#faq' || window.location.hash === '#faqs')) {
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, []);

  const contactFaqs = [
    {
      q: 'How fast will MarketLink support respond to my inquiry?',
      a: 'Our customer care team operates 7 days a week. We typically respond within 2 to 4 hours via WhatsApp or email during business hours (8:00 AM - 10:00 PM PKT).'
    },
    {
      q: 'How can a local Pakistani farmer join the MarketLink network?',
      a: 'Farmers can select "Farmer Partnership / Onboarding" in the contact form or register directly via our Farmer Portal (/farmer). Our regional sourcing representative will visit your farm for quality verification within 48 hours.'
    },
    {
      q: 'What should I do if my delivered produce has a quality issue?',
      a: 'We offer a 100% Farm-Fresh Guarantee! If any item arrives damaged or un-fresh, submit a message here with your Order ID or chat with us directly on WhatsApp (+92 300 1234567). We will issue an instant replacement or refund on your next delivery.'
    },
    {
      q: 'Do you offer bulk supply for restaurants, hotels, or corporate events?',
      a: 'Yes! We supply fresh organic vegetables, fruits, and dairy in wholesale quantities directly from certified local farms across Punjab and Sindh. Select "Bulk & Wholesale Order" in the form above for custom pricing.'
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
          clearStoredUser();
        }}
        user={user}
      />

      <main className="flex-1 pb-20">
        
        {/* REDESIGNED CONTACT WITH GLOBE HERO SECTION */}
        <ContactWithGlobe
          title="Get In Touch With MarketLink"
          subtitle="Pakistan's Farm-to-Table Support"
          description="Connecting local growers in Punjab & Sindh directly with your household. Send us a message or reach out through our 24/7 support channels."
          userDefaultName={user?.full_name || ''}
          userDefaultEmail={user?.email || ''}
        />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DEC9] shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#E06D3B]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1D3E2E]">
                  Contact & Support FAQs
                </h2>
                <p className="text-xs text-[#55695E]">
                  Quick answers to common contact and service questions
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {contactFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#E0D8C8] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm sm:text-base text-[#1D3E2E] bg-[#F4EFE6]/50 hover:bg-[#F4EFE6]"
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
        </section>

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
          setStoredUser(u);
        }}
      />
    </div>
  );
}
