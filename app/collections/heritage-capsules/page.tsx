'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, ShieldCheck, Check, ShoppingBag } from 'lucide-react'

export default function HeritageCapsulesPage() {
  const { soundEnabled, addToCart } = useShop()
  const [stockCount, setStockCount] = useState(14)
  const [addedItem, setAddedItem] = useState(false)

  const handleAcquire = () => {
    if (stockCount > 0) {
      setAddedItem(true)
      if (soundEnabled) sounds.playSuccess()
      
      addToCart({
        id: 'ltd-6',
        slug: 'ankara-fusion-coord-ltd',
        name: 'Ankara Fusion Co-ord Set (LTD)',
        price: 68000,
        category: 'Limited Edition',
        gender: 'Both',
        description: 'Rare laboratory capsule blending premium hand-matched Ankara patterns with strict unisex structural block drapes.',
        images: ['/product-6-new.jpeg'],
        sizes: ['M'],
        colors: ['Multi-print'],
        featured: true,
        inStock: true
      }, 1)

      setTimeout(() => {
        setAddedItem(false)
        setStockCount(prev => prev - 1)
      }, 1500)
    }
  }

  const goldColor = "#C9A84C"

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-24 md:py-32 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.04),_transparent,_transparent)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-left space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span style={{ color: goldColor, letterSpacing: "0.25em" }} className="text-[10px] font-mono uppercase font-black flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>THE HERITAGE REGISTRY VAULT</span>
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }} className="tracking-tight uppercase">
              Heritage Capsules
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Rare laboratory drops hand-constructed in strictly numbered editions, showcasing custom hand-matched traditional textiles and organic cotton bases.
            </p>
          </div>

          {/* Product showcase card with stock counter */}
          <div style={{ borderColor: "#f0ebe3" }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FAF7F4] border rounded-sm p-6 md:p-10">
            
            {/* Image panel */}
            <div style={{ borderColor: "#f0ebe3" }} className="lg:col-span-7 aspect-[4/3] rounded-sm overflow-hidden bg-white border relative">
              <img src="/product-6-new.jpeg" alt="Norex Ankara Fusion Co-ord Limited Edition" className="w-full h-full object-cover filter grayscale contrast-[1.02] hover:grayscale-0 transition-all duration-[1000ms]" />
              <div style={{ backgroundColor: "#1a1a1a", letterSpacing: "0.15em" }} className="absolute top-4 left-4 text-primary-foreground font-mono text-[8px] px-3 py-1 uppercase rounded-sm font-black shadow-md">
                REGISTRY NO. {100 - stockCount}/100
              </div>
            </div>

            {/* Acquisition panel */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="space-y-2">
                <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">CAPSULE 01 // INDIVIDUAL RELEASE</span>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1a1a1a]">Ankara Fusion Co-ord Set</h2>
                <div style={{ color: goldColor }} className="text-2xl font-black font-mono">{formatPrice(68000)}</div>
              </div>

              {/* Dynamic Availability Counter */}
              <div style={{ borderColor: "rgba(201,168,76,0.25)", backgroundColor: "rgba(201,168,76,0.03)" }} className="p-4 border rounded-sm space-y-2">
                <div style={{ color: goldColor }} className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span>Atelier Allocation Status:</span>
                  <span>{stockCount > 0 ? `${stockCount} Pieces Remaining` : 'Fully Allocated'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all duration-1000" style={{ backgroundColor: goldColor, width: `${(stockCount / 50) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-light font-mono">
                  Once exhausted, this specific print configuration will not be repeated inside our active training cycles.
                </p>
              </div>

              {/* Materials summary */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-muted-foreground block">Atelier Composition Parameters</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Premium Wax Cotton', 'Hand-Matched Pattern Alignments', 'Breathable Structural Interlining'].map(m => (
                    <span key={m} style={{ borderColor: "#e5e7eb" }} className="px-3 py-1 bg-white border text-[9px] font-mono rounded-sm text-foreground uppercase tracking-widest font-bold">{m}</span>
                  ))}
                </div>
              </div>

              {/* Buy CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleAcquire}
                  disabled={stockCount === 0 || addedItem}
                  className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    addedItem
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 cursor-default'
                      : stockCount === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                        : 'bg-[#1a1a1a] text-white hover:bg-[#C9A84C] shadow-md hover:scale-[1.01] cursor-pointer'
                  }`}
                >
                  {addedItem ? (
                    <>
                      <Check className="h-4.5 w-4.5 animate-bounce" />
                      <span>Allocation Secured</span>
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
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: goldColor }} />
                  <span>Includes signature hand-numbered booklet & documentation card</span>
                </div>
              </div>

            </div>

          </div>

          {/* Inspiration Story */}
          <div style={{ borderTopColor: "#f0ebe3" }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t pt-12 text-left">
            <div className="lg:col-span-5 space-y-4">
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">THE ZERO WASTE GRID</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700 }} className="uppercase text-[#1a1a1a] leading-tight">
                Nesting Pattern Optimization
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                To construct this limited drop, our design academy pattern cutters implemented an asymmetric puzzle grid to arrange print segments together, dropping textile waste margins down to 2.8%. Residual offcuts are immediately gathered and upcycled into patchwork details.
              </p>
            </div>
            <div style={{ borderColor: "#f0ebe3" }} className="lg:col-span-7 aspect-[21/9] bg-secondary rounded-sm overflow-hidden border">
              <img src="/runway/bts-06.avif" alt="Zero waste grid print alignment" className="w-full h-full object-cover filter grayscale contrast-[1.02]" />
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}