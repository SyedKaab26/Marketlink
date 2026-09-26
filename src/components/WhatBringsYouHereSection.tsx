'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Flame, Plus, Check } from 'lucide-react';

export interface BestSellerCard {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  imageSrc: string;
  rating: number;
  link: string;
}

const BEST_SELLING_CARDS: BestSellerCard[] = [
  {
    id: 'sindh-mangoes',
    title: 'SINDH\nMANGOES',
    subtitle: 'Sun-ripened in Mirpurkhas orchards',
    price: 'Rs. 650 / kg',
    tag: 'BEST SELLER #1',
    rating: 4.9,
    imageSrc: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=mangoes',
  },
  {
    id: 'organic-tomatoes',
    title: 'ORGANIC\nTOMATOES',
    subtitle: 'Vine-ripened, chemical-free',
    price: 'Rs. 220 / kg',
    tag: 'TOP RATED',
    rating: 4.8,
    imageSrc: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=tomatoes',
  },
  {
    id: 'hunza-almonds',
    title: 'HUNZA\nALMONDS',
    subtitle: 'Nutrient-dense northern valley nuts',
    price: 'Rs. 1,250 / 500g',
    tag: 'PREMIUM PICK',
    rating: 5.0,
    imageSrc: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=almonds',
  },
  {
    id: 'pure-desi-ghee',
    title: 'PURE DESI\nGHEE',
    subtitle: 'Hand-churned grass-fed butter',
    price: 'Rs. 1,850 / kg',
    tag: 'FARM FAVORITE',
    rating: 4.9,
    imageSrc: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=ghee',
  },
  {
    id: 'wildflower-honey',
    title: 'WILDFLOWER\nHONEY',
    subtitle: 'Raw, unpasteurized Potohar honey',
    price: 'Rs. 1,100 / 500g',
    tag: '100% PURE',
    rating: 4.9,
    imageSrc: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=honey',
  },
  {
    id: 'sargodha-kinnow',
    title: 'SARGODHA\nKINNOW',
    subtitle: 'Juicy, Vitamin-C rich citrus',
    price: 'Rs. 350 / kg',
    tag: 'IN SEASON',
    rating: 4.8,
    imageSrc: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=kinnow',
  },
  {
    id: 'farm-fresh-eggs',
    title: 'FARM FRESH\nEGGS',
    subtitle: 'Free-range organic golden yolks',
    price: 'Rs. 360 / dozen',
    tag: 'DAILY FRESH',
    rating: 4.9,
    imageSrc: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=eggs',
  },
  {
    id: 'organic-strawberries',
    title: 'ORGANIC\nSTRAWBERRIES',
    subtitle: 'Sweet Swat Valley handpicked berries',
    price: 'Rs. 450 / 500g',
    tag: 'LIMITED STOCK',
    rating: 4.7,
    imageSrc: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=strawberries',
  },
  {
    id: 'basmati-rice',
    title: 'UNPOLISHED\nBASMATI',
    subtitle: 'Aromatic long-grain aged rice',
    price: 'Rs. 480 / kg',
    tag: 'ORGANIC GRAIN',
    rating: 4.8,
    imageSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=rice',
  },
  {
    id: 'tender-spinach',
    title: 'TENDER\nSPINACH',
    subtitle: 'Crisp, pesticide-free leafy greens',
    price: 'Rs. 120 / bunch',
    tag: 'HARVESTED TODAY',
    rating: 4.7,
    imageSrc: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    link: '/shop?search=spinach',
  },
];

interface BestSellingProductsSectionProps {
  cards?: BestSellerCard[];
  title?: string;
  subtitle?: string;
  onAddToCart?: (card: BestSellerCard) => void;
}

export default function WhatBringsYouHereSection({
  cards = BEST_SELLING_CARDS,
  title = 'OUR BEST SELLING PRODUCTS',
  subtitle = 'Handpicked customer favorites fresh from Pakistan’s top partner farms',
  onAddToCart,
}: BestSellingProductsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [addedCardId, setAddedCardId] = useState<string | null>(null);

  // Duplicate cards array to create seamless 360 continuous scrolling loop
  const duplicatedCards = [...cards, ...cards];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCartClick = (e: React.MouseEvent, item: BestSellerCard, uniqueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedCardId(uniqueId);
    if (onAddToCart) {
      onAddToCart(item);
    }
    setTimeout(() => {
      setAddedCardId(null);
    }, 1500);
  };

  return (
    <section className="w-full bg-[#FAF5EF] py-14 sm:py-20 border-b border-[#E8E2D5] overflow-hidden relative">
      <style>{`
        @keyframes continuousScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-marquee-track {
          display: flex;
          width: max-content;
          animation: continuousScroll 42s linear infinite;
        }

        .scroll-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Section Header */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E06D3B]/10 border border-[#E06D3B]/25 text-[#E06D3B] text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-[#E06D3B]" /> Most Loved By Customers
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-wider uppercase">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#55695E] mt-1 font-sans">
            {subtitle}
          </p>
        </div>

        {/* Manual Scroll Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full bg-white border border-[#E0D8C8] text-[#111111] flex items-center justify-center shadow-sm hover:bg-[#E06D3B] hover:text-white hover:border-[#E06D3B] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full bg-white border border-[#E0D8C8] text-[#111111] flex items-center justify-center shadow-sm hover:bg-[#E06D3B] hover:text-white hover:border-[#E06D3B] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Marquee Carousel Container with Gradient Side Fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left Side Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF5EF] to-transparent z-20" />
        
        {/* Right Side Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF5EF] to-transparent z-20" />

        {/* Scrolling Track Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none py-2 px-4"
        >
          <div className="scroll-marquee-track gap-4 sm:gap-6">
            {duplicatedCards.map((item, idx) => {
              const uniqueId = `${item.id}-${idx}`;
              const isAdded = addedCardId === uniqueId;

              return (
                <Link
                  key={uniqueId}
                  href={item.link}
                  className="group relative shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] h-[360px] sm:h-[400px] w-[270px] sm:w-[300px] block bg-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5"
                >
                  {/* Background Image */}
                  <img
                    src={item.imageSrc}
                    alt={item.title.replace('\n', ' ')}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 group-hover:from-black/90 transition-colors duration-300" />

                  {/* Top Badge & Rating */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
                    <span className="bg-[#E06D3B] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                      {item.tag}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute top-14 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-[#111111] text-xs font-black px-2.5 py-1 rounded-lg shadow-md border border-white/50">
                      {item.price}
                    </span>
                  </div>

                  {/* Bottom-Left Title & Subtitle */}
                  <div className="absolute bottom-5 left-5 z-10 max-w-[62%]">
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-white uppercase leading-[1.05] tracking-tight drop-shadow-md whitespace-pre-line">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-normal mt-1.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Bottom-Right Add to Cart Button */}
                  <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleCartClick(e, item, uniqueId)}
                      title="Add to Cart"
                      aria-label={`Add ${item.title.replace('\n', ' ')} to cart`}
                      className={`h-10 sm:h-11 px-3.5 sm:px-4 rounded-full flex items-center gap-1.5 shadow-xl transition-all duration-300 font-extrabold text-xs uppercase tracking-wider cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-400'
                          : 'bg-white text-black hover:bg-[#E06D3B] hover:text-white hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>ADD</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
