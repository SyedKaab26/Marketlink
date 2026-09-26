'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface CategoryCard {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  link: string;
}

const DEFAULT_CATEGORIES: CategoryCard[] = [
  {
    id: 'organic-vegetables',
    title: 'ORGANIC\nVEGETABLES',
    subtitle: 'Farm fresh & pesticide free',
    imageSrc: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Organic Vegetables',
  },
  {
    id: 'fresh-fruits',
    title: 'FRESH\nFRUITS',
    subtitle: 'Tree-ripened seasonal picks',
    imageSrc: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Fresh Fruits',
  },
  {
    id: 'dairy-poultry',
    title: 'DAIRY &\nPOULTRY',
    subtitle: 'Pure farm milk & free-range eggs',
    imageSrc: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Dairy & Poultry',
  },
  {
    id: 'grains-staples',
    title: 'GRAINS &\nSTAPLES',
    subtitle: 'Stoneground flour & unpolished rice',
    imageSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Grains & Staples',
  },
];

interface ShopCollectionsSectionProps {
  categories?: CategoryCard[];
  title?: string;
}

export default function ShopCollectionsSection({
  categories = DEFAULT_CATEGORIES,
  title = 'SHOP CATEGORIES',
}: ShopCollectionsSectionProps) {
  return (
    <section className="w-full bg-[#FDFBF7] py-14 sm:py-20 border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-wider uppercase">
            {title}
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] lg:h-[420px] w-full block bg-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background Image with subtle zoom on hover */}
              <img
                src={item.imageSrc}
                alt={item.title.replace('\n', ' ')}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay for high text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/40 group-hover:from-black/70 transition-colors duration-300" />

              {/* Top-Left Title */}
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10 max-w-[85%]">
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase leading-[0.95] tracking-tight drop-shadow-md whitespace-pre-line">
                  {item.title}
                </h3>
              </div>

              {/* Bottom-Right White Circular Arrow Button */}
              <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-black shadow-md group-hover:bg-[#E06D3B] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
