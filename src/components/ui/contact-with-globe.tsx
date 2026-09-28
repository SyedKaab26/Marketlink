"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail, Phone, Headphones, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "support@marketlink.pk",
    href: "mailto:support@marketlink.pk",
    desc: "Customer Support & Orders"
  },
  {
    icon: Phone,
    label: "+92 (042) 111-MARKET (627538)",
    href: "tel:+92042111627538",
    desc: "Mon - Sat: 8 AM - 10 PM PKT"
  },
  {
    icon: MessageSquare,
    label: "+92 300 1234567 (WhatsApp Chat)",
    href: "https://wa.me/923001234567?text=Salam%20MarketLink%20Support",
    desc: "Instant 24/7 Response"
  },
  {
    icon: Headphones,
    label: "farmers@marketlink.pk",
    href: "mailto:farmers@marketlink.pk",
    desc: "Grower & Farmer Desk"
  }
];

export const FormDots = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 flex items-center justify-center overflow-hidden",
          isHorizontal ? "w-full" : "h-full",
          className,
        )}
        {...props}
      >
        <div
          className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}
        >
          <div
            className={cn(
              "absolute inset-0 bg-repeat",
              "text-emerald-700/30 dark:text-emerald-400/20",
            )}
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
              backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal
                ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
                : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    );
  },
);
FormDots.displayName = "FormDots";

interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  userDefaultName?: string;
  userDefaultEmail?: string;
}

export default function ContactWithGlobe({
  title = "Rabta Karein / Get in Touch",
  subtitle = "MarketLink Customer Care",
  description = "Connecting Pakistan's local farmers directly with your kitchen. Reach out for order assistance, farmer onboarding, or wholesale inquiries.",
  className,
  userDefaultName = "",
  userDefaultEmail = "",
}: ContactWithGlobeProps) {
  const [formData, setFormData] = useState({
    name: userDefaultName,
    email: userDefaultEmail,
    phone: "",
    city: "Lahore",
    category: "General Inquiry",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (userDefaultName || userDefaultEmail) {
      queueMicrotask(() => setFormData((prev) => ({
        ...prev,
        name: userDefaultName || prev.name,
        email: userDefaultEmail || prev.email,
      })));
    }
  }, [userDefaultName, userDefaultEmail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message. Please try again.");
      }

      setSubmittedTicket({
        ticketId: data.ticketId,
        message: data.message,
      });
      setFormData((prev) => ({
        ...prev,
        phone: "",
        subject: "",
        message: "",
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting. Try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={cn(
        "relative w-full bg-[#F9F6F0] text-[#1D3E2E] overflow-hidden py-16 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER TITLE */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#152F22] text-[#E06D3B] border border-[#234735]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-extrabold uppercase tracking-widest">
              {subtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1D3E2E]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-base text-[#55695E] max-w-lg leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          
          {/* LEFT COLUMN: CONTACT DETAILS & GLOBE */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DEC9] shadow-sm"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E06D3B]">
                Direct Contact Channels
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1D3E2E]">
                We&apos;re Available 7 Days a Week
              </h3>
              <p className="text-xs text-[#55695E] leading-relaxed">
                Reach out via phone, email, or WhatsApp. We respond within 2 to 4 hours during operational hours.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 pt-2">
              {CONTACT_LINKS.map(({ icon: Icon, label, href, desc }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: smoothEase,
                  }}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D5] hover:border-[#E06D3B]/50 hover:bg-[#FFF0E8] transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1D3E2E] text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 group-hover:bg-[#E06D3B]">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#1D3E2E] group-hover:text-[#E06D3B] truncate transition-colors">
                      {label}
                    </p>
                    <p className="text-[11px] text-[#8B7355] truncate">{desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 flex flex-col gap-5 shadow-sm"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E06D3B]">
                Send Us A Message
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1D3E2E] mt-0.5">
                How Can We Help You?
              </h3>
              <p className="text-xs text-[#55695E] mt-1">
                Fill out the form below and our team will get back to you promptly.
              </p>
            </div>

            <FormDots />

            {submittedTicket ? (
              <div className="bg-[#F4EFE6] border-2 border-[#1D3E2E]/20 rounded-2xl p-6 text-center space-y-4 animate-fadeIn my-auto">
                <div className="w-14 h-14 bg-[#1D3E2E] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#1D3E2E]">
                    Paigham Bhej Diya Gaya!
                  </h4>
                  <p className="text-xs text-[#55695E] mt-1">
                    {submittedTicket.message}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-[#E5DEC9] text-left text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-1.5">
                    <span className="text-[#8B7355] font-semibold">Tracking Ticket ID:</span>
                    <span className="font-extrabold text-[#E06D3B] font-mono text-sm">{submittedTicket.ticketId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8B7355] font-semibold">Response Time:</span>
                    <span className="font-bold text-[#1D3E2E]">Within 2-4 Hours</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <Button
                    onClick={() => setSubmittedTicket(null)}
                    className="h-10 px-5 rounded-xl border border-[#1D3E2E] text-[#1D3E2E] font-bold text-xs hover:bg-[#1D3E2E] hover:text-white transition-colors bg-transparent"
                  >
                    Send Another Message
                  </Button>
                  <a
                    href={`https://wa.me/923001234567?text=Salam%20MarketLink!%20Mera%20Ticket%20ID%20${submittedTicket.ticketId}%20hai.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> Fast-Track WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                      Full Name <span className="text-[#E06D3B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] placeholder:text-[#8B7355]/60 outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                      Email Address <span className="text-[#E06D3B]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.pk"
                      className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] placeholder:text-[#8B7355]/60 outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0300 1234567"
                      className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] placeholder:text-[#8B7355]/60 outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                      City / Region
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                    Inquiry Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                  >
                    <option value="General Inquiry">General Question / Support</option>
                    <option value="Order & Delivery Status">Order & Delivery Status</option>
                    <option value="Quality & Replacement Guarantee">Quality Issue / Replacement</option>
                    <option value="Farmer Partnership">Farmer & Grower Onboarding</option>
                    <option value="Bulk & Wholesale Order">Bulk / Wholesale Order (HORECA)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about organic veggies shipment"
                    className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-2.5 text-sm text-[#1D3E2E] placeholder:text-[#8B7355]/60 outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1D3E2E]">
                    Message <span className="text-[#E06D3B]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="w-full bg-[#FDFBF7] border border-[#D5CCBA] rounded-xl px-3.5 py-3 text-sm text-[#1D3E2E] placeholder:text-[#8B7355]/60 outline-none focus:border-[#E06D3B] focus:ring-2 focus:ring-[#E06D3B]/10 resize-none transition-all duration-200"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-[#1D3E2E] hover:bg-[#28543E] text-white group shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <span>Submit Paigham</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-[#E06D3B]" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
