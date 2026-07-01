'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Scissors, Layers, CheckCircle2 } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function CraftsmanshipExperience() {
  const { soundEnabled } = useShop()
  const [activeTab, setActiveTab] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleTabClick = (idx: number) => {
    setActiveTab(idx)
    if (soundEnabled) sounds.playSweep()
  }

  const items = [
    {
      title: 'Bespoke Draping & Architecture',
      tag: '01 / Anatomical Drafting',
      image: '/product-4.jpg',
      story: 'Every single luxury bridal corset and custom evening dress silhouette undergoes deep canvas adjustments. Our master tailors trace contours explicitly to structural lines, balancing natural posture configurations with majestic drapes.',
      details: ['Hand-drawn anatomical drafts', 'Custom built-in inner bodices', 'Reinforced double-face seam settings']
    },
    {
      title: 'Premium Textile Provenance',
      tag: '02 / Luxury Material Selection',
      image: '/product-3.png',
      story: 'We source exclusively from certified mills and hand-loomed heritage cooperatives. Across our luminous silk charmeuse, double-plied crepes, and authentic West African textiles, we prioritize thread length for uncompromised longevity.',
      details: ['100% Premium fluid silk charmeuse', 'Hand-woven heritage cotton prints', 'Double-plied clean crepe structures']
    },
    {
      title: 'Artisanal Hand-Finished Accents',
      tag: '03 / Hardware & Closures',
      image: '/machinesew.png',
      story: 'The final layers declare our standard guidelines. From hand-sewn internal bound silk tapes that highlight our construction pipelines to custom crystal beadwork patterns, every single edge passes meticulous quality gates.',
      details: ['Meticulous hand-placed beadwork', 'Contrasting silk internal bound seams', 'Exposed premium zipper rail panels']
    }
  ]

  const goldColor = "#C9A84C";

  return (
    <section className="bg-black text-white px-6 py-24 md:px-8 border-b border-white/10 relative overflow-hidden">
      {/* Structural Backdrop Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Title Block */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">07 // CRAFT IN FOCUS</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            Atelier Craftsmanship
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl font-light">
            Luxury brands live within technical boundaries. Inspect how raw heritage textures, disciplined custom block drapes, and meticulous seam assemblies are engineered into modern elegance.
          </p>
        </div>

        {/* Dynamic Showcase Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Tabs Selector list */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4 text-left">
            {items.map((it, idx) => (
              <button
                key={it.title}
                onClick={() => handleTabClick(idx)}
                style={{
                  borderColor: activeTab === idx ? goldColor : "rgba(255,255,255,0.05)",
                  backgroundColor: activeTab === idx ? "rgba(201,168,76,0.05)" : "transparent"
                }}
                className="p-6 rounded-sm border text-left transition-all duration-300 cursor-pointer hover:border-[#C9A84C]/50"
              >
                <div className="space-y-1">
                  <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold block uppercase">{it.tag}</span>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-lg font-bold text-white uppercase tracking-wider">{it.title}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Active Canvas Panel */}
          <div style={{ backgroundColor: "rgba(26,26,26,0.25)", borderColor: "rgba(255,255,255,0.1)" }} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border rounded-sm p-6 md:p-8 backdrop-blur-md relative overflow-hidden min-h-[400px]">
            
            {/* Visual Image */}
            <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="md:col-span-5 aspect-[3/4] rounded-sm overflow-hidden relative shadow-2xl">
              <img
                src={items[activeTab].image}
                alt={items[activeTab].title}
                className="w-full h-full object-cover"
                style={{ animation: "fadeIn 0.5s ease-out", filter: "contrast(1.02) brightness(0.95)" }}
                key={activeTab}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Visual Specs Description */}
            <div className="md:col-span-7 text-left space-y-5">
              <span style={{ color: goldColor, borderColor: "rgba(201, 168, 76, 0.25)" }} className="text-[8px] font-mono tracking-widest font-bold uppercase border-b pb-1 inline-block">
                {items[activeTab].tag}
              </span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold uppercase text-white tracking-wider leading-none">
                {items[activeTab].title}
              </h3>
              
              <p className="text-xs text-gray-300 font-light leading-relaxed font-serif italic">
                "{items[activeTab].story}"
              </p>

              {/* Bullet checklist points */}
              <div style={{ borderTopColor: "rgba(255,255,255,0.05)" }} className="space-y-2 pt-4 border-t">
                <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">Studio Execution Specifications</h4>
                <ul className="space-y-1.5 text-xs text-gray-400 font-mono list-none p-0 m-0">
                  {items[activeTab].details.map((det) => (
                    <li key={det} className="flex items-center gap-2">
                      <span style={{ color: goldColor }}>•</span>
                      <span className="uppercase text-[10px] tracking-wide text-gray-300">{det}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}