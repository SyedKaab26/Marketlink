'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import type { QuizResponse } from '@/lib/types';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (quizData: QuizResponse) => void;
}

export default function QuizModal({ isOpen, onClose, onComplete }: QuizModalProps) {
  const [step, setStep] = useState(1);
  const [zipcode, setZipcode] = useState('15201');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Organic', 'Gluten-free']);
  const [shoppingType, setShoppingType] = useState('Weekly Subscription');
  const householdSize = 2;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const quizPayload = {
      zipcode,
      dietary_prefs: selectedTags,
      shopping_type: shoppingType,
      household_size: householdSize
    };

    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizPayload)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      onComplete(quizPayload);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F9F6F0] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D5] relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#EAE3D2] flex items-center justify-center text-[#1D3E2E] hover:bg-[#DED5C0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-[#E06D3B]' : s < step ? 'w-3 bg-[#1D3E2E]' : 'w-3 bg-[#E0D8C8]'
              }`}
            />
          ))}
          <span className="ml-auto text-xs font-semibold text-[#8B7355] uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Zipcode */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#E06D3B] uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Neighborhood Check
              </span>
              <h2 className="font-serif text-3xl text-[#1D3E2E] font-bold">
                Let’s see if MarketLink delivers to your neighborhood!
              </h2>
              <p className="text-sm text-[#4E6358]">
                We group deliveries by neighborhood to cut delivery miles by 85%.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1D3E2E] uppercase">ZIP Code</label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="e.g. 15201"
                className="w-full text-lg px-4 py-3 rounded-2xl bg-white border border-[#D5CCBA] text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B] font-semibold"
              />
            </div>

            <button
              disabled={!zipcode.trim()}
              onClick={() => setStep(2)}
              className="w-full bg-[#E06D3B] hover:bg-[#C85A29] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Dietary & Values */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#E06D3B] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Personalize Your Box
              </span>
              <h2 className="font-serif text-3xl text-[#1D3E2E] font-bold">
                What dietary values matter to you?
              </h2>
              <p className="text-sm text-[#4E6358]">
                Select any preferences so we can customize your pre-filled cart.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {['Organic', 'Gluten-free', 'Vegan', 'Non-GMO', 'Fair trade', 'Soy-free'].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#1D3E2E] text-white border-[#1D3E2E] shadow-sm'
                        : 'bg-white text-[#1D3E2E] border-[#D5CCBA] hover:border-[#1D3E2E]'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#E06D3B]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-full border border-[#D5CCBA] text-[#1D3E2E] font-semibold hover:bg-[#EAE3D2]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 bg-[#E06D3B] hover:bg-[#C85A29] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Shopping Type */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-[#1D3E2E] font-bold">
                How do you want to shop MarketLink?
              </h2>
              <p className="text-sm text-[#4E6358]">
                You can swap, skip, or cancel anytime before your weekly cutoff.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShoppingType('Weekly Subscription')}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  shoppingType === 'Weekly Subscription'
                    ? 'bg-[#1D3E2E] text-white border-[#1D3E2E] shadow-md'
                    : 'bg-white text-[#1D3E2E] border-[#D5CCBA]'
                }`}
              >
                <div className="font-bold text-base flex items-center justify-between">
                  <span>Weekly Pre-Filled Cart (Recommended)</span>
                  {shoppingType === 'Weekly Subscription' && <Check className="w-5 h-5 text-[#E06D3B]" />}
                </div>
                <p className={`text-xs mt-1 ${shoppingType === 'Weekly Subscription' ? 'text-[#C4D6CB]' : 'text-[#6B7C72]'}`}>
                  We auto-populate your cart with fresh seasonal favorites. Swap out what you don’t need.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setShoppingType('One-Time Order')}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  shoppingType === 'One-Time Order'
                    ? 'bg-[#1D3E2E] text-white border-[#1D3E2E] shadow-md'
                    : 'bg-white text-[#1D3E2E] border-[#D5CCBA]'
                }`}
              >
                <div className="font-bold text-base flex items-center justify-between">
                  <span>Shop From Scratch</span>
                  {shoppingType === 'One-Time Order' && <Check className="w-5 h-5 text-[#E06D3B]" />}
                </div>
                <p className={`text-xs mt-1 ${shoppingType === 'One-Time Order' ? 'text-[#C4D6CB]' : 'text-[#6B7C72]'}`}>
                  Build your cart 100% manually whenever you feel like ordering.
                </p>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 rounded-full border border-[#D5CCBA] text-[#1D3E2E] font-semibold hover:bg-[#EAE3D2]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-2/3 bg-[#E06D3B] hover:bg-[#C85A29] text-white font-bold py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Build My Cart <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
