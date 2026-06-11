'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Play, Maximize2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SpringSummerPage() {
  const { soundEnabled } = useShop()

  const sLooks = [
    { id: '04', image: '/runway/look-04.avif', garment: 'Liquid Silk Shift Dress', model: 'Vittoria Ceretti' },
    { id: '02', image: '/runway/look-02.avif', garment: 'Asymmetric Canvas Parka', model: 'Mona Tougaard' },
    { id: '05', image: '/runway/look-05.avif', garment: 'Structured Gabardine Trouser Set', model: 'Kaia Gerber' },
    { id: '08', image: '/runway/look-08.avif', garment: 'Asymmetric Blazer & Short', model: 'Gigi Hadid' }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full aspect-[21/9] min-h-[360px] overflow-hidden bg-black flex items-center justify-center border-b border-border/40">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 grayscale" style={{ backgroundImage: "url('/runway/look-04.avif')" }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-6 bottom-8 z-10 max-w-7xl mx-auto text-left space-y-2.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-white/20 bg-white/10 rounded-full text-[8px] font-mono tracking-widest text-white uppercase font-black">
            <Sparkles className="h-3 w-3" />
            <span>SPRING / SUMMER 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading text-white tracking-tighter uppercase">
            Solstice & Kinetic Lines
          </h1>
          <p className="text-xs text-gray-300 font-mono tracking-wider max-w-xl">
            An exploration of floating structures that catch natural wind and accelerate curves in warm environments.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-12 text-left space-y-16">
        
        {/* Campaign Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">CAMPAIGN NARRATIVE</span>
            <h2 className="text-3xl font-serif font-black uppercase text-foreground leading-tight">
              Ethereal Movement.
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Filmed on location in the sweeping sandy fields of Long Island, the Spring / Summer campaign captures garments reacting to high heat index and light velocity. The fabrics—weighted crepe silk and Belgian flax linen—are configured to drape effortlessly, providing organic ventilation without sacrificing silhouette margins.
            </p>
          </div>
          <div className="lg:col-span-7 aspect-[16/10] bg-secondary rounded-3xl overflow-hidden border border-border/30">
            <img src="/runway/bts-07.avif" alt="SS fitting backstage" className="w-full h-full object-cover grayscale" />
          </div>
        </div>

        {/* Seasonal Palette Block */}
        <div className="space-y-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">COLOR CHROMATICS</span>
            <h3 className="text-xl font-bold uppercase tracking-wide mt-1">Seasonal Palette</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Warm Ivory', hex: '#FAF9F6', rgb: 'RGB 250 249 246', desc: 'Reflective base layers' },
              { name: 'Brushed Sage', hex: '#B5C0AD', rgb: 'RGB 181 192 173', desc: 'Organic silk weaves' },
              { name: 'Champagne Gold', hex: '#D4AF37', rgb: 'RGB 212 175 55', desc: 'Atelier metal hardware' },
              { name: 'Parisian Charcoal', hex: '#36454F', rgb: 'RGB 54 69 79', desc: 'Contrast shadow pleats' }
            ].map((col) => (
              <div key={col.name} className="p-4 border border-border/40 bg-card/15 rounded-2xl flex flex-col gap-4 text-left">
                <div className="h-16 w-full rounded-xl border border-border/20 shadow-inner" style={{ backgroundColor: col.hex }} />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{col.name}</h4>
                  <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{col.rgb}</p>
                  <p className="text-[10px] text-foreground/60 font-light mt-1">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lookbook Collection Grid */}
        <div className="space-y-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">VISUAL RUNWAY INDEX</span>
            <h3 className="text-xl font-bold uppercase tracking-wide mt-1">S26 Collection Looks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sLooks.map((look) => (
              <Link 
                key={look.id}
                href="/runway"
                onClick={handleInteract}
                className="group relative cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-secondary border border-border/30 group-hover:border-foreground/35 transition-all">
                  <img src={look.image} alt={look.garment} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="mt-3 text-left">
                  <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">LOOK {look.id}</span>
                  <h4 className="text-xs font-bold text-foreground truncate mt-0.5">{look.garment}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{look.model}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Behind the Collection */}
        <div className="p-8 border-2 border-dashed border-border/40 bg-card/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="max-w-xl space-y-2">
            <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">EXPERIENCE ACCESS</span>
            <h4 className="text-lg font-bold uppercase tracking-wide">Behind the Collection Documentary</h4>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Explore the raw audio files, digital swatches, fitting captures, and loom configurations utilized by pattern makers to realize the Solstice launch.
            </p>
          </div>
          <Link 
            href="/runway/fashion-films"
            onClick={handleInteract}
            className="px-6 py-3 bg-primary text-primary-foreground hover:bg-accent font-bold text-xs uppercase tracking-widest rounded-full transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Watch Film</span>
          </Link>
        </div>

      </div>

      <StyleOracle />
      <Footer />
    </main>
  )
}
