'use client'

import { Sparkles } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function GlobalPresence() {
  const { soundEnabled } = useShop()

  const stats = [
    { num: '3,500+', label: 'Bespoke Masterworks', sub: 'Hand-finished tailored pieces' },
    { num: '500+', label: 'Academy Graduates', sub: 'Certified pattern specialists' },
    { num: '12K+', label: 'Society Community', sub: 'Active local & global registry profiles' }
  ]

  const handleHover = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <section className="bg-black text-white px-6 py-28 md:py-36 md:px-8 border-b border-white/10 relative overflow-hidden flex items-center justify-center">
      <style>{`
        .presence-stat-card {
          padding: 2rem; border: 1px solid rgba(255,255,255,0.05); background-color: rgba(26,26,26,0.3); 
          transition: all 0.3s ease; border-radius: 2px; text-center: center; 
          display: flex; flex-direction: column; justify-content: center; min-h-[200px];
        }
        .presence-stat-card:hover {
          border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.05);
        }
      `}</style>
      
      {/* Decorative backdrop grid */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A84C]/2 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10 text-center space-y-16">
        
        {/* Title */}
        <div className="space-y-4">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-2">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">13 // RECOGNITION METRICS</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            The Studio Footprint
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
            Delivering detailed luxury silhouettes and strict structural dress custom training hand-by-hand across the nation.
          </p>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((st) => (
            <div 
              key={st.label}
              onMouseEnter={handleHover}
              className="presence-stat-card"
            >
              <h3 style={{ color: goldColor }} className="text-5xl md:text-6xl font-black font-heading leading-none tracking-tight mb-4">
                {st.num}
              </h3>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {st.label}
                </p>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  {st.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}