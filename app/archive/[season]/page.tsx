'use client'

import { use, useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Calendar, ArrowLeft, History } from 'lucide-react'
import Link from 'next/link'

interface SeasonData {
  title: string
  theme: string
  history: string
  lookDescription: string
  image: string
  looks: { id: string; garment: string; image: string }[]
}

const archiveDatabase: Record<string, SeasonData> = {
  ss24: {
    title: 'Spring / Summer 2024',
    theme: 'Obsidian Minimal',
    history: 'The launch of ORLIEN. We focused on clean monochrome shades, light cotton poplins, and establishing core draping ratios.',
    lookDescription: 'Raw cotton layers and minimal belts.',
    image: '/runway/look-02.avif',
    looks: [
      { id: '01', garment: 'Minimal Poplin Shirt', image: '/runway/look-02.avif' },
      { id: '02', garment: 'Bound Seam Canvas Pant', image: '/runway/look-04.avif' }
    ]
  },
  fw24: {
    title: 'Autumn / Winter 2024',
    theme: 'Freezing Vectors',
    history: 'An investigation into extreme insulation shapes. Melton wool envelopes and wind-resistant zippers was the main focus.',
    lookDescription: 'Heavy coat tailors and storm guards.',
    image: '/runway/look-11.avif',
    looks: [
      { id: '03', garment: 'Heavy Melton Duster', image: '/runway/look-11.avif' },
      { id: '04', garment: 'Insulated Flight Hood', image: '/runway/look-03.avif' }
    ]
  },
  ss25: {
    title: 'Spring / Summer 2025',
    theme: 'Kinetic Bias',
    history: 'We introduced bias-cut panels and three-dimensional pattern cards, letting fabric flow naturally along human movement vectors.',
    lookDescription: 'Bias satin drapes and linen robes.',
    image: '/runway/look-07.avif',
    looks: [
      { id: '05', garment: 'Liquid Crepe Slip', image: '/runway/look-04.avif' },
      { id: '06', garment: 'Coarse Linen Robe Set', image: '/runway/look-07.avif' }
    ]
  },
  fw25: {
    title: 'Autumn / Winter 2025',
    theme: 'Monolith Canvas',
    history: 'Exploring Brutalist utility profiles. Heavy waxed canvases, storm hoods, and zero-waste pattern layouts took center stage.',
    lookDescription: 'Waxed canvas shells and raw utility.',
    image: '/runway/look-01.avif',
    looks: [
      { id: '07', garment: 'Waxed Utility Anorak', image: '/runway/look-01.avif' },
      { id: '08', garment: 'Structured Corset Waistcoat', image: '/runway/look-05.avif' }
    ]
  }
}

export default function ArchiveSeasonPage({ params }: { params: Promise<{ season: string }> }) {
  const { season } = use(params)
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const seasonKey = season?.toLowerCase() || 'ss24'
  const data = archiveDatabase[seasonKey] || archiveDatabase.ss24

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 border-b border-border/40 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          {/* Breadcrumb back */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-mono border-b border-border/30 pb-4">
            <Link href="/archive" onClick={handleInteract} className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Archive</span>
            </Link>
            <span>/</span>
            <span>{seasonKey.toUpperCase()} Vault</span>
          </div>

          {/* Title Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black">
                ARCHIVED FRAMEWORK
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight leading-none">
                {data.title}
              </h1>
              <p className="text-xs text-primary font-mono font-bold uppercase tracking-wider">{data.theme}</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-light font-serif">
                {data.history}
              </p>
            </div>
            
            <div className="lg:col-span-7 aspect-[21/9] bg-secondary rounded-2xl overflow-hidden border border-border/30">
              <img src={data.image} alt="" className="w-full h-full object-cover grayscale" />
            </div>
          </div>

          {/* Lookbook Gallery list */}
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary font-black flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span>SIGNATURE LOOKS DECK</span>
              </span>
              <h3 className="text-xl font-bold uppercase tracking-wide mt-1">Look Breakdown</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.looks.map(look => (
                <div key={look.id} className="p-4 border border-border/40 bg-card/25 rounded-2xl flex gap-4 text-left items-center">
                  <div className="w-20 h-28 rounded-xl overflow-hidden bg-secondary border border-border/30 shrink-0">
                    <img src={look.image} alt="" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-primary font-black uppercase">LOOK {look.id}</span>
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">{look.garment}</h4>
                    <p className="text-xs text-muted-foreground font-light">{data.lookDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Vault Note */}
          <div className="p-6 bg-secondary/35 border border-border/40 rounded-2xl text-[11px] leading-relaxed text-muted-foreground font-mono">
            Historical Note: All specifications regarding {data.title} are stored in deep vault allocations. Fabric certifications (GOTS/GRS) are linked back to original supplier ledgers to confirm absolute authenticity.
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
