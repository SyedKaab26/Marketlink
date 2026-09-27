'use client';

import React, { useEffect, useState } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import AboutUsSection from '@/components/ui/about-us-section';
import { ScrollingFeatureShowcase } from '@/components/ui/interactive-scrolling-story-component';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import { User } from '@/lib/types';
import { Leaf, ShieldCheck, HeartHandshake, Truck, Sprout } from 'lucide-react';

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
        <section className="relative text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#29523D] bg-cover bg-center bg-no-repeat bg-[url('/images/about-hero-bg.jpg')]">
          {/* Gradient Overlay & Darkening for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1D3E2E]/85 via-[#12281D]/80 to-[#1D3E2E]/90 backdrop-blur-[1px]" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E06D3B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A523E]/80 border border-[#488263]/50 text-[#E06D3B] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg">
              <Leaf className="w-3.5 h-3.5 text-[#E06D3B]" /> Our Mission & Journey
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F9F6F0] leading-tight drop-shadow-md">
              Connecting Pakistan’s Local Farms Directly To Your Table
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#DDF0E6] max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-medium">
              At MarketLink, we believe fresh, organic food should be accessible to every family while empowering independent local growers who nourish our nation.
            </p>
          </div>
        </section>

        {/* MAIN ABOUT US INTERACTIVE COMPONENT */}
        <AboutUsSection />

        {/* INTERACTIVE SCROLLING STORY SHOWCASE */}
        <section className="w-full border-b border-[#29523D]">
          <ScrollingFeatureShowcase />
        </section>

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
