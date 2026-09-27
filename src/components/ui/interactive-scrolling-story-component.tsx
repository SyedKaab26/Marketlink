'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- MarketLink Story Slides Data ---
const slidesData = [
  {
    title: "Connecting Local Farms Directly To You",
    description: "We cut out unnecessary middleman markups so independent Pakistani growers from Sindh, Punjab, and KPK receive fair pay while your family gets raw, unadulterated farm produce.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    bgColor: "#1D3E2E",
    textColor: "#F9F6F0",
    btnText: "Explore Direct Sourcing",
    btnLink: "/producers"
  },
  {
    title: "Harvested Daily At Peak Ripeness",
    description: "Our organic fruits, crisp vegetables, and traditional dairy are harvested at first light and delivered within hours — locking in natural taste, aroma, and maximum essential nutrients.",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80",
    bgColor: "#244A38",
    textColor: "#F9F6F0",
    btnText: "Browse Fresh Harvest",
    btnLink: "/shop"
  },
  {
    title: "Empowering 170+ Local Farming Families",
    description: "Every purchase directly supports rural agricultural communities across Pakistan, providing fair income, modern farming equipment, and sustainable growth for future generations.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
    bgColor: "#E06D3B",
    textColor: "#FFFFFF",
    btnText: "Meet Our Farmers",
    btnLink: "/producers"
  },
  {
    title: "Zero-Waste & Eco-Friendly Delivery",
    description: "Optimized city fulfillment hubs in Karachi, Lahore, and Islamabad minimize food miles, eliminate single-use plastics, and deliver fresh produce right to your doorstep.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    bgColor: "#1D3E2E",
    textColor: "#F9F6F0",
    btnText: "Start Shopping Today",
    btnLink: "/shop"
  },
];

// --- Main Interactive Component ---
export function ScrollingFeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track window scroll position relative to this sticky container
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Distance scrolled into the container
      const scrolled = -rect.top;
      // Progress scaled 0 to 1
      const progress = Math.max(0, Math.min(0.99, scrolled / totalScrollableDistance));
      
      const newActiveIndex = Math.floor(progress * slidesData.length);
      setActiveIndex(newActiveIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial trigger

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollableDistance = rect.height - window.innerHeight;
    
    // Smooth scroll page to start position of slide index
    const targetScroll = containerTop + (index / slidesData.length) * totalScrollableDistance + 20;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const currentSlide = slidesData[activeIndex] || slidesData[0];

  const dynamicStyles: React.CSSProperties = {
    backgroundColor: currentSlide.bgColor,
    color: currentSlide.textColor,
    transition: 'background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1), color 0.7s ease',
  };

  const gridPatternStyle: React.CSSProperties = {
    '--grid-color': 'rgba(255, 255, 255, 0.08)',
    backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: '3.5rem 3.5rem',
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${slidesData.length * 100}vh` }}
    >
      <div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors" 
        style={dynamicStyles}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl mx-auto">
          
          {/* Left Column: Text Content, Pagination & Action CTA */}
          <div className="relative flex flex-col justify-center p-8 md:p-16 border-r border-white/10">
            {/* Pagination Bars */}
            <div className="absolute top-10 md:top-16 left-8 md:left-16 flex space-x-2.5 z-20">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out cursor-pointer ${
                    index === activeIndex ? 'w-12 bg-white' : 'w-6 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Animated Content */}
            <div className="relative h-72 w-full mt-6 md:mt-0">
              {slidesData.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                    index === activeIndex
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-10 pointer-events-none'
                  }`}
                >
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    {slide.title}
                  </h2>
                  <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg max-w-md opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>


          </div>

          {/* Right Column: Image Content with Grid Background */}
          <div className="hidden md:flex items-center justify-center p-8 relative" style={gridPatternStyle}>
            <div className="relative w-[80%] lg:w-[70%] h-[70vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20">
              <div 
                className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${activeIndex * 100}%)` }}
              >
                {slidesData.map((slide, index) => (
                  <div key={index} className="w-full h-full relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      onError={(e) => { 
                        const img = e.target as HTMLImageElement;
                        img.onerror = null; 
                        img.src = `https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80`; 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
