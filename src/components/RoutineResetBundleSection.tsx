'use client';

import Link from 'next/link';

interface RoutineResetBundleSectionProps {
  onOpenQuiz?: () => void;
}

export default function RoutineResetBundleSection({
  onOpenQuiz,
}: RoutineResetBundleSectionProps) {
  return (
    <section className="w-full bg-white overflow-hidden border-b border-[#E8E2D5]">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left Column: Image with Save Badge */}
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[580px] overflow-hidden bg-[#F4EFE6]">
          <img
            src="/images/vegetable-basket-reset.jpg"
            alt="21-Day Organic Vegetable Basket Routine Reset Bundle"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1400&q=85';
            }}
            className="w-full h-full object-cover object-center"
          />

          {/* Yellow Circular Badge */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFEE58] border-2 border-black flex flex-col items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 px-1 text-center">
              <span className="font-extrabold text-[10px] sm:text-xs tracking-widest uppercase text-black leading-none">
                UP TO
              </span>
              <span className="font-black text-xl sm:text-2xl text-black leading-tight mt-0.5">
                20% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Copy & CTA */}
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] leading-[1.18] tracking-tight">
            Use Code For<br className="hidden sm:block" /> Discounts
          </h2>

          <p className="text-base sm:text-lg text-[#333333] leading-relaxed max-w-md font-sans">
            Handpick your favorite farm-fresh organic produce & kitchen essentials.{' '}
            <strong className="font-bold text-black">Use &apos;MARKETLINK2GO&apos; code for 20% discount on your order</strong> and free delivery all over Pakistan, with no auto-renewal or ongoing commitment.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-black text-white hover:bg-[#E06D3B] rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-center"
            >
              ORDER NOW.
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

