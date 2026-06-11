'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, Play } from 'lucide-react'
import Link from 'next/link'

export default function PluvialDropPage() {
  const { soundEnabled } = useShop()

  const sLooks = [
    { id: '05', image: '/product-6-new.jpeg', garment: 'Ankara Fusion Co-ord Set', model: 'Davidson Obenne' },
    { id: '03', image: '/product-3.png', garment: 'Wine Wrap Midi Dress', model: 'Mayowa Nicholas' },
    { id: '07', image: '/runway/look-04.avif', garment: 'Fluid Crepe Slit Separates', model: 'Mona Tougaard' },
    { id: '02', image: '/product-5.jpeg', garment: 'Lightweight Canvas Blazer', model: 'Anok Yai' }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C"

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section style={{ borderColor: "#f0ebe3" }} className="relative w-full aspect-[21/9] min-h-[360px] overflow-hidden bg-[#FAF7F4] flex items-center justify-center border-b">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('/product-6-new.jpeg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-x-6 bottom-8 z-10 max-w-7xl mx-auto text-left space-y-2.5">
          <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: goldColor }} className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-black">
            <Sparkles className="h-3 w-3" />
            <span>THE PLUVIAL DROP 2026</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }} className="tracking-tighter uppercase">
            Pluvial Ease & Geometric Prints
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-wider max-w-xl">
            An exploration of airy silhouettes, adjustable wrap ties, and breathable wax fabrics configured to glide gracefully through humid coastal atmospheres.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-12 text-left space-y-16">
        
        {/* Campaign Story */}
        <div style={{ borderBottomColor: "#f0ebe3" }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b pb-12">
          <div className="lg:col-span-5 space-y-4">
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CAMPAIGN PLOT LINE</span>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl font-bold uppercase text-[#1a1a1a] leading-tight">
              Ethereal Rain-Season Venting.
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Shot across the coastal landscapes and water channels near Warri, the Pluvial campaign documents clothing managing rain-season humidity indexes. Our textiles—premium wax cotton selections and flowing deep wine crepe weaves—are tailored with adjustable tie lengths and relaxed cuts to support optimal ventilation.
            </p>
          </div>
          <div style={{ borderColor: "#f0ebe3" }} className="lg:col-span-7 aspect-[16/10] bg-secondary rounded-sm overflow-hidden border">
            <img src="/runway/bts-07.avif" alt="Norex lightweight design block layouts" className="w-full h-full object-cover filter grayscale contrast-[1.01]" />
          </div>
        </div>

        {/* Seasonal Palette Block */}
        <div className="space-y-6">
          <div>
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CLIMATIC CHROMATICS</span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-[#1a1a1a]">Pluvial Palette</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Warm Ivory', hex: '#FAF9F6', rgb: 'RGB 250 249 246', desc: 'Reflective base lining' },
              { name: 'Clay Ochre', hex: '#C48B60', rgb: 'RGB 196 139 96', desc: 'Traditional earth layers' },
              { name: 'Norex Gold', hex: '#C9A84C', rgb: 'RGB 201 168 76', desc: 'Signature visual accents' },
              { name: 'Delta Sage', hex: '#7A8B7B', rgb: 'RGB 122 139 123', desc: 'Breathable canvas items' }
            ].map((col) => (
              <div key={col.name} style={{ borderColor: "#f0ebe3" }} className="p-4 border bg-white rounded-sm flex flex-col gap-4 text-left">
                <div style={{ backgroundColor: col.hex, borderColor: "#f0ebe3" }} className="h-16 w-full rounded-sm border shadow-inner" />
                <div>
                  <h4 className="text-xs font-bold text-[#1a1a1a]">{col.name}</h4>
                  <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{col.rgb}</p>
                  <p className="text-[10px] text-gray-400 font-light mt-1">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lookbook Collection Grid */}
        <div className="space-y-6">
          <div>
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">VISUAL RUNWAY INDEX</span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-[#1a1a1a]">Pluvial Drop Looks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sLooks.map((look) => (
              <Link 
                key={look.id}
                href="/runway"
                onClick={handleInteract}
                className="group relative cursor-pointer flex flex-col justify-between text-decoration-none"
              >
                <div style={{ borderColor: "#e5e7eb" }} className="aspect-[3/4] w-full rounded-sm overflow-hidden bg-secondary border group-hover:border-[#C9A84C]/50 transition-all duration-300">
                  <img src={look.image} alt={look.garment} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="mt-3 text-left">
                  <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">LOOK {look.id}</span>
                  <h4 className="text-xs font-bold text-[#1a1a1a] truncate mt-0.5">{look.garment}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{look.model}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Behind the Collection */}
        <div style={{ borderColor: "#f0ebe3" }} className="p-8 border bg-[#FAF7F4] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="max-w-xl space-y-2">
            <span style={{ color: goldColor }} className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider block">EXPERIENCE ACCESS</span>
            <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a]">Behind the Blueprint Documentary</h4>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Explore the raw audio feeds, digital layout swatch boards, fitting captures, and loom configurations utilized by pattern specialists to assemble our rain-season drop.
            </p>
          </div>
          <Link 
            href="/runway/fashion-films"
            onClick={handleInteract}
            style={{ backgroundColor: goldColor }}
            className="px-6 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-lg hover:bg-[#B49542]"
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