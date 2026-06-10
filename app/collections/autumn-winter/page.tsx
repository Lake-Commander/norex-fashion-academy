'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AutumnWinterPage() {
  const { soundEnabled } = useShop()

  const wLooks = [
    { id: '11', image: '/runway/look-11.avif', garment: 'Brutalist Oversized Coat', model: 'Leon Dame' },
    { id: '03', image: '/runway/look-03.avif', garment: 'Brutalist Leather Aviator', model: 'Leon Dame' },
    { id: '16', image: '/runway/look-16.avif', garment: 'Cybernetic Wool Bomber', model: 'Gigi Hadid' },
    { id: '01', image: '/runway/look-01.avif', garment: 'Deconstructed Twill Trench', model: 'Anok Yai' }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <main className="min-h-screen bg-black text-[#faf9f6] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full aspect-[21/9] min-h-[360px] overflow-hidden bg-black flex items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale" style={{ backgroundImage: "url('/runway/look-11.avif')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-6 bottom-8 z-10 max-w-7xl mx-auto text-left space-y-2.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-primary/40 bg-primary/10 rounded-full text-[8px] font-mono tracking-widest text-primary uppercase font-black">
            <Sparkles className="h-3 w-3" />
            <span>AUTUMN / WINTER 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading text-white tracking-tighter uppercase">
            Brutalist Shadows & Wool
          </h1>
          <p className="text-xs text-gray-300 font-mono tracking-wider max-w-xl">
            Heavy wool envelopes, double-breasted aviator shields, and structured canvas bombers tailored for freezing atmospheric speeds.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-12 text-left space-y-16">
        
        {/* Campaign Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">WINTER SHIELD RECORD</span>
            <h2 className="text-3xl font-serif font-black uppercase text-white leading-tight">
              Dense Textures.
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Shot against the raw monolithic concrete structures of upstate New York, the Autumn / Winter campaign focuses on protective envelope shapes. Boiled wool combined with drum-dyed sheepskins form dense shells that repel cold air indices while retaining a loose, editorial silhouette posture.
            </p>
          </div>
          <div className="lg:col-span-7 aspect-[16/10] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10">
            <img src="/runway/bts-01.avif" alt="AW fitting backstage" className="w-full h-full object-cover grayscale" />
          </div>
        </div>

        {/* Seasonal Palette Block */}
        <div className="space-y-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">CHROMATIC DECKS</span>
            <h3 className="text-xl font-bold uppercase tracking-wide mt-1 text-white">Seasonal Chromatics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Obsidian Gold', hex: '#d4af37', rgb: 'RGB 212 175 55', desc: 'Hardware coatings' },
              { name: 'Slate Charcoal', hex: '#2F3542', rgb: 'RGB 47 53 66', desc: 'Melton wool coatings' },
              { name: 'Forest Moss', hex: '#2C3E2B', rgb: 'RGB 44 62 43', desc: 'Atelier military layers' },
              { name: 'Matte Onyx', hex: '#111111', rgb: 'RGB 17 17 17', desc: 'Heavy cowhide bases' }
            ].map((col) => (
              <div key={col.name} className="p-4 border border-white/10 bg-zinc-900/40 rounded-2xl flex flex-col gap-4 text-left">
                <div className="h-16 w-full rounded-xl border border-white/5 shadow-inner" style={{ backgroundColor: col.hex }} />
                <div>
                  <h4 className="text-xs font-bold text-white">{col.name}</h4>
                  <p className="text-[9px] font-mono text-gray-500 mt-0.5">{col.rgb}</p>
                  <p className="text-[10px] text-gray-400 font-light mt-1">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lookbook Collection Grid */}
        <div className="space-y-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">VISUAL RUNWAY INDEX</span>
            <h3 className="text-xl font-bold uppercase tracking-wide mt-1 text-white">AW26 Collection Looks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wLooks.map((look) => (
              <Link 
                key={look.id}
                href="/runway"
                onClick={handleInteract}
                className="group relative cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-white/25 transition-all">
                  <img src={look.image} alt={look.garment} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="mt-3 text-left">
                  <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">LOOK {look.id}</span>
                  <h4 className="text-xs font-bold text-white truncate mt-0.5">{look.garment}</h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{look.model}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Behind the Collection */}
        <div className="p-8 border border-white/10 bg-zinc-900/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="max-w-xl space-y-2">
            <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">EXPERIENCE ACCESS</span>
            <h4 className="text-lg font-bold uppercase tracking-wide text-white">Behind the Collection Film</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Explore the raw audio files, digital swatches, fitting captures, and loom configurations utilized by pattern makers to realize the Winter launch.
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
