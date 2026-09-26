'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroVideoCarouselProps {
  onOpenQuiz: () => void;
}

const VIDEO_SLIDES = [
  {
    id: 1,
    src: '/videos/1.mp4',
    poster: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=75',
    title: 'Fresh farm-to-door groceries,',
    titleHighlight: 'delivered across Pakistan.',
    description: 'Discover a local-first online grocery experience that brings fresh produce, dairy, and pantry essentials from trusted Pakistani growers to your home.',
    badge: 'Fresh Farm Harvest',
  },
  {
    id: 2,
    src: '/videos/2.mp4',
    poster: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75',
    title: 'Supporting local producers',
    titleHighlight: 'made effortless.',
    description: 'Fresh seasonal vegetables, cultured dairy, bakery staples, and responsibly sourced meats delivered straight to your door.',
    badge: 'Artisanal Quality',
  },
  {
    id: 3,
    src: '/videos/3.mp4',
    poster: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=75',
    title: 'Smarter delivery routes,',
    titleHighlight: 'same-day freshness.',
    description: 'We organize neighborhood deliveries to reduce waste, save time, and bring peak freshness to homes across the country.',
    badge: 'Zero Waste Route',
  },
];

export default function HeroVideoCarousel({ onOpenQuiz }: HeroVideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(true);
  const [isMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VIDEO_SLIDES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        video.muted = isMuted;
        if (idx === currentIndex) {
          video.currentTime = 0;
          if (isPlaying) {
            video.play().catch(() => {
              // Browser autoplay policy catch fallback
            });
          } else {
            video.pause();
          }
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex, isPlaying, isMuted]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? VIDEO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VIDEO_SLIDES.length);
  };

  const activeSlide = VIDEO_SLIDES[currentIndex];

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
        {VIDEO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            {/* Instant Poster Background */}
            <Image
              src={slide.poster}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover scale-105 filter brightness-90 pointer-events-none"
            />
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              src={slide.src}
              poster={slide.poster}
              playsInline
              muted={isMuted}
              preload={idx === currentIndex ? 'auto' : 'metadata'}
              loop
              onEnded={handleNext}
              className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-90 transition-transform duration-[10000ms] ease-out transform"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e15] via-transparent to-black/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 z-10 pointer-events-none" />
      </div>

      <button
        onClick={handlePrev}
        aria-label="Previous Video"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 shadow-2xl group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Video"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 shadow-2xl group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
              {activeSlide.title}{' '}
              <span className="italic font-normal text-[#FF8A50] underline decoration-[#E06D3B]/40 decoration-wavy">
                {activeSlide.titleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-emerald-100/90 leading-relaxed max-w-2xl font-light drop-shadow-sm">
              {activeSlide.description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenQuiz}
                className="bg-[#E06D3B] hover:bg-[#c85a29] text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl shadow-[#E06D3B]/40 transition-all transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-3 border border-[#ff9e66]/40 group"
              >
                <span>Build your MarketLink cart</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-base sm:text-lg px-7 py-4 rounded-full backdrop-blur-md border border-white/25 transition-all gap-2 hover:border-white/40"
              >
                <span>Browse products</span>
                <ArrowRight className="w-5 h-5 text-[#FF8A50]" />
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-4 sm:gap-6 border-t border-white/15 max-w-xl">
              <div className="bg-black/30 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                <strong className="block font-serif text-2xl sm:text-3xl text-white font-bold">170+</strong>
                <span className="text-xs sm:text-sm text-emerald-200/80 font-medium">local producers</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                <strong className="block font-serif text-2xl sm:text-3xl text-white font-bold">1,500+</strong>
                <span className="text-xs sm:text-sm text-emerald-200/80 font-medium">grocery items</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                <strong className="block font-serif text-2xl sm:text-3xl text-[#FF8A50] font-bold">85%</strong>
                <span className="text-xs sm:text-sm text-emerald-200/80 font-medium">fewer food miles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
