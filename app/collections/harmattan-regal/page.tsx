'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, Play } from 'lucide-react'
import Link from 'next/link'

export default function HarmattanRegalPage() {
  const { soundEnabled } = useShop()

  const wLooks = [
    { id: '01', image: '/product-1.png', garment: 'Crimson Evening Gown', model: 'Mayowa Nicholas' },
    { id: '04', image: '/product-5.jpeg', garment: 'Structured Power Blazer', model: 'Anok Yai' },
    { id: '06', image: '/product-7-new.jpeg', garment: 'Noir Cocktail Dress', model: 'Davidson Obenne' },
    { id: '02', image: '/product-4.jpg', garment: 'Ivory Bridal Ensemble', model: 'Adesuwa Aighewi' }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-black text-[#faf9f6] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full aspect-[21/9] min-h-[360px] overflow-hidden bg-black flex items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('/product-1.png')" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-x-6 bottom-8 z-10 max-w-7xl mx-auto text-left space-y-2.5">
          <div style={{ borderColor: "rgba(201,168,76,0.4)", backgroundColor: "rgba(201,168,76,0.1)", color: goldColor }} className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-black">
            <Sparkles className="h-3 w-3" />
            <span>HARMATTAN REGAL 2026</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Majestic Lines & Silk Architecture
          </h1>
          <p className="text-xs text-gray-400 font-mono tracking-wider max-w-xl">
            Luminous silk charmeuse envelopes, structured tailored shields, and heavy double-plied crepes designed for peak festive celebration postures.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-12 text-left space-y-16">
        
        {/* Campaign Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-12">
          <div className="lg:col-span-5 space-y-4">
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">COUTURE FRAMEWORK RECORD</span>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl font-bold uppercase text-white leading-tight">
              Dense Textures & Fluid Radiance.
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Captured against the architectural monolithic backlines of the Civic Centre in Lagos, Harmattan Regal centers explicitly on grand evening statements. Premium hand-finished silks combine with structural underwire matrices, forging silhouettes that assert an absolute couture presence throughout the high-wedding and gala cycle.
            </p>
          </div>
          <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="lg:col-span-7 aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden border">
            <img src="/runway/bts-01.avif" alt="Norex couture lining fitting processes" className="w-full h-full object-cover grayscale contrast-[1.05]" />
          </div>
        </div>

        {/* Seasonal Palette Block */}
        <div className="space-y-6">
          <div>
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CHROMATIC SPECTRUMS</span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-white">Harmattan Chromatics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Ovia Gold', hex: '#C9A84C', rgb: 'RGB 201 168 76', desc: 'Atelier structural hardware' },
              { name: 'Crimson Silk', hex: '#9E1B32', rgb: 'RGB 158 27 50', desc: 'Luminous charmeuse drapes' },
              { name: 'Burgundy Crepe', hex: '#58111A', rgb: 'RGB 88 17 26', desc: 'Bespoke corporate lining' },
              { name: 'Matte Onyx', hex: '#111111', rgb: 'RGB 17 17 17', desc: 'Heavy canvas bases' }
            ].map((col) => (
              <div key={col.name} style={{ borderColor: "rgba(255,255,255,0.05)" }} className="p-4 border bg-zinc-900/40 rounded-sm flex flex-col gap-4 text-left">
                <div style={{ backgroundColor: col.hex, borderColor: "rgba(255,255,255,0.05)" }} className="h-16 w-full rounded-sm border shadow-inner" />
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
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">ATELIER RUNWAY INDEX</span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-white">Harmattan Regal Looks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wLooks.map((look) => (
              <Link 
                key={look.id}
                href="/runway"
                onClick={handleInteract}
                className="group relative cursor-pointer flex flex-col justify-between text-decoration-none"
              >
                <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="aspect-[3/4] w-full rounded-sm overflow-hidden bg-zinc-900 border group-hover:border-[#C9A84C]/50 transition-all duration-300">
                  <img src={look.image} alt={look.garment} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="mt-3 text-left">
                  <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">LOOK {look.id}</span>
                  <h4 className="text-xs font-bold text-white truncate mt-0.5">{look.garment}</h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{look.model}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Behind the Collection */}
        <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="p-8 border bg-zinc-900/30 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="max-w-xl space-y-2">
            <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">EXPERIENCE RECORD</span>
            <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-lg font-bold uppercase tracking-wide text-white">Behind the Blueprint Documentary</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Explore the raw pattern cards, material swatch maps, sizing metrics, and behind-the-scenes fitting captures recorded by our academy trainers to realize the Harmattan release.
            </p>
          </div>
          <Link 
            href="/runway/fashion-films"
            onClick={handleInteract}
            style={{ backgroundColor: goldColor }}
            className="px-6 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10 hover:bg-[#B49542]"
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