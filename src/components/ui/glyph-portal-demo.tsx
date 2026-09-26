"use client";

import { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Sprout, Award, Truck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const settings = { word: "HARVEST", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

export default function GlyphPortalDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string>("Arial, sans-serif");

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => { if (!settled) { settled = true; setFace(value); } };
    fontLoad ??= new FontFace(
      "Glyph Portal Jakarta",
      'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")',
      { weight: "400 700" }
    ).load().then((font) => { document.fonts.add(font); });
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; };
  }, []);

  return (
    <div
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="Harvest. Scroll to step inside."
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#082117",
        containerType: "inline-size",
        fontFamily: face,
      }}
    >
      <style>{`
        [data-slipstream-demo] [data-gp-caption] {
          inset: calc(var(--gp-word-bottom, 50%) + 76px) 24px auto;
          justify-content: center;
        }
        [data-slipstream-demo] [data-gp-hint] { display: none; }
        [data-slipstream-demo] [data-gp-enter] {
          min-height: 48px;
          padding: 0 24px;
          gap: 16px;
          background: linear-gradient(135deg, #143b2c 0%, #0d281e 100%);
          border: 1px solid rgba(224, 109, 59, 0.4);
          border-radius: 9999px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), 0 0 15px rgba(224, 109, 59, 0.2);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-slipstream-demo] [data-gp-enter]:hover {
          background: linear-gradient(135deg, #E06D3B 0%, #c45827 100%);
          border-color: #E06D3B;
          box-shadow: 0 8px 25px rgba(224, 109, 59, 0.4);
          transform: translateY(-2px);
        }
        [data-slipstream-demo] [data-gp-enter]:focus-visible {
          outline: 2px solid #E06D3B;
          outline-offset: 4px;
        }
        [data-slipstream-demo] [data-gp-touch-picker] { top: auto; bottom: 18px; left: 50%; }
        [data-slipstream-demo] [data-gp-select] {
          border-color: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 12px;
          color: #e2e8f0;
          background: rgba(15, 35, 26, 0.85);
        }
        [data-sublime-header] {
          position: absolute;
          inset: clamp(24px, 4.5cqw, 48px) clamp(24px, 5cqw, 64px) auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        [data-sublime-logo] {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -.04em;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        [data-sublime-category] {
          font-size: 12px;
          font-weight: 600;
          line-height: 1.5;
          color: #E06D3B;
          background: rgba(224, 109, 59, 0.12);
          border: 1px solid rgba(224, 109, 59, 0.3);
          padding: 4px 12px;
          border-radius: 9999px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        [data-sublime-eyebrow] {
          position: absolute;
          inset: auto 24px calc(100% - var(--gp-word-top, 35%) + 32px);
          margin: 0;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #a3b8ad;
        }
        [data-sublime-support] {
          position: absolute;
          inset: calc(var(--gp-word-bottom, 50%) + 28px) 24px auto;
          margin: 0;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #d1dfd7;
        }
        [data-sublime-scroll] {
          position: absolute;
          inset: auto 24px 6%;
          text-align: center;
          color: #8da498;
          font-size: 12px;
          letter-spacing: .03em;
        }
        @media(any-pointer: coarse){ [data-sublime-scroll] { bottom: 13%; } }
        @container(max-width: 450px) {
          [data-sublime-category] { max-width: 14ch; text-align: right; }
          [data-sublime-eyebrow] { font-size: 12px; }
          [data-sublime-support] { font-size: 14px; }
          [data-slipstream-demo] [data-gp-caption] { top: calc(var(--gp-word-bottom, 50%) + 72px); }
        }
        [data-slipstream-demo] [data-gp-content] {
          padding: 6rem clamp(1.25rem, 6cqw, 6rem) 7rem;
          font-family: inherit;
        }
        [data-slipstream-demo] section, [data-slipstream-demo] [data-gp-caption] { font-family: inherit; }
      `}</style>

      <GlyphPortal
        word={s.word}
        fontFamily={face}
        fontWeight={900}
        style={{ fontFamily: face }}
        scrollLength={s.scrollLength}
        interactive={s.interactive}
        annotations={s.annotations}
        background={
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "scale(var(--gp-field-scale,1))",
              background:
                "radial-gradient(circle at 18% 12%, rgba(224,109,59,.28), transparent 38%), radial-gradient(circle at 82% 25%, rgba(68,125,98,.35), transparent 42%), radial-gradient(circle at 50% 80%, rgba(9,48,35,.75), transparent 50%), linear-gradient(135deg, #071f16 0%, #0d3628 48%, #051811 100%)",
            }}
          />
        }
        front={
          <>
            <div data-sublime-header>
              <span data-sublime-logo>
                <Sparkles className="w-5 h-5 text-[#E06D3B]" /> marketlink.
              </span>
              <span data-sublime-category>🌿 Farm Fresh & Organic</span>
            </div>
            <p data-sublime-eyebrow>A fresh perspective on organic farming</p>
            <p data-sublime-support>Step inside to discover Pakistan's seasonal harvest</p>
            <span data-sublime-scroll>Scroll to step inside ↓</span>
          </>
        }
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E06D3B]/15 border border-[#E06D3B]/35 text-[#E06D3B] text-xs font-semibold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" />
              Direct From Pakistani Farms
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight">
              Directly connecting Pakistan's finest growers to your kitchen.
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed font-normal max-w-2xl">
              Skip storage delays. Enjoy organic produce harvested daily from orchards in Mirpurkhas, Sargodha, Potohar & the northern valleys.
            </p>
          </div>

          {/* Feature Grid with Glassmorphic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative rounded-3xl p-7 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#E06D3B]/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E06D3B]/20 border border-[#E06D3B]/30 flex items-center justify-center text-[#E06D3B] group-hover:scale-110 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#E06D3B] uppercase block mb-1">
                    01 · Direct Harvest
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Choose Your Way In
                  </h3>
                </div>
                <p className="text-sm text-emerald-100/75 leading-relaxed">
                  Pick any letter, then scroll. Step straight from farm gates into chemical-free, nutrient-dense produce.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E06D3B]" /> 100% Traceable
                </span>
                <span className="font-semibold text-white group-hover:text-[#E06D3B] flex items-center gap-1 transition-colors">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl p-7 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#E06D3B]/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E06D3B]/20 border border-[#E06D3B]/30 flex items-center justify-center text-[#E06D3B] group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#E06D3B] uppercase block mb-1">
                    02 · Quality Standard
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    100% Certified Farms
                  </h3>
                </div>
                <p className="text-sm text-emerald-100/75 leading-relaxed">
                  Grown with sustainable organic practices across Mirpurkhas mango groves, Sargodha citrus, and Potohar honey farms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E06D3B]" /> Verified Growers
                </span>
                <span className="font-semibold text-white group-hover:text-[#E06D3B] flex items-center gap-1 transition-colors">
                  View certificates <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl p-7 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#E06D3B]/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E06D3B]/20 border border-[#E06D3B]/30 flex items-center justify-center text-[#E06D3B] group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#E06D3B] uppercase block mb-1">
                    03 · Local Logistics
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Harvested Daily
                  </h3>
                </div>
                <p className="text-sm text-emerald-100/75 leading-relaxed">
                  Delivered straight from partner farms to delivery hubs in Karachi, Lahore, Islamabad, and Quetta.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E06D3B]" /> Fast Hub Delivery
                </span>
                <span className="font-semibold text-white group-hover:text-[#E06D3B] flex items-center gap-1 transition-colors">
                  Check hubs <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Stats & Trust Strip */}
          <div className="rounded-2xl p-6 bg-[#04160f]/60 border border-emerald-500/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-white font-serif">50+</span>
              <span className="text-xs text-emerald-200/70 font-medium">Partner Farms</span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-[#E06D3B] font-serif">10,000+</span>
              <span className="text-xs text-emerald-200/70 font-medium">Happy Kitchens</span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-white font-serif">24h</span>
              <span className="text-xs text-emerald-200/70 font-medium">Farm-to-Door</span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-[#E06D3B] font-serif">100%</span>
              <span className="text-xs text-emerald-200/70 font-medium">Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </GlyphPortal>
    </div>
  );
}
