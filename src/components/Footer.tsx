'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#152F22] text-[#E8E2D5] pt-16 pb-12 border-t border-[#234735]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#234735]">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="MarketLink logo" width={48} height={48} className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  MarketLink
                </span>
                <span className="text-[10px] text-[#A0B5A8] font-semibold tracking-wider uppercase">
                  Farm Fresh Just a Click Away
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#C4D6CB] leading-relaxed max-w-sm">
              Connecting local Pakistani farmers directly with consumers for fresh, organic, and affordable produce.
            </p>
            <div className="space-y-2 text-xs text-[#A0B5A8] pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E06D3B] shrink-0" />
                <span>Serving Karachi, Lahore, Islamabad & across Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E06D3B] shrink-0" />
                <a href="mailto:support@marketlink.pk" className="hover:text-white transition-colors">support@marketlink.pk</a>
              </p>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h3 className="font-semibold text-white text-xs mb-4 tracking-wider uppercase">Shop Produce</h3>
            <ul className="space-y-2.5 text-sm text-[#A0B5A8]">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products Catalog</Link></li>
              <li><Link href="/shop?search=Organic" className="hover:text-white transition-colors">Organic Vegetables</Link></li>
              <li><Link href="/shop?search=Fruits" className="hover:text-white transition-colors">Fresh Fruits</Link></li>
              <li><Link href="/shop?search=Dairy" className="hover:text-white transition-colors">Dairy & Poultry</Link></li>
              <li><Link href="/shop?search=Grains" className="hover:text-white transition-colors">Grains & Staples</Link></li>
            </ul>
          </div>

          {/* Column 2: About & Network */}
          <div>
            <h3 className="font-semibold text-white text-xs mb-4 tracking-wider uppercase">About & Network</h3>
            <ul className="space-y-2.5 text-sm text-[#A0B5A8]">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/producers" className="hover:text-white transition-colors">Our Partner Farmers</Link></li>
              <li><Link href="/#markets" className="hover:text-white transition-colors">Regional Market Hubs</Link></li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div>
            <h3 className="font-semibold text-white text-xs mb-4 tracking-wider uppercase">Support & Info</h3>
            <ul className="space-y-2.5 text-sm text-[#A0B5A8]">
              <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              <li>
                <Link
                  href="/contact#faq"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.location.pathname === '/contact') {
                      e.preventDefault();
                      window.history.replaceState(null, '', '/contact#faq');
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/#markets" className="hover:text-white transition-colors">Delivery Hubs Map</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8BA496] gap-4">
          <div>
            © {new Date().getFullYear()} MarketLink Pakistan. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/help" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

