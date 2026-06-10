'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, ArrowRight, ShieldCheck, Check, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function LimitedEditionPage() {
  const { soundEnabled, addToCart } = useShop()
  const [stockCount, setStockCount] = useState(14)
  const [addedItem, setAddedItem] = useState(false)

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleAcquire = () => {
    if (stockCount > 0) {
      setAddedItem(true)
      if (soundEnabled) sounds.playSuccess()
      
      // Fixed: Passed a structurally valid Product object matching the schema
      addToCart({
        id: 'ltd-5',
        slug: 'deconstructed-twill-trench-ltd',
        name: 'Deconstructed Twill Trench (LTD)',
        price: 290000,
        category: 'Limited Edition',
        gender: 'Both',
        description: 'Rare laboratory capsule made in limited numbers, with hand-numbered tags and GOTS-certified fibers.',
        images: ['/runway/look-01.avif'],
        sizes: ['M'],
        colors: ['Ltd Tan'],
        featured: true,
        inStock: true
      }, 1)

      setTimeout(() => {
        setAddedItem(false)
        setStockCount(prev => prev - 1)
      }, 1500)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-left space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>THE EXCLUSIVE VAULT</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none text-foreground">
              Limited Edition
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Rare laboratory capsules made in limited numbers, with hand-numbered tags and GOTS-certified fibers.
            </p>
          </div>

          {/* Product showcase card with stock counter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-card/10 border border-primary/20 rounded-3xl p-6 md:p-10 glass-panel">
            
            {/* Image panel */}
            <div className="lg:col-span-7 aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border/30 relative">
              <img src="/runway/look-01.avif" alt="Deconstructed Twill Trench Ltd Edition" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1000ms]" />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-mono text-[8px] tracking-widest px-3 py-1 uppercase rounded font-black shadow-lg">
                TAG NO. {100 - stockCount}/100
              </div>
            </div>

            {/* Acquisition panel */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="space-y-2">
                <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">CAPSULE 01 // INDIVIDUAL RELEASE</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Deconstructed Twill Trench</h2>
                <div className="text-2xl font-black text-primary font-mono">{formatPrice(290000)}</div>
              </div>

              {/* Dynamic Availability Counter */}
              <div className="p-4 border border-primary/30 bg-primary/5 rounded-2xl space-y-2">
                <div className="flex justify-between text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                  <span>Vault Allocation Status:</span>
                  <span>{stockCount > 0 ? `${stockCount} Units Available` : 'Fully Allocated'}</span>
                </div>
                <div className="w-full bg-secondary/80 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(stockCount / 50) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-light font-mono">
                  Once exhausted, this specific cut will not be repeated in this season configuration.
                </p>
              </div>

              {/* Materials summary */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-muted-foreground">Signature Materials</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Long-Staple Aegean Cotton', 'Genuine Horn Buckle', 'Double-Plied Gabardine'].map(m => (
                    <span key={m} className="px-3 py-1 bg-secondary/35 border border-border/40 text-[9px] font-mono rounded-lg text-foreground uppercase tracking-widest font-bold">{m}</span>
                  ))}
                </div>
              </div>

              {/* Buy CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleAcquire}
                  disabled={stockCount === 0 || addedItem}
                  className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    addedItem
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                      : stockCount === 0
                        ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
                        : 'bg-primary text-primary-foreground hover:bg-accent shadow-lg shadow-primary/20 hover:scale-[1.01] cursor-pointer'
                  }`}
                >
                  {addedItem ? (
                    <>
                      <Check className="h-4.5 w-4.5 animate-bounce" />
                      <span>Registry Secured</span>
                    </>
                  ) : stockCount === 0 ? (
                    <span>Fully Allocated</span>
                  ) : (
                    <>
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>Secure Limited Capsule</span>
                    </>
                  )}
                </button>
                <div className="flex justify-center items-center gap-1.5 text-[9px] font-mono text-muted-foreground uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Includes hand-numbered physical booklet & authentication card</span>
                </div>
              </div>

            </div>

          </div>

          {/* Inspiration Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-border/40 pt-12 text-left">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">DESIGN BLUEPRINT</span>
              <h3 className="text-2xl font-serif font-black uppercase text-foreground leading-tight">
                Zero Waste Cutting Algorithm
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed font-light">
                To realize this limited release, pattern cutters utilized an optimization grid to puzzle panels close together, minimizing canvas wastage to under 2.8%. Residual swatches are gathered and re-spun back into secondary details, creating a zero-waste loop.
              </div>
            </div>
            <div className="lg:col-span-7 aspect-[21/9] bg-secondary rounded-2xl overflow-hidden border border-border/30">
              <img src="/runway/bts-06.avif" alt="Zero waste grid pattern cutting" className="w-full h-full object-cover grayscale" />
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}