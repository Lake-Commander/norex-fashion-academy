'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import {
  Sparkles,
  Truck,
  RefreshCw,
  Scissors,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Mail
} from 'lucide-react'
import Link from 'next/link'

type Tab = 'shipping' | 'returns' | 'sizing' | 'faq'

const tabItems: Array<{ id: Tab; label: string; icon: typeof Truck }> = [
  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
  { id: 'returns', label: 'Returns & Exchange', icon: RefreshCw },
  { id: 'sizing', label: 'Garment Sizing Guides', icon: Scissors },
  { id: 'faq', label: 'Support FAQ', icon: HelpCircle }
]

const featureCards = [
  {
    title: 'Worldwide Concierge Support',
    description: 'Personal service for every order, from virtual fittings to expedited customs clearance.',
    icon: ShieldCheck
  },
  {
    title: 'Atelier Pickup',
    description: 'Same-day collection from the studio with premium packaging and hand-finished checks.',
    icon: MapPin
  },
  {
    title: 'Fast Global Routing',
    description: 'Express delivery powered by environmentally responsible logistics partners.',
    icon: Truck
  },
  {
    title: '24/7 Order Tracking',
    description: 'Real-time visibility with premium support notifications across every shipment.',
    icon: Clock
  }
]

export default function CustomerCarePage() {
  const { soundEnabled } = useShop()
  const [activeTab, setActiveTab] = useState<Tab>('shipping')

  // Automatically switch tabs if an incoming URL anchor parameter specifies a block match
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as Tab;
      if (['shipping', 'returns', 'sizing', 'faq'].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    if (soundEnabled && (window as any).soundEnabled !== false) sounds.playClick()
    setActiveTab(tab)
  }

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden pt-20 text-left">
      <Header />

      <div className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at top right, rgba(201, 168, 76, 0.1), transparent 42%)'
            }}
          />
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-zinc-400 font-mono font-bold">
                  <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                  <span>Customer Care Workspace</span>
                </div>
                <div className="space-y-4">
                  <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl md:text-6xl font-black uppercase leading-tight text-zinc-900">
                    Luxury support for every order.
                  </h1>
                  <p className="max-w-2xl text-sm text-zinc-500 leading-7 font-light">
                    From atelier pickup to express global routing, our service philosophy is built for premium fashion houses. Every delivery, return, and fit guide is designed to feel as refined as the garments themselves.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-bold">Premium Concierge</p>
                    <h2 className="mt-4 text-2xl font-bold uppercase tracking-tight">24/7 global support</h2>
                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-light">
                      Speak to our service atelier any time for orders, delivery upgrades, or bespoke return arrangements.
                    </p>
                  </div>

                  <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-bold">Fast Fulfillment</p>
                    <h2 className="mt-4 text-2xl font-bold uppercase tracking-tight">Same-day studio pickup</h2>
                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-light">
                      Collect your order at the atelier or schedule a bespoke courier pickup with zero wait time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="relative overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-sm">
                    <img
                      src="/runway/hero-banner.avif"
                      onError={(e)=>{e.currentTarget.src="/placeholder-garment.png"}}
                      alt="Studio packaging"
                      className="w-full h-80 object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute left-6 bottom-6 text-white text-left">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-bold">Studio Dispatch</p>
                      <h2 className="mt-2 text-xl font-bold uppercase">Hand-checked & ready.</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Matrix Block */}
        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm text-left">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-zinc-50 border text-[#C9A84C]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-zinc-900">{feature.title}</h3>
                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ⚡ Tab Navigation Block Framework with target layout markers */}
        <section id="faq" className="mx-auto max-w-7xl px-6 pb-24 md:px-8 scroll-mt-24">
          <div className="mb-10 text-left">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-zinc-400 font-mono font-bold">
              <span>Service Blueprint</span>
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="mt-4 text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900">
              Premium Protocols Ledger
            </h2>
          </div>

          {/* Tab Anchors Anchor Triggers */}
          <div className="flex flex-wrap gap-2 border-b pb-6">
            {tabItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`inline-flex items-center gap-2 rounded-sm border px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    isActive
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Shared Content Workspace Viewport Box */}
          <div className="mt-6 rounded-sm border border-zinc-200 bg-white p-8 shadow-sm">
            
            {activeTab === 'shipping' && (
              <div id="shipping" className="space-y-6 animate-fade-in scroll-mt-32">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase font-bold text-[#C9A84C]">Shipping & Delivery Matrix</p>
                  <h3 className="text-xl font-bold uppercase text-zinc-900">Global premium routing protocols.</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl font-light">Each shipment is managed by our logistics partners and packaged in custom presentation boxes. Delivery estimates are synchronized for high-priority coutures.</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-sm border p-5 bg-zinc-50/50 text-left">
                    <p className="text-[9px] font-mono uppercase text-zinc-400 font-bold">Domestic Standard</p>
                    <p className="mt-3 text-lg font-black font-mono text-zinc-900">2 - 3 Days</p>
                    <p className="mt-2 text-xs text-zinc-400 font-light">Carbon-neutral courier loops with priority routing across Nigeria hubs.</p>
                  </div>
                  <div className="rounded-sm border p-5 bg-zinc-50/50 text-left">
                    <p className="text-[9px] font-mono uppercase text-zinc-400 font-bold">Atelier Pickup</p>
                    <p className="mt-3 text-lg font-black font-mono text-[#C9A84C]">Same Day</p>
                    <p className="mt-2 text-xs text-zinc-400 font-light">Ready within 24 hours at our central Warri studio station nodes.</p>
                  </div>
                  <div className="rounded-sm border p-5 bg-zinc-50/50 text-left">
                    <p className="text-[9px] font-mono uppercase text-zinc-400 font-bold">International Express</p>
                    <p className="mt-3 text-lg font-black font-mono text-zinc-900">5 - 7 Days</p>
                    <p className="mt-2 text-xs text-zinc-400 font-light">Premium air freight integration with end-to-end milestone passport trackers.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div id="returns" className="space-y-6 animate-fade-in scroll-mt-32">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase font-bold text-[#C9A84C]">Returns & Exchanges</p>
                  <h3 className="text-xl font-bold uppercase text-zinc-900">Luxury flexibility framework.</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl font-light">We accept unworn, original condition items within 14 days and support sizing and silhouette exchanges seamlessly.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 text-left">
                  <div className="p-5 border bg-zinc-50/30 rounded-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Conditions Registry</h4>
                    <ul className="list-none p-0 m-0 space-y-2 text-xs text-zinc-400 font-light">
                      <li>• Keep garments unwashed, untouched, with protective swatches intact.</li>
                      <li>• Bespoke tailor passes from our Atelier pipeline are final sale nodes.</li>
                    </ul>
                  </div>
                  <div className="p-5 border bg-zinc-50/30 rounded-sm space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Dispatch Return Path</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">Transmit a passport transaction request to <a href="mailto:hello@norexfashion.com" className="text-[#C9A84C] font-bold">hello@norexfashion.com</a> to generate an express courier label sheet.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div id="sizing" className="space-y-6 animate-fade-in scroll-mt-32">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase font-bold text-[#C9A84C]">Precision Sizing Guides</p>
                  <h3 className="text-xl font-bold uppercase text-zinc-900">Anatomical sizing reference metrics.</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl font-light">Review standard layout indices below. For automated fits, log into your user dashboard profile console.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 text-left">
                  <div className="p-4 border bg-zinc-50 rounded-sm space-y-2">
                    <h4 className="text-xs font-bold uppercase text-zinc-900">Couture Tops & Cuts</h4>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">S:</strong> 34" - 36" chest line</p>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">M:</strong> 38" - 40" chest line</p>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">L:</strong> 42" - 44" chest line</p>
                  </div>
                  <div className="p-4 border bg-zinc-50 rounded-sm space-y-2">
                    <h4 className="text-xs font-bold uppercase text-zinc-900">Tailored Inseam Trousers</h4>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">30:</strong> 30" - 31" waist alignment</p>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">32:</strong> 32" - 33" waist alignment</p>
                    <p className="text-xs text-zinc-400 font-mono"><strong className="text-zinc-700">34:</strong> 34" - 35" waist alignment</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase font-bold text-[#C9A84C]">Support FAQ Matrix</p>
                  <h3 className="text-xl font-bold uppercase text-zinc-900">Answers for the discerning client.</h3>
                </div>
                <div className="space-y-4 text-left">
                  <div className="p-4 border rounded-sm bg-zinc-50/50">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase">Can international clients book custom fits?</h4>
                    <p className="text-xs text-zinc-400 mt-2 font-light">Yes. Digital consultations are fully active. Coordinate profiles inside your master dashboard nodes cleanly.</p>
                  </div>
                  <div className="p-4 border rounded-sm bg-zinc-50/50">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase">Where are the garments tailored and shipped from?</h4>
                    <p className="text-xs text-zinc-400 mt-2 font-light">Every order is processed, hand-finished, and dispatched from our design atelier center in Warri, Delta State, Nigeria.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      <StyleOracle />
      <Footer />
    </main>
  )
}