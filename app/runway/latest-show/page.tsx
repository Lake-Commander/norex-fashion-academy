'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const looks = [
  { id: '01', image: '/runway/look-01.avif', model: 'Anok Yai', garment: 'Deconstructed Twill Trench', comment: 'Re-imagining the collar structure. It holds shape under speed.' },
  { id: '02', image: '/runway/look-02.avif', garment: 'Asymmetric Canvas Parka', model: 'Mona Tougaard', comment: 'Focusing on deep side-flaps. It catches wind beautifully.' },
  { id: '03', image: '/runway/look-03.avif', garment: 'Brutalist Leather Aviator', model: 'Leon Dame', comment: 'Tailored for posture curves. Crushed leather adds rich texture.' },
  { id: '04', image: '/runway/look-04.avif', garment: 'Liquid Silk Shift Dress', model: 'Vittoria Ceretti', comment: 'Bias panel layouts flow naturally during dynamic strides.' }
]

export default function LatestShowPage() {
  const { soundEnabled } = useShop()
  const [selectedLook, setSelectedLook] = useState<number | null>(null)

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleOpenLightbox = (idx: number) => {
    if (soundEnabled) sounds.playChord()
    setSelectedLook(idx)
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-border/40 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          {/* Header & Show Opening */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black">
              LIVE FROM THE ATELIER
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none">
              Latest Show
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Show Opening: Solstice & Kinetic Structures. Broadcast live from the concrete docks.
            </p>
          </div>

          {/* Collection Introduction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-primary font-black">COLLECTION INTRO</span>
              <h2 className="text-2xl font-serif font-black uppercase text-foreground">
                Tension & Gravity
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground font-light">
                Our latest collection tests the physical constraints of fabrics under biological motion. Every piece was cut using a zero-waste puzzle algorithm, leaving only 2.8% scrap fabric. Standard trench profiles are split into dynamic panels, allowing for fluid motion curves during posture changes.
              </p>
            </div>
            <div className="lg:col-span-7 aspect-[21/9] bg-secondary rounded-2xl overflow-hidden border border-border/30">
              <img src="/runway/hero-banner.avif" alt="Runway Staging Intro" className="w-full h-full object-cover grayscale" />
            </div>
          </div>

          {/* Runway Gallery (Look Breakdown) */}
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary font-black">RUNWAY INDEX</span>
              <h3 className="text-xl font-bold uppercase tracking-wide mt-1">Featured Looks</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {looks.map((look, idx) => (
                <div 
                  key={look.id}
                  onClick={() => handleOpenLightbox(idx)}
                  onMouseEnter={handleInteract}
                  className="group relative cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-secondary border border-border/30 group-hover:border-primary/40 transition-all">
                    <img src={look.image} alt={look.garment} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">LOOK {look.id}</span>
                    <h4 className="text-xs font-bold text-foreground truncate mt-0.5">{look.garment}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Designer Commentary Q&A */}
          <div className="border-t border-border/40 pt-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <Quote className="h-8 w-8 text-primary/10 absolute top-4 left-4" />
            <span className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase font-black">ATELIER DIRECTIVE LOGS</span>
            <blockquote className="text-xl font-light italic text-foreground leading-relaxed mt-4 font-heading">
              "We wanted to escape static profiles. Fashion lives in movement. Silhouettes must flow, stretch, and compress like living structures."
            </blockquote>
            <cite className="text-xs font-mono tracking-widest block uppercase mt-4 text-muted-foreground">— Studio Design Lead</cite>
          </div>

        </div>
      </section>

      {/* Lightbox details */}
      {selectedLook !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedLook(null)} />
          <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 text-left shadow-2xl z-10 animate-slide-in-right glass-panel">
            <div className="flex justify-between items-center pb-4 border-b border-border/35 mb-4">
              <span className="text-xs font-mono font-bold text-primary">LOOK Breakdown // L-{looks[selectedLook].id}</span>
              <button 
                onClick={() => setSelectedLook(null)} 
                className="p-1.5 rounded-full hover:bg-secondary text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              <div className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden bg-secondary border border-border/35">
                <img src={looks[selectedLook].image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="sm:col-span-7 space-y-4 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase text-foreground">{looks[selectedLook].garment}</h3>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">MODEL SPEC: {looks[selectedLook].model}</div>
                </div>
                <div className="p-4 bg-secondary/40 border border-border/30 rounded-xl space-y-1">
                  <span className="text-[8px] font-mono text-primary font-black uppercase tracking-wider">STUDIO LOG</span>
                  <p className="text-xs font-serif italic text-muted-foreground">"{looks[selectedLook].comment}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <StyleOracle />
      <Footer />
    </main>
  )
}
