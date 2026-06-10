'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { ArrowRight, Compass, Sparkles, Layers } from 'lucide-react'
import Link from 'next/link'

export default function CollectionsPage() {
  const { soundEnabled } = useShop()
  const [activeCollection, setActiveCollection] = useState<'all' | 'ss' | 'aw' | 'limited'>('all')

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const collectionsList = [
    {
      id: 'ss',
      tag: 'SPRING / SUMMER 2026',
      title: 'Solstice & Kinetic Lines',
      image: '/runway/look-04.avif',
      desc: 'Floating silk structures and deconstructed linen knits capture the biological motion curves of summer breeze.',
      path: '/collections/spring-summer',
      colors: ['bg-[#f5ebe0]', 'bg-[#d5bdaf]', 'bg-[#e3d5ca]']
    },
    {
      id: 'aw',
      tag: 'AUTUMN / WINTER 2026',
      title: 'Brutalist Shadows & Wool',
      image: '/runway/look-11.avif',
      desc: 'Oversized storm coats, heavy Melton wool blocks, and double-breasted outlines tailored for winter shields.',
      path: '/collections/autumn-winter',
      colors: ['bg-[#111111]', 'bg-[#36454f]', 'bg-[#5c4033]']
    },
    {
      id: 'limited',
      tag: 'EXCLUSIVE CAPSULE',
      title: 'Bespoke Atelier 01',
      image: '/runway/look-01.avif',
      desc: 'Strictly limited run of 50 hand-numbered leather aviators and raw denim, featuring GOTS certified fibers.',
      path: '/collections/limited-edition',
      colors: ['bg-[#d4af37]', 'bg-[#1c1c1c]', '#ffffff']
    }
  ]

  const filtered = activeCollection === 'all'
    ? collectionsList
    : collectionsList.filter(col => col.id === activeCollection)

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-left space-y-8">
          
          {/* Header Masthead */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 animate-spin-slow" />
              <span>THE ARCHITECTURAL LAB</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none text-foreground">
              Collections
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Explore seasonal launches and limited laboratory capsules from the ORLIEN design offices.
            </p>
          </div>

          {/* Collection Filter Buttons */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none border-b border-border/20">
            {[
              { id: 'all', label: 'All Launches' },
              { id: 'ss', label: 'Spring / Summer' },
              { id: 'aw', label: 'Autumn / Winter' },
              { id: 'limited', label: 'Limited Edition' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (soundEnabled) sounds.playSweep()
                  setActiveCollection(btn.id as any)
                }}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                  activeCollection === btn.id
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-foreground/60 hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Collections Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {filtered.map((col) => (
              <div 
                key={col.id}
                onMouseEnter={handleInteract}
                className="group flex flex-col justify-between bg-card/20 border border-border/40 hover:border-foreground/30 rounded-3xl overflow-hidden p-5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Image Block */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-secondary border border-border/30">
                    <img 
                      src={col.image} 
                      alt={col.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-100" 
                    />
                    <div className="absolute top-4 left-4 bg-black/75 px-3 py-1 rounded text-[8px] text-white font-mono tracking-widest uppercase">
                      {col.tag}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2 text-left">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-foreground">
                      {col.title}
                    </h2>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed font-serif">
                      {col.desc}
                    </p>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="pt-6 mt-6 border-t border-border/20 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {col.colors.map((c, i) => (
                      <span key={i} className={`h-3.5 w-3.5 rounded-full border border-foreground/10 ${c}`} />
                    ))}
                  </div>

                  <Link
                    href={col.path}
                    onClick={handleInteract}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent flex items-center gap-1.5 group/btn"
                  >
                    <span>View Launch</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Collection Manifesto Section */}
          <div className="border-t border-border/40 pt-16 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] text-primary uppercase font-black flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                <span>DESIGN PHILOSOPHY</span>
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-black uppercase text-foreground leading-tight">
                "We do not design collections for a single season. We design frameworks for a generation."
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-light">
                Every ORLIEN release builds upon core tailors and patterns established in our New York studio. The cuts adapt to posture and velocity variations, bridging structural fashion with technical performance.
              </p>
            </div>
            <div className="lg:col-span-7 aspect-[16/9] w-full rounded-3xl overflow-hidden bg-secondary border border-border/30">
              <img src="/runway/bts-04.avif" alt="Atelier Swatches" className="w-full h-full object-cover grayscale" />
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
