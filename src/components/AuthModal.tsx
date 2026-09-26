'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail, User, Loader2, Store, MapPin } from 'lucide-react';
import type { User as UserProfile } from '@/lib/types';
import { setStoredUser } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<'customer' | 'farmer'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, location, role })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setStoredUser(data.user);
        onLoginSuccess(data.user);
        onClose();
        if (data.user.role === 'admin') {
          router.push('/dashboard');
        } else if (data.user.role === 'farmer') {
          router.push('/farmer');
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F9F6F0] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D5] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#EAE3D2] flex items-center justify-center text-[#1D3E2E] hover:bg-[#DED5C0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 space-y-1">
          <h2 className="font-serif text-3xl font-bold text-[#1D3E2E]">
            {isLogin ? 'Welcome Back' : 'Create Your MarketLink Account'}
          </h2>
          <p className="text-sm text-[#5B6F64]">
            {isLogin ? 'Log in to manage your weekly cart & delivery' : 'Join 10,000+ members supporting local farms'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#1D3E2E] uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3.5 text-[#8B7355]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Lauren Oliver"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#D5CCBA] text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#1D3E2E] uppercase mb-1">City / Location (Required) *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3.5 text-[#8B7355]" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Clifton, Karachi or Model Town, Lahore"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#D5CCBA] text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#1D3E2E] uppercase mb-2">I want to join as</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'customer' as const, label: 'Customer', icon: User },
                  { value: 'farmer' as const, label: 'Farmer / Vendor', icon: Store }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-xs font-bold transition-colors ${role === value ? 'border-[#E06D3B] bg-[#FFF0E8] text-[#C85A29]' : 'border-[#D5CCBA] bg-white text-[#5B6F64] hover:border-[#E06D3B]'}`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1D3E2E] uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3.5 text-[#8B7355]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#D5CCBA] text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D3E2E] uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3.5 text-[#8B7355]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#D5CCBA] text-[#1D3E2E] focus:outline-none focus:ring-2 focus:ring-[#E06D3B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D3E2E] hover:bg-[#142D21] text-white font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
              </>
            ) : isLogin ? (
              'Log In to MarketLink'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#5B6F64]">
          {isLogin ? "Don't have an account yet?" : 'Already a MarketLink member?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-[#E06D3B] hover:underline ml-1"
          >
            {isLogin ? 'Sign up free' : 'Log in here'}
          </button>
        </div>

      </div>
    </div>
  );
}
