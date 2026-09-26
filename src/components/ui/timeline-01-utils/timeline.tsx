'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type TimelineItem = {
  title: string;
  description: string;
  date: string;
  image: string;
};

type TimelineProps = {
  items: TimelineItem[];
};

type TimelineEntryProps = {
  item: TimelineItem;
  index: number;
};

function TimelineEntry({ item, index }: TimelineEntryProps) {
  const entryRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isReversed = index % 2 === 1;

  useEffect(() => {
    const entry = entryRef.current;
    if (!entry) return;

    const observer = new IntersectionObserver(
      ([entryObserver]) => {
        if (entryObserver.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(entry);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={entryRef}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`relative grid grid-cols-[2rem_1fr] gap-5 transition-all duration-700 ease-out md:min-h-[19rem] md:grid-cols-2 md:gap-16 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} motion-reduce:translate-y-0 motion-reduce:opacity-100`}
    >
              <div
                className={`absolute left-[1.1rem] top-1 z-10 h-3 w-3 rounded-full border-2 border-[#F9F6F0] bg-[#E06D3B] shadow-[0_0_0_4px_#E8E2D5] md:left-1/2 md:-translate-x-1/2 ${isReversed ? 'md:top-8' : 'md:top-8'}`}
                aria-hidden="true"
              />
              <div className={`${isReversed ? 'md:col-start-2 md:row-start-1 md:pl-0' : 'md:col-start-1 md:row-start-1 md:pr-0'} col-start-2 transition-transform duration-700 ${isVisible ? 'translate-x-0' : isReversed ? 'translate-x-8' : '-translate-x-8'} motion-reduce:translate-x-0`}>
                <div className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-sm">
                  <Image
                    src={item.image}
                    alt=""
                    width={720}
                    height={440}
                    className="h-44 w-full object-cover md:h-52"
                  />
                </div>
              </div>
              <div className={`${isReversed ? 'md:col-start-1 md:row-start-1 md:text-right' : 'md:col-start-2 md:row-start-1'} col-start-2 flex flex-col justify-center pb-2 transition-transform duration-700 md:pb-0 ${isVisible ? 'translate-x-0' : isReversed ? '-translate-x-8' : 'translate-x-8'} motion-reduce:translate-x-0`}>
                <span className="mb-2 text-sm font-extrabold tracking-widest text-[#E06D3B]">{item.date}</span>
                <h3 className="font-serif text-2xl font-bold text-[#1D3E2E]">{item.title}</h3>
                <p className={`mt-3 max-w-md text-sm leading-relaxed text-[#55695E] ${isReversed ? 'md:ml-auto' : ''}`}>
                  {item.description}
                </p>
              </div>
    </article>
  );
}

export default function Timeline({ items }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        const bounds = timeline.getBoundingClientRect();
        const viewportProgress = (window.innerHeight * 0.55 - bounds.top) / bounds.height;
        setProgress(Math.min(1, Math.max(0, viewportProgress)));
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div ref={timelineRef} className="relative px-6 py-12 md:px-10 md:py-16 lg:px-16">
      <div className="absolute bottom-0 left-10 top-0 w-px bg-[#DCD3C0] md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
        <div
          className="absolute left-0 top-0 w-full origin-top bg-[#E06D3B] transition-[height] duration-150 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <div className="space-y-12 md:space-y-0">
        {items.map((item, index) => (
          <TimelineEntry key={`${item.date}-${item.title}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
