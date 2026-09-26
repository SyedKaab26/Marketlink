'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import AboutUsSection from '@/components/ui/about-us-section';
import TimelineBlock01 from '@/components/ui/timeline-01';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import { User } from '@/lib/types';
import { Leaf, ShieldCheck, HeartHandshake, Truck, ArrowRight, Sprout } from 'lucide-react';

export default function AboutPage() {
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const coreValues = [
    {
      icon: <Sprout className="w-6 h-6 text-[#E06D3B]" />,
      title: 'Direct Farm Sourcing',
      description: 'We cut out unnecessary middleman markups to ensure local Pakistani farmers receive fair pay for their hard work.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E06D3B]" />,
      title: 'Uncompromised Freshness',
      description: 'Produce harvested at peak ripeness and delivered within hours, keeping essential nutrients and flavors intact.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#E06D3B]" />,
      title: 'Community Empowerment',
      description: 'Supporting over 170+ local growers across Sindh, Punjab, and KPK to foster sustainable agricultural communities.',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#E06D3B]" />,
      title: 'Eco-Friendly Logistics',
      description: 'Optimized delivery hubs in major cities like Karachi, Lahore, and Islamabad to minimize food miles and emissions.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1">

        {/* HERO BANNER SECTION */}
        <section className="relative bg-[#1D3E2E] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#29523D]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E06D3B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A523E] border border-[#37664E] text-[#E06D3B] text-xs font-bold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5" /> Our Mission & Journey
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#F9F6F0] leading-tight">
              Connecting Pakistan’s Local Farms Directly To Your Table
            </h1>
            <p className="text-base sm:text-lg text-[#C4D6CB] max-w-3xl mx-auto leading-relaxed">
              At MarketLink, we believe fresh, organic food should be accessible to every family while empowering independent local growers who nourish our nation.
            </p>
          </div>
        </section>

        {/* MAIN ABOUT US INTERACTIVE COMPONENT */}
        <AboutUsSection />

        {/* OUR CORE VALUES */}
        <section className="py-20 bg-[#F4EFE6] border-y border-[#E5DEC9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
                What Drives Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1D3E2E] font-bold">
                Our Core Principles
              </h2>
              <p className="text-sm sm:text-base text-[#55695E]">
                Building a transparent, sustainable, and reliable food network for Pakistan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-[#E0D8C8] shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFF0E8] flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#1D3E2E]">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-[#55695E] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR STORY TIMELINE */}
        <TimelineBlock01 />

        {/* CTA BANNER */}
        <section className="py-16 bg-[#1D3E2E] text-white text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to taste the farm-fresh difference?
            </h2>
            <p className="text-sm sm:text-base text-[#C4D6CB]">
              Explore hundreds of handpicked fruits, vegetables, and artisan staples from local Pakistani farms.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#E06D3B] hover:bg-[#c95b2a] text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105"
              >
                Browse Shop Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/producers"
                className="inline-flex items-center gap-2 bg-[#2A523E] hover:bg-[#34624b] text-white border border-[#37664E] px-7 py-3.5 rounded-full font-bold text-sm transition-all"
              >
                Meet Our Farmers
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* DB Status Badge */}
      <DbStatusBadge />

      {/* Modals */}
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
