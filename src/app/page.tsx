'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizModal from '@/components/QuizModal';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import DbStatusBadge from '@/components/DbStatusBadge';
import HeroVideoCarousel from '@/components/HeroVideoCarousel';
import TimelineBlock01 from '@/components/ui/timeline-01';
import GlyphPortalDemo from '@/components/ui/glyph-portal-demo';
import RoutineResetBundleSection from '@/components/RoutineResetBundleSection';
import { ProductDropCard, type DropItem } from '@/components/ui/product-drop-card';
import Testimonials from '@/components/ui/testimonials-demo';
import CertifiedFarmersSection from '@/components/CertifiedFarmersSection';
import FarmVideoCarousel from '@/components/FarmVideoCarousel';
import { CartItem, Product, QuizResponse, User } from '@/lib/types';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, addToCart as addProductToCart, updateCartQuantity, clearCart } from '@/lib/cart';
import {
  Apple,
  Carrot,
  Star,
  MapPin,
  Milk,
  Navigation,
  Sprout,
  Wheat,
} from 'lucide-react';

export default function AboutPage() {
  const { cartItems, totalCartCount } = useCart();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  const marketLocations = [
    {
      id: 'karachi',
      name: 'Karachi Coast Market',
      city: 'Karachi, Sindh',
      lat: 24.8607,
      lng: 67.0011,
      rating: 4.9,
      distance: '28 partner farms',
      stalls: 'Fresh seafood, fruit & vegetables',
      open: 'Delivery hub: Clifton',
      pickup: 'Serving Karachi and nearby coastal towns',
    },
    {
      id: 'lahore',
      name: 'Lahore Harvest Exchange',
      city: 'Lahore, Punjab',
      lat: 31.5204,
      lng: 74.3587,
      rating: 4.8,
      distance: '42 partner farms',
      stalls: 'Seasonal produce & dairy',
      open: 'Delivery hub: Model Town',
      pickup: 'Serving Lahore and surrounding Punjab farms',
    },
    {
      id: 'islamabad',
      name: 'Capital Green Market',
      city: 'Islamabad, ICT',
      lat: 33.6844,
      lng: 73.0479,
      rating: 4.7,
      distance: '24 partner farms',
      stalls: 'Organic produce & pantry staples',
      open: 'Delivery hub: F-6',
      pickup: 'Serving Islamabad, Rawalpindi and the Potohar region',
    },
    {
      id: 'peshawar',
      name: 'Peshawar Valley Collective',
      city: 'Peshawar, Khyber Pakhtunkhwa',
      lat: 34.0151,
      lng: 71.5249,
      rating: 4.8,
      distance: '19 partner farms',
      stalls: 'Citrus, herbs & traditional foods',
      open: 'Delivery hub: University Town',
      pickup: 'Serving Peshawar and the wider valley',
    },
    {
      id: 'quetta',
      name: 'Balochistan Orchard Market',
      city: 'Quetta, Balochistan',
      lat: 30.1575,
      lng: 66.996,
      rating: 4.9,
      distance: '16 partner farms',
      stalls: 'Stone fruit, dates & mountain honey',
      open: 'Delivery hub: Jinnah Road',
      pickup: 'Serving Quetta and orchard communities',
    },
    {
      id: 'multan',
      name: 'Southern Punjab Farm Link',
      city: 'Multan, Punjab',
      lat: 30.1575,
      lng: 71.5249,
      rating: 4.8,
      distance: '21 partner farms',
      stalls: 'Mangoes, grains & vegetables',
      open: 'Delivery hub: Gulgasht Colony',
      pickup: 'Serving Multan, Bahawalpur and nearby districts',
    },
  ];
  const focusedMarket = marketLocations.find((market) => market.id === selectedMarket);
  const weeklyHarvest: DropItem[] = [
    {
      time: 'HARVESTED TODAY',
      name: 'Sindh Mangoes',
      collection: 'Sun-ripened in Mirpurkhas orchards',
      imageSrc: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=80',
      price: 650,
      unit: '1 kg',
    },
    {
      time: 'IN SEASON',
      name: 'Punjab Kinnow',
      collection: 'Picked fresh from Sargodha farms',
      imageSrc: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
      price: 350,
      unit: '1 kg',
    },
    {
      time: 'SMALL-BATCH PICK',
      name: 'Hunza Almonds',
      collection: 'Grown in the northern valleys',
      imageSrc: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=1000&q=80',
      price: 1250,
      unit: '500 g',
    },
    {
      time: 'FARM FAVORITE',
      name: 'Raw Wildflower Honey',
      collection: 'Collected from Potohar beekeepers',
      imageSrc: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1000&q=80',
      price: 1100,
      unit: '500 g',
    },
    {
      time: 'IN SEASON',
      name: 'Seasonal Strawberries',
      collection: 'Sweet, freshly picked local berries',
      imageSrc: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80',
      price: 850,
      unit: '500 g',
    },
    {
      time: 'FRESH FROM THE FARM',
      name: 'Fresh Spinach',
      collection: 'Tender greens from nearby growers',
      imageSrc: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80',
      price: 180,
      unit: '1 bunch',
    },
    {
      time: 'FARM FAVORITE',
      name: 'Farm-Fresh Eggs',
      collection: 'A dozen everyday essentials',
      imageSrc: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80',
      price: 720,
      unit: '12 eggs',
    },
    {
      time: 'JUST HARVESTED',
      name: 'Cherry Tomatoes',
      collection: 'Juicy tomatoes picked at peak ripeness',
      imageSrc: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1000&q=80',
      price: 450,
      unit: '500 g',
    },
  ];

  const handleDropAddToCart = (item: DropItem) => {
    const product: Product = {
      id: item.id || Math.floor(Math.random() * 10000) + 100,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: item.price,
      unit: item.unit,
      category_id: 1,
      producer_id: 1,
      image_url: item.imageSrc,
      dietary_tags: 'Fresh',
      description: item.collection,
      featured: true,
      in_stock: true,
    };
    addProductToCart(product, 1);
    setIsCartOpen(true);
  };

  const handleQuizComplete = (quizData: QuizResponse) => {
    alert(`MarketLink cart initialized for ZIP ${quizData.zipcode}! Redirecting to product selection...`);
    window.location.href = '/shop';
  };
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const locations = marketLocations;
      const selectedLocation = locations.find((market) => market.id === selectedMarket);
      const L = (await import('leaflet')).default;
      if (!mapRef.current || !isMounted) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
      }).setView(
        selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [30.8, 69.3],
        selectedLocation ? 11 : 5.5
      );

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap keeps the map usable without requiring an environment key.
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      requestAnimationFrame(() => {
        map.invalidateSize();
        setTimeout(() => map.invalidateSize(), 150);
      });

      const visibleMarkets = selectedLocation ? [selectedLocation] : locations;

      visibleMarkets.forEach((market) => {
        const marker = L.marker([market.lat, market.lng], {
          icon: L.divIcon({
            className: 'market-pin-wrapper',
            html: `
              <div class="market-pin ${market.id === selectedMarket ? 'active' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s-6.5-5.2-9-9.1C1.5 9.6 3.3 5 8.2 5c2.3 0 3.7 1.1 3.8 2.7C12.1 6.1 13.5 5 15.8 5c4.9 0 6.7 4.6 5.2 6.9-2.5 3.9-9 9.1-9 9.1z" />
                </svg>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          }),
        });

        marker.addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 180px;">
            <strong style="display:block; font-size: 13px; margin-bottom: 4px; color: #0f172a;">${market.name}</strong>
            <span style="display:block; font-size: 11px; color: #475569; margin-bottom: 6px;">${market.pickup}</span>
            <span style="display:inline-flex; align-items:center; gap:4px; font-size: 11px; color: #15803d; background: #dcfce7; padding: 4px 8px; border-radius: 999px;">${market.open}</span>
          </div>
        `);

        if (market.id === selectedMarket) {
          marker.openPopup();
        }

        marker.on('click', () => {
          setSelectedMarket(market.id);
        });
      });

      if (selectedLocation) {
        map.setView([selectedLocation.lat, selectedLocation.lng], 11);
      } else {
        const bounds = L.latLngBounds(locations.map((market) => [market.lat, market.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [28, 28] });
      }
      mapInstanceRef.current = map;
    };

    void initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedMarket]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#E06D3B] selection:text-white">
      

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

        {/* 1. HERO VIDEO CAROUSEL SECTION */}
        <HeroVideoCarousel onOpenQuiz={() => setIsQuizOpen(true)} />

        {/* 2. PRESS STRIP */}
        <section className="bg-[#1D3E2E] text-white py-6 border-y border-[#29523D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#E06D3B]">
              Local food made easier
            </span>
            <div className="w-full md:flex-1 overflow-hidden">
              <div className="ticker-track flex w-max items-center font-serif text-sm sm:text-base font-bold text-[#C4D6CB] tracking-widest opacity-90">
                <div className="flex shrink-0 items-center gap-8 md:gap-12 px-4 md:px-8">
                  <span className="hover:text-white transition-colors">KARACHI</span>
                  <span className="hover:text-white transition-colors">LAHORE</span>
                  <span className="hover:text-white transition-colors">ISLAMABAD</span>
                  <span className="hover:text-white transition-colors">HYDERABAD</span>
                  <span className="hover:text-white transition-colors">QUETTA</span>
                  <span className="hover:text-white transition-colors">PESHAWAR</span>
                  <span className="hover:text-white transition-colors">SUKKUR</span>
                  <span className="hover:text-white transition-colors">LARKANA</span>
                  <span className="hover:text-white transition-colors">RAHIM YAR KHAN</span>
                </div>
                <div aria-hidden="true" className="flex shrink-0 items-center gap-8 md:gap-12 px-4 md:px-8">
                  <span>KARACHI</span>
                  <span>LAHORE</span>
                  <span>ISLAMABAD</span>
                  <span>HYDERABAD</span>
                  <span>QUETTA</span>
                  <span>PESHAWAR</span>
                  <span>SUKKUR</span>
                  <span>LARKANA</span>
                  <span>RAHIM YAR KHAN</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ROUTINE RESET BUNDLE SECTION */}
        <RoutineResetBundleSection onOpenQuiz={() => setIsQuizOpen(true)} />

        {/* 4. OUR STORY TIMELINE */}
        <TimelineBlock01 />

        {/* GLYPH PORTAL DEMO */}
        <GlyphPortalDemo />

        {/* 5. THIS WEEK'S HARVEST */}
        <ProductDropCard
          title="This week's farm picks"
          subtitle="Fresh harvests from growers and makers across Pakistan."
          items={weeklyHarvest}
          onAddToCart={handleDropAddToCart}
        />

        {/* 6. CERTIFIED FARMERS & CERTIFICATIONS AUTO-SCROLL SECTION */}
        <CertifiedFarmersSection />

        {/* 6.5 FARM VIDEO STORIES REELS CAROUSEL */}
        <FarmVideoCarousel />

        {/* 7. MARKETS ACROSS PAKISTAN */}
        <section id="markets" className="scroll-mt-[76px] py-20 bg-[#F9F6F0] border-b border-[#E8E2D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-stretch">
              <div className="flex flex-col">
                <div className="space-y-3 mb-7">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
                    Freshness, wherever you are
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1D3E2E] font-bold">
                    Find a MarketLink hub across Pakistan.
                  </h2>
                  <p className="text-sm sm:text-base text-[#55695E] max-w-xl leading-relaxed">
                    Meet the farms, makers, and regional food communities bringing local goodness closer to your doorstep.
                  </p>
                </div>

                <div className="space-y-2" role="list" aria-label="Market locations">
                  {marketLocations.map((market) => {
                    const isSelected = market.id === selectedMarket;

                    return (
                      <button
                        key={market.id}
                        type="button"
                        onClick={() => setSelectedMarket(market.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#1D3E2E] border-[#1D3E2E] text-white shadow-lg'
                            : 'bg-white border-[#E0D8C8] text-[#1D3E2E] hover:border-[#E06D3B] hover:shadow-md'
                        }`}
                        role="listitem"
                      >
                        <span className={`mt-0.5 shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#E06D3B] text-white' : 'bg-[#F4EFE6] text-[#E06D3B]'}`}>
                          <MapPin className="w-4 h-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                            <span className="font-bold text-sm">{market.name}</span>
                            <span className={`text-[11px] font-bold ${isSelected ? 'text-[#F7B08F]' : 'text-[#8B7355]'}`}>
                              {market.distance}
                            </span>
                          </span>
                          <span className={`block text-xs mt-1 ${isSelected ? 'text-[#C4D6CB]' : 'text-[#55695E]'}`}>
                            {market.city} · {market.stalls}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-[460px] lg:min-h-[600px] rounded-3xl overflow-hidden border border-[#E0D8C8] shadow-xl bg-[#E8E2D5] relative">
                <div
                  ref={mapRef}
                  className="absolute inset-0"
                  aria-label={focusedMarket ? `Map of ${focusedMarket.city} market hub` : 'Map of MarketLink markets across Pakistan'}
                />
                <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E0D8C8] shadow-md px-4 py-3 max-w-[230px]">
                  <div className="flex items-center gap-2 text-[#1D3E2E]">
                    <Navigation className="w-4 h-4 text-[#E06D3B]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      {focusedMarket ? `${focusedMarket.city} market hub` : 'Pakistan network'}
                    </span>
                  </div>
                  <p className="text-xs text-[#55695E] mt-1">
                    {focusedMarket
                      ? `${focusedMarket.distance} · ${focusedMarket.stalls}`
                      : 'Tap a city to explore its local market hub.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS SECTION */}
        <Testimonials />

      </main>

      {/* Footer */}
      <Footer />

      {/* Database Live Status Indicator */}
      <DbStatusBadge />

      {/* Interactive Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={handleQuizComplete}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setStoredUser(userData);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

    </div>
  );
}
