'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, ShoppingBag } from 'lucide-react';

export interface DropItem {
  id?: number;
  time: string;
  name: string;
  collection: string;
  imageSrc: string;
  price: number;
  unit: string;
}

export interface ProductDropCardProps {
  title: string;
  subtitle: string;
  items: DropItem[];
  onAddToCart?: (item: DropItem) => void;
}

export function ProductDropCard({ title, subtitle, items, onAddToCart }: ProductDropCardProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateControls = () => {
      setCanGoPrev(carousel.scrollLeft > 1);
      setCanGoNext(carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1);
    };

    const frame = window.requestAnimationFrame(updateControls);
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(carousel);
    carousel.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      carousel.removeEventListener('scroll', updateControls);
      window.removeEventListener('resize', updateControls);
    };
  }, [items.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || isPaused || items.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      if (document.hidden || carousel.scrollWidth <= carousel.clientWidth) return;

      const firstItem = carousel.firstElementChild;
      if (!(firstItem instanceof HTMLElement)) return;

      const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
      const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;
      carousel.scrollTo({
        left: atEnd ? 0 : carousel.scrollLeft + firstItem.offsetWidth + gap,
        behavior: 'smooth',
      });
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused, items.length]);

  const scrollByItem = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const firstItem = carousel?.firstElementChild;
    if (!carousel || !(firstItem instanceof HTMLElement)) return;

    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({ left: direction * (firstItem.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <section
      className="border-b border-[#E8E2D5] bg-[#F4EFE6] py-16 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#E06D3B]">
              Just harvested
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1D3E2E] sm:text-4xl">{title}</h2>
            <p className="text-sm leading-relaxed text-[#55695E] sm:text-base">{subtitle}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByItem(-1)}
              disabled={!canGoPrev}
              aria-label="Previous harvest picks"
              className="flex size-10 items-center justify-center rounded-full border border-[#D8CEBB] bg-white text-[#1D3E2E] transition-colors hover:border-[#E06D3B] hover:text-[#E06D3B] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByItem(1)}
              disabled={!canGoNext}
              aria-label="Next harvest picks"
              className="flex size-10 items-center justify-center rounded-full border border-[#D8CEBB] bg-white text-[#1D3E2E] transition-colors hover:border-[#E06D3B] hover:text-[#E06D3B] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Fresh harvest picks"
          aria-roledescription="carousel"
        >
          {items.map((item) => (
            <article
              key={item.name}
              className="flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-[#E0D8C8] bg-white sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <div className="relative aspect-[4/3] bg-[#E8E2D5]">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 48vw, 32vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-[#8B7355]">
                  <Clock3 className="size-4 text-[#E06D3B]" />
                  {item.time}
                </p>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1D3E2E]">{item.name}</h3>
                  <p className="mt-1 text-sm text-[#55695E]">{item.collection}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-[#EEE8DC] pt-3">
                  <div>
                    <span className="text-lg font-extrabold text-[#1D3E2E]">
                      Rs. {item.price.toLocaleString('en-PK')}
                    </span>
                    <span className="text-sm text-[#8B7355]"> / {item.unit}</span>
                  </div>
                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="flex items-center gap-1.5 bg-[#1D3E2E] hover:bg-[#E06D3B] text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}