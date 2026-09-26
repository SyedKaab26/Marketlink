'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import DbStatusBadge from '@/components/DbStatusBadge';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, updateCartQuantity, clearCart } from '@/lib/cart';
import { Producer, User } from '@/lib/types';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const { cartItems, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    fetch('/api/producers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducers(data.producers);
      })
      .catch(console.error);
  }, []);

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

      <main className="flex-1">
        {/* Header Hero */}
        <section className="py-16 bg-[#F4EFE6] border-b border-[#E5DEC9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
              Know who made your food
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1D3E2E]">
              Meet Our Local Farmers & Makers
            </h1>
            <p className="text-base sm:text-lg text-[#55695E] max-w-2xl mx-auto">
              MarketLink brings independent family farms and food producers across Pakistan closer to your table.
            </p>
          </div>
        </section>

        {/* Producers Showcase */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {producers.map((producer) => (
                <div
                  key={producer.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E0D8C8] shadow-sm hover:shadow-xl transition-all flex flex-col group"
                >
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={producer.image_url}
                      alt={producer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1D3E2E]/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#E06D3B]" /> {producer.location}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E06D3B]">
                        {producer.specialty}
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-[#1D3E2E] mt-1 group-hover:text-[#E06D3B] transition-colors">
                        {producer.name}
                      </h3>
                      <p className="text-sm text-[#55695E] leading-relaxed mt-2">
                        {producer.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F0EAE0] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#8B7355] flex items-center gap-1">
                        <Heart className="w-4 h-4 text-[#E06D3B] fill-current" /> Verified Local Supplier
                      </span>
                      <Link
                        href={`/shop?search=${encodeURIComponent(producer.name)}`}
                        className="text-xs font-bold text-[#1D3E2E] hover:text-[#E06D3B] flex items-center gap-1 transition-colors"
                      >
                        Shop Products <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
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
          setUser(u);
          setStoredUser(u);
        }}
      />
    </div>
  );
}
