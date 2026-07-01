'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, Loader2, Sparkles, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { sounds } from '@/lib/sound-utils';

type PromotionalBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  offerLabel?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  successTitle?: string;
  successDescription?: string;
  promoCode?: string;
  storageKey?: string;
  showOnPaths?: string[];
};

export default function PromotionalBanner({
  eyebrow = 'NOREX FIRST ACCESS',
  title = 'Unlock 15% off your first order',
  description = 'Join the private list for early access to capsule drops, atelier notes, and launch-only offers.',
  offerLabel = 'Signup now and receive your welcome code instantly.',
  inputPlaceholder = 'Enter your email to claim your offer',
  buttonText = 'Claim Offer',
  successTitle = 'You’re on the list',
  successDescription = 'Your welcome offer has been reserved. Use the code below at checkout.',
  promoCode = 'NOREX-INTRO-15',
  storageKey = 'norex-promo-banner-seen',
  showOnPaths = ['/'],
}: PromotionalBannerProps) {
  const pathname = usePathname();
  const { soundEnabled } = useShop();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!showOnPaths.includes(pathname || '/')) {
      setVisible(false);
      return;
    }

    const hasSeen = window.localStorage.getItem(storageKey);
    setVisible(hasSeen !== 'true');
  }, [pathname, showOnPaths, storageKey]);

  const dismissBanner = () => {
    window.localStorage.setItem(storageKey, 'true');
    setVisible(false);
    if (soundEnabled) sounds.playPop();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      if (soundEnabled) sounds.playPop();
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Subscription failed.');

      window.localStorage.setItem(storageKey, 'true');
      setStatus('success');
      if (soundEnabled) sounds.playSuccess();
    } catch (err: any) {
      setStatus('idle');
      setError(err.message || 'The signup service is temporarily unavailable.');
      if (soundEnabled) sounds.playPop();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm sm:px-6">
      <div className="relative w-full max-w-2xl rounded-[24px] border border-[#C9A84C]/25 bg-[#0f0f0f] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-7 lg:p-8">
        <button
          type="button"
          onClick={dismissBanner}
          className="absolute right-3 top-3 rounded-full border border-white/10 p-2 text-zinc-400 transition hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
          aria-label="Dismiss promotional banner"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#C9A84C]">
            <Sparkles className="h-3 w-3" />
            <span>{eyebrow}</span>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {title}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-300 sm:mx-0">
              {description}
            </p>
            <p className="text-sm font-medium text-[#C9A84C]">{offerLabel}</p>
          </div>

          <div className="space-y-3">
            {status === 'success' ? (
              <div className="rounded-sm border border-[#C9A84C]/30 bg-[#C9A84C]/10 p-4 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#C9A84C] sm:justify-start">
                  <Check className="h-4 w-4" />
                  <span>{successTitle}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{successDescription}</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-sm border border-[#C9A84C]/20 bg-black/40 px-3 py-2 text-sm font-semibold text-[#C9A84C]">
                  <span className="font-mono uppercase tracking-[0.25em]">{promoCode}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder={inputPlaceholder}
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#C9A84C] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center rounded-sm bg-[#C9A84C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#b58f3e] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>{buttonText}</span><ArrowRight className="ml-2 h-4 w-4" /></>}
                </button>
              </form>
            )}

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
