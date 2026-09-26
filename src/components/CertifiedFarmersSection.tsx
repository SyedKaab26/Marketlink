'use client';

import React from 'react';
import {
  Award,
  ShieldCheck,
  Leaf,
  Sprout,
  Sparkles,
  BadgeCheck,
  HeartHandshake,
  Globe,
  Microscope,
  FileCheck,
} from 'lucide-react';

interface CertificationLogo {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

const certificationLogos: CertificationLogo[] = [
  {
    id: 'pak-gap',
    name: 'Pak-GAP',
    code: 'GOVT CERTIFIED',
    icon: ShieldCheck,
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
  {
    id: 'usda-organic',
    name: 'USDA Organic',
    code: '100% ORGANIC',
    icon: Leaf,
    colorClass: 'text-green-700',
    bgClass: 'bg-green-50 border-green-200',
  },
  {
    id: 'global-gap',
    name: 'GlobalG.A.P.',
    code: 'GLOBAL STANDARD',
    icon: Globe,
    colorClass: 'text-teal-700',
    bgClass: 'bg-teal-50 border-teal-200',
  },
  {
    id: 'pcsir-lab',
    name: 'PCSIR Lab Tested',
    code: '0% CHEMICALS',
    icon: Microscope,
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'iso-22000',
    name: 'ISO 22000',
    code: 'FOOD SAFETY',
    icon: Award,
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'non-gmo',
    name: 'Non-GMO Verified',
    code: 'NATURAL SEEDS',
    icon: Sprout,
    colorClass: 'text-lime-700',
    bgClass: 'bg-lime-50 border-lime-200',
  },
  {
    id: 'halal-pure',
    name: 'Halal & Tayyib',
    code: 'PHA APPROVED',
    icon: BadgeCheck,
    colorClass: 'text-emerald-800',
    bgClass: 'bg-emerald-100 border-emerald-300',
  },
  {
    id: 'fairtrade',
    name: 'Fairtrade Direct',
    code: 'ETHICAL FARMING',
    icon: HeartHandshake,
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'rainforest',
    name: 'Eco Soil Alliance',
    code: 'SUSTAINABLE',
    icon: Sparkles,
    colorClass: 'text-cyan-700',
    bgClass: 'bg-cyan-50 border-cyan-200',
  },
  {
    id: 'pesticide-free',
    name: 'Pesticide Free',
    code: 'BIO HARVEST',
    icon: FileCheck,
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
];

export default function CertifiedFarmersSection() {
  // Duplicate list to create a smooth, seamless infinite scrolling ticker
  const duplicatedLogos = [
    ...certificationLogos,
    ...certificationLogos,
    ...certificationLogos,
  ];

  return (
    <section className="py-12 bg-[#F4EFE6] border-t border-[#E8E2D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
            Verified Quality & Standards
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1D3E2E] font-bold tracking-tight">
            Certified Farmers
          </h2>
        </div>

        {/* Auto Scroll Logo Marquee Ribbon */}
        <div className="relative w-full pt-2 pb-4">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F4EFE6] to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F4EFE6] to-transparent z-10 pointer-events-none" />

          {/* Ticker Track */}
          <div className="overflow-hidden w-full py-2">
            <div className="ticker-track-left flex gap-6 w-max items-center">
              {duplicatedLogos.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#E0D8C8] shadow-sm hover:shadow-md hover:border-[#1D3E2E] transition-all duration-200 group shrink-0 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bgClass} ${item.colorClass} group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm text-[#1D3E2E] group-hover:text-[#E06D3B] transition-colors whitespace-nowrap">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#8B7355]">
                        {item.code}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
