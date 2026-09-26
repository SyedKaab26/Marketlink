"use client";
import React from "react";
import { TestimonialsColumn, TestimonialItem } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials: TestimonialItem[] = [
  {
    text: "MarketLink changed how my family eats! Getting fresh Sindh mangoes and organic spinach delivered directly from Mirpurkhas orchards within 24 hours of harvest is incredible.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    name: "Ayesha Khan",
    role: "Home Cook · Karachi",
  },
  {
    text: "The Sargodha Kinnow oranges and fresh farm dairy are so much better than supermarket quality. Delivery to Model Town, Lahore is always prompt and reliable.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    name: "Bilal Ahmed",
    role: "MarketLink Member · Lahore",
  },
  {
    text: "Sourcing raw wildflower honey and organic produce directly from Potohar growers has elevated our restaurant kitchen. Direct farmer pricing is unbeatable!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    name: "Saman Malik",
    role: "Executive Chef · Islamabad",
  },
  {
    text: "As a mango orchard owner in Multan, MarketLink eliminated middlemen and let us sell directly to customers across Pakistan with fair pay and quick payouts.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    name: "Tariq Raza",
    role: "Partner Farmer · Multan",
  },
  {
    text: "Getting seasonal Hunza almonds and farm-fresh organic eggs delivered weekly makes our healthy eating routine effortless and delightful.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    name: "Zainab Hussain",
    role: "Nutritionist · Rawalpindi",
  },
  {
    text: "The farm-to-table freshness exceeded all expectations. It eliminated unnecessary markup while giving us pure, pesticide-free vegetables.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    name: "Aliza Khan",
    role: "Subscribed Member · Faisalabad",
  },
  {
    text: "Fresh citrus and mountain honey straight from KPK valleys directly to my doorstep in University Town. Sustainable packaging keeps everything crisp.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    name: "Farhan Siddiqui",
    role: "Food Lover · Peshawar",
  },
  {
    text: "Ordering stone fruits and dates directly from Balochistan orchards saved me weekend trips to distant mandis. Highly recommended!",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
    name: "Sana Sheikh",
    role: "Home Chef · Quetta",
  },
  {
    text: "The weekly harvest drop notifications make grocery shopping interactive and fun. Knowing exact farm origins brings real peace of mind.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    name: "Hassan Ali",
    role: "Organic Buyer · Hyderabad",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-[#F9F6F0] py-20 relative overflow-hidden border-t border-[#E8E2D5]">
      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="flex justify-center">
            <div className="border border-[#E0D8C8] bg-white text-[#E06D3B] text-xs font-extrabold uppercase tracking-widest py-1 px-4 rounded-full shadow-sm">
              Member Love
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1D3E2E] font-bold tracking-tight mt-5">
            What local food lovers are saying
          </h2>
          <p className="text-center mt-3 text-[#55695E] text-sm sm:text-base leading-relaxed">
            See how MarketLink is helping households and farms connect directly across Pakistan.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
