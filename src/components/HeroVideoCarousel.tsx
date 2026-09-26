'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';

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
    duration: 8000,
  },
  {
    id: 2,
    src: '/videos/2.mp4',
    poster: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75',
    title: 'Supporting local producers',
    titleHighlight: 'made effortless.',
    description: 'Fresh seasonal vegetables, cultured dairy, bakery staples, and responsibly sourced meats delivered straight to your door.',
    badge: 'Artisanal Quality',
    duration: 8000,
  },
  {
    id: 3,
    src: '/videos/3.mp4',
    poster: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=75',
    title: 'Smarter delivery routes,',
    titleHighlight: 'same-day freshness.',
    description: 'We organize neighborhood deliveries to reduce waste, save time, and bring peak freshness to homes across the country.',
    badge: 'Zero Waste Route',
    duration: 8000,
  },
];

export default function HeroVideoCarousel({ onOpenQuiz }: HeroVideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Timer & progress bar for auto sliding
  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const interval = 100;
    const totalDuration = VIDEO_SLIDES[currentIndex].duration || 8000;
    const step = (interval / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % VIDEO_SLIDES.length);
    }, totalDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [currentIndex, isPlaying]);

  // Separate slide reset from play/pause/mute toggle to avoid video reset loop
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      video.muted = isMuted;

      if (idx === currentIndex) {
        video.currentTime = 0;
        if (isPlaying) {
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {
              // Auto-play was prevented or deferred
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  // Toggle play/pause or mute without resetting currentTime
  useEffect(() => {
    const activeVid = videoRefs.current[currentIndex];
    if (!activeVid) return;

    activeVid.muted = isMuted;
    if (isPlaying) {
      const promise = activeVid.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } else {
      activeVid.pause();
    }
  }, [isPlaying, isMuted, currentIndex]);

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? VIDEO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % VIDEO_SLIDES.length);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const activeSlide = VIDEO_SLIDES[currentIndex];

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white group">
      {/* Video Background Slides */}
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
                if (el) {
                  el.muted = isMuted;
                  videoRefs.current[idx] = el;
                }
              }}
              poster={slide.poster}
              autoPlay
              playsInline
              muted
              preload={idx === currentIndex ? 'auto' : 'metadata'}
              loop
              className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-90 transition-transform duration-[10000ms] ease-out transform"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          </div>
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e15] via-transparent to-black/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 z-10 pointer-events-none" />
      </div>

      {/* Media Controls Bar (Top Right) */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/20">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          title={isPlaying ? 'Pause Carousel' : 'Play Carousel'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Navigation Arrow Left */}
      <button
        onClick={handlePrev}
        aria-label="Previous Video"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 shadow-2xl group/btn"
      >
        <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={handleNext}
        aria-label="Next Video"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 shadow-2xl group/btn"
      >
        <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E06D3B]/20 border border-[#E06D3B]/40 px-3.5 py-1.5 rounded-full text-[#FF8A50] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Film className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </div>

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
                className="bg-[#E06D3B] hover:bg-[#c85a29] text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl shadow-[#E06D3B]/40 transition-all transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-3 border border-[#ff9e66]/40 group/quiz"
              >
                <span>Build your MarketLink cart</span>
                <Sparkles className="w-5 h-5 group-hover/quiz:rotate-12 transition-transform" />
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-base sm:text-lg px-7 py-4 rounded-full backdrop-blur-md border border-white/25 transition-all gap-2 hover:border-white/40"
              >
                <span>Browse products</span>
                <ArrowRight className="w-5 h-5 text-[#FF8A50]" />
              </Link>
            </div>

            {/* Bottom Stats Strip */}
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

      {/* Video Carousel Selector & Progress Bar (Bottom Bar) */}
      <div className="absolute bottom-6 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 backdrop-blur-lg border border-white/15 p-3 rounded-2xl">
          {/* Video Slide Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {VIDEO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setProgress(0);
                    setCurrentIndex(idx);
                  }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                      : 'bg-black/20 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FF8A50] animate-pulse' : 'bg-white/40'}`} />
                  <span>0{slide.id}. {slide.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Active Video Progress Bar & Counter */}
          <div className="flex items-center gap-3 w-full sm:w-48 shrink-0">
            <span className="text-xs text-white/60 font-mono">0{currentIndex + 1} / 0{VIDEO_SLIDES.length}</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#E06D3B] transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

