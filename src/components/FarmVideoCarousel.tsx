'use client';

import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReelVideo {
  id: number;
  title: string;
  farm: string;
  location: string;
  videoUrl: string;
  posterUrl: string;
  tag: string;
  duration: string;
}

const FARM_REELS: ReelVideo[] = [
  {
    id: 1,
    title: 'Morning Organic Harvest',
    farm: 'Mirpurkhas Mango Orchards',
    location: 'Mirpurkhas, Sindh',
    videoUrl: '/videos/1.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    tag: 'Farm Harvest',
    duration: '0:15',
  },
  {
    id: 2,
    title: 'Fresh Cultured Dairy & Butter',
    farm: 'Sargodha Valley Farmhouse',
    location: 'Sargodha, Punjab',
    videoUrl: '/videos/2.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    tag: 'Artisanal Dairy',
    duration: '0:12',
  },
  {
    id: 3,
    title: 'Eco-Friendly Route Dispatch',
    farm: 'MarketLink Central Hub',
    location: 'Lahore, Punjab',
    videoUrl: '/videos/3.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    tag: 'Zero Waste Route',
    duration: '0:18',
  },
];

export default function FarmVideoCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeModalVideo, setActiveModalVideo] = useState<ReelVideo | null>(null);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#152e22] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E06D3B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E06D3B]/20 text-[#FF8A50] border border-[#E06D3B]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Farm Video Reels</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Watch farm freshness in action.
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base mt-2 max-w-xl font-light">
              See how our partner growers cultivate, harvest, and package your fresh produce across Pakistan.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Previous farm videos"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Next farm videos"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Cards Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x"
        >
          {FARM_REELS.map((reel) => (
            <div
              key={reel.id}
              onMouseEnter={() => setHoveredVideoId(reel.id)}
              onMouseLeave={() => setHoveredVideoId(null)}
              onClick={() => setActiveModalVideo(reel)}
              className="relative shrink-0 w-[280px] sm:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/15 snap-start transition-all hover:-translate-y-2 hover:border-[#E06D3B]/60"
            >
              {/* Background Video / Poster */}
              <video
                src={reel.videoUrl}
                poster={reel.posterUrl}
                muted
                loop
                playsInline
                ref={(el) => {
                  if (el) {
                    if (hoveredVideoId === reel.id) {
                      el.play().catch(() => {});
                    } else {
                      el.pause();
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Top Tag & Duration */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
                  {reel.tag}
                </span>
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-300">
                  {reel.duration}
                </span>
              </div>

              {/* Center Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-14 h-14 rounded-full bg-[#E06D3B] text-white flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:bg-[#f07d4b] border border-white/30">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1.5 text-left">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{reel.farm}</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug group-hover:text-[#FF8A50] transition-colors">
                  {reel.title}
                </h3>
                <p className="text-xs text-white/70">{reel.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalVideo(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] md:min-h-[500px]">
              <video
                src={activeModalVideo.videoUrl}
                poster={activeModalVideo.posterUrl}
                controls
                autoPlay
                muted={isModalMuted}
                playsInline
                className="w-full h-full object-contain max-h-[75vh]"
              />

              {/* Mute Toggle inside Modal */}
              <button
                onClick={() => setIsModalMuted(!isModalMuted)}
                className="absolute bottom-4 right-4 z-30 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full border border-white/20"
              >
                {isModalMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>
            </div>

            {/* Video Sidebar Details */}
            <div className="w-full md:w-80 p-6 bg-[#16291e] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-2 bg-[#E06D3B]/20 text-[#FF8A50] px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {activeModalVideo.tag}
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {activeModalVideo.title}
                </h3>
                <div className="space-y-1 text-sm text-emerald-200/80">
                  <p className="font-semibold text-white">{activeModalVideo.farm}</p>
                  <p>{activeModalVideo.location}</p>
                </div>
                <p className="text-xs text-white/70 leading-relaxed border-t border-white/10 pt-4">
                  Delivered straight from local agricultural clusters to your doorstep. Experience 100% farm-fresh quality.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="w-full py-3 bg-[#E06D3B] hover:bg-[#c85a29] text-white font-bold rounded-xl transition-all shadow-lg text-sm"
                >
                  Close & Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
