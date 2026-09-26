'use client';

import React from 'react';

interface RoutineResetBundleSectionProps {
  onOpenQuiz?: () => void;
}

export default function RoutineResetBundleSection({
  onOpenQuiz,
}: RoutineResetBundleSectionProps) {
  return (
    <section className="w-full bg-white overflow-hidden border-b border-[#E8E2D5]">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left Column: Image with Save $100 Badge */}
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[580px] overflow-hidden bg-[#F4EFE6]">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85"
            alt="21-Day Routine Reset Bundle"
            className="w-full h-full object-cover object-center"
          />

          {/* Yellow Circular Badge */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFEE58] border-2 border-black flex flex-col items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="font-extrabold text-xs sm:text-sm tracking-widest uppercase text-black leading-none">
                SAVE
              </span>
              <span className="font-black text-2xl sm:text-3xl text-black leading-none mt-1">
                $100
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Copy & CTA */}
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] leading-[1.18] tracking-tight">
            New: The 21–Day<br className="hidden sm:block" /> Routine Reset Bundle
          </h2>

          <p className="text-base sm:text-lg text-[#333333] leading-relaxed max-w-md font-sans">
            Breakfast and lunch, handled for three weeks.{' '}
            <strong className="font-bold text-black">Save $100</strong> and get free shipping, with no auto-renewal or ongoing commitment.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenQuiz}
              className="bg-black text-white hover:bg-neutral-800 rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              START MY RESET
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
