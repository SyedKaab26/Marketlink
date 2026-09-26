"use client";

import Timeline from '@/components/ui/timeline-01-utils/timeline';

const timelineData = [
  {
    title: 'MarketLink starts local',
    description:
      'Built around a simple idea: make it easier for families to discover and support Pakistan\'s independent farmers and food makers.',
    date: '2022',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'A growing producer network',
    description:
      'More growers, bakers, makers, and small food businesses joined the network, bringing better local choice to weekly carts.',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Fresh food, further reach',
    description:
      'Today, neighborhood delivery routes connect more households with fresh groceries while keeping value closer to the people who produce them.',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
  },
];

const TimelineBlock01 = () => {
  return (
    <section className="overflow-hidden bg-[#F4EFE6]" aria-labelledby="marketlink-story-title">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="border-x border-b border-[#DCD3C0] px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
          <div className="max-w-2xl space-y-4">
            <div className="space-y-3">
              <h2 id="marketlink-story-title" className="font-serif text-3xl font-bold tracking-tight text-[#1D3E2E] md:text-4xl lg:text-5xl">
                A better way to shop local
              </h2>
              <p className="text-base leading-relaxed text-[#55695E] md:text-lg">
                From one neighborhood idea to a growing network of trusted producers, every step brings local food closer to your week.
              </p>
            </div>
          </div>
        </div>
        <div className="border-r border-[#DCD3C0] md:border-x">
          <Timeline items={timelineData} />
        </div>
        <div className="h-16 border-x border-t border-[#DCD3C0] md:h-28" />
      </div>
    </section>
  );
};

export default TimelineBlock01;
