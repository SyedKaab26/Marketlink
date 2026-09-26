'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, ShoppingBag, Check } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // Duplicate items array to create a seamless infinite scrolling loop
  const duplicatedItems = [...items, ...items];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCartClick = (e: React.MouseEvent, item: DropItem, uniqueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedItemId(uniqueId);
    if (onAddToCart) {
      onAddToCart(item);
    }
    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

  return (
    <section className="relative border-b border-[#E8E2D5] bg-[#F4EFE6] py-16 sm:py-20 overflow-hidden">
      <style>{`
        @keyframes continuousScrollFarm {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .farm-marquee-track {
          display: flex;
          width: max-content;
          animation: continuousScrollFarm 40s linear infinite;
        }

        .farm-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 flex items-end justify-between gap-4">
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
            onClick={() => handleManualScroll('left')}
            aria-label="Previous harvest picks"
            className="flex size-10 items-center justify-center rounded-full border border-[#D8CEBB] bg-white text-[#1D3E2E] shadow-sm transition-all hover:border-[#E06D3B] hover:bg-[#E06D3B] hover:text-white cursor-pointer active:scale-95"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Next harvest picks"
            className="flex size-10 items-center justify-center rounded-full border border-[#D8CEBB] bg-white text-[#1D3E2E] shadow-sm transition-all hover:border-[#E06D3B] hover:bg-[#E06D3B] hover:text-white cursor-pointer active:scale-95"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Marquee Carousel Container with Gradient Side Fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left Side Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F4EFE6] to-transparent z-20" />

        {/* Right Side Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F4EFE6] to-transparent z-20" />

        {/* Scrolling Track Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none py-2 px-4 scroll-smooth"
        >
          <div className="farm-marquee-track gap-4 sm:gap-6">
            {duplicatedItems.map((item, idx) => {
              const uniqueId = `${item.name}-${idx}`;
              const isAdded = addedItemId === uniqueId;

              return (
                <article
                  key={uniqueId}
                  className="group relative flex w-[280px] sm:w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E0D8C8] bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-[#E8E2D5] overflow-hidden">
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-xs font-semibold text-[#8B7355]">
                      <Clock3 className="size-4 text-[#E06D3B]" />
                      {item.time}
                    </p>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1D3E2E]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#55695E] line-clamp-1">{item.collection}</p>
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
                          onClick={(e) => handleCartClick(e, item, uniqueId)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-400'
                              : 'bg-[#1D3E2E] hover:bg-[#E06D3B] text-white active:scale-95'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}