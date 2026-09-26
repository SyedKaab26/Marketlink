"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  description: string;
  badge: string;
}

const slides: Slide[] = [
  {
    image: "/images/farmers/farmer_1.jpg",
    title: "Ch. Tariq Mehmood",
    description: "3rd generation organic apple and dried fruit grower from Hunza Valley.",
    badge: "Gilgit Orchards",
  },
  {
    image: "/images/farmers/farmer_2.jpg",
    title: "Zubaida Bibi",
    description: "Pioneer in pesticide-free citrus & mango cultivation in Southern Punjab.",
    badge: "Multan Farms",
  },
  {
    image: "/images/farmers/farmer_3.jpg",
    title: "Haji Abdul Rahman",
    description: "Master mountain honey harvester & stone fruit orchard owner in Swat.",
    badge: "Swat Valley",
  },
  {
    image: "/images/farmers/farmer_4.jpg",
    title: "Malik Ghulam Abbas",
    description: "Specialist in heirloom wheat varieties & cold-pressed artisanal mustard oil.",
    badge: "Sargodha Grain",
  },
  {
    image: "/images/farmers/farmer_5.jpg",
    title: "Mirza Gul Khan",
    description: "Sustainably harvested almonds, pistachios, and dried figs from Balochistan.",
    badge: "Quetta Produce",
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 100,
      velocityDivisor: 400,
      sensitivity: 140,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 140,
      velocityDivisor: 550,
      sensitivity: 180,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 180,
    velocityDivisor: 700,
    sensitivity: 200,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

const CarouselStacked = () => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (val) => {
      const normalized = ((Math.round(val) % total) + total) % total;
      setActiveIndex(normalized);
    });
    return () => unsubscribe();
  }, [scrollProgress, total]);

  // Continuous auto-scroll loop effect
  React.useEffect(() => {
    if (!isPlaying || isHovered || isDragging) return;

    const interval = setInterval(() => {
      const current = scrollProgress.get();
      const target = Math.round(current) + 1;
      animate(scrollProgress, target, {
        type: "spring",
        stiffness: 180,
        damping: 26,
        mass: 0.9,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, isDragging, scrollProgress]);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth || 1024),
    [windowWidth],
  );

  const handleDragStart = () => {
    setIsDragging(true);
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.8,
    });
  };

  const navigateTo = (direction: "next" | "prev") => {
    const current = Math.round(scrollProgress.get());
    const target = direction === "next" ? current + 1 : current - 1;
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.8,
    });
  };

  const jumpToSlide = (index: number) => {
    const current = scrollProgress.get();
    const currentNormalized = ((Math.round(current) % total) + total) % total;
    let diff = index - currentNormalized;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    const target = Math.round(current) + diff;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.8,
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 10) {
      const current = scrollProgress.get();
      const shift = delta > 0 ? 0.35 : -0.35;
      scrollProgress.set(current + shift);
    }
  };

  const handleWheelEnd = () => {
    const current = scrollProgress.get();
    animate(scrollProgress, Math.round(current), {
      type: "spring",
      stiffness: 220,
      damping: 28,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      onWheelCapture={handleWheelEnd}
      className="flex flex-col items-center justify-center w-full py-8 bg-transparent overflow-hidden select-none relative group/carousel"
    >
      <div className="relative w-full max-w-7xl h-80 sm:h-[28rem] lg:h-[32rem] flex items-center justify-center">
        {/* Transparent Drag Surface Overlay */}
        <motion.div
          drag="x"
          dragSnapToOrigin
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing touch-pan-y"
        />

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => navigateTo("prev")}
          aria-label="Previous slide"
          className="absolute left-4 sm:left-8 lg:left-12 z-50 p-3 rounded-full bg-white/95 text-[#1D3E2E] shadow-2xl border border-[#E0D8C8] hover:bg-[#1D3E2E] hover:text-white hover:border-[#1D3E2E] transition-all transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => navigateTo("next")}
          aria-label="Next slide"
          className="absolute right-4 sm:right-8 lg:right-12 z-50 p-3 rounded-full bg-white/95 text-[#1D3E2E] shadow-2xl border border-[#E0D8C8] hover:bg-[#1D3E2E] hover:text-white hover:border-[#1D3E2E] transition-all transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {slides.map((slide, i) => (
          <Card
            key={i}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            onCardClick={() => jumpToSlide(i)}
          />
        ))}
      </div>

      {/* Interactive Controls & Pagination Indicators */}
      <div className="flex items-center justify-center gap-3 mt-6 z-50 relative">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause auto scroll" : "Play auto scroll"}
          className="p-2 rounded-full bg-white/90 text-[#1D3E2E] border border-[#E0D8C8] hover:bg-[#1D3E2E] hover:text-white transition-all cursor-pointer shadow-sm"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                activeIndex === i
                  ? "w-8 bg-[#E06D3B]"
                  : "w-2.5 bg-[#1D3E2E]/30 hover:bg-[#1D3E2E]/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  onCardClick: () => void;
}

const Card = ({ slide, index, total, progress, config, onCardClick }: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );

  return (
    <motion.div
      onClick={onCardClick}
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      className={cn(
        "absolute rounded-2xl overflow-hidden bg-muted group pointer-events-auto shadow-xl transition-shadow duration-300 cursor-pointer border border-white/20",
        "w-44 h-56 sm:w-56 sm:h-80 lg:w-64 lg:h-96",
      )}
    >
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
      />

      <motion.div
        style={{
          opacity: useTransform(
            offset,
            [-2, -0.5, 0, 0.5, 2],
            [0.5, 0.2, 0, 0.2, 0.5],
          ),
        }}
        className="absolute inset-0 bg-black pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <Badge className="absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-6 lg:right-6 px-2.5 sm:px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-[#1D3E2E] shadow-md border border-[#E0D8C8]">
        {slide.badge}
      </Badge>

      <div className="absolute bottom-5 left-3 right-3 sm:bottom-8 sm:left-5 sm:right-5 lg:bottom-10 lg:left-6 lg:right-6 text-white text-center sm:text-left">
        <motion.p
          style={{
            opacity: useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]),
          }}
          className="text-base sm:text-xl lg:text-2xl font-bold leading-tight mb-1 drop-shadow-md tracking-tight font-serif"
        >
          {slide.title}
        </motion.p>
        <motion.p
          style={{
            opacity: useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]),
          }}
          className="hidden sm:block text-xs text-white/90 line-clamp-2 italic font-medium leading-relaxed drop-shadow"
        >
          {slide.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;
