'use client'

import { Sparkles, Globe, Heart, ShieldCheck } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function Sustainability() {
  const { soundEnabled } = useShop()
  const goldColor = "#C9A84C";

  const categories = [
    {
      icon: ShieldCheck,
      title: 'Ethical Local Alliances',
      desc: 'We map and audit our complete West African supply chain. Every single textile loom artisan and embroidery specialist is backed by clear, fair-wage parameters, ensuring healthy workspaces.'
    },
    {
      icon: Heart,
      title: 'Responsible Fabrication',
      desc: 'Prioritizing pure silk charmeuse layers, premium lightweight linens, and circular cotton materials. Our fabrics are hand-dyed to preserve natural integrity and avoid ground-water impacts.'
    },
    {
      icon: Globe,
      title: 'The Academy Loop',
      desc: 'We design for total circularity. Through pattern card puzzle nesting and student workshops inside our design academy, Norex transforms residual fabric remnants into creative upcycled modules.'
    }
  ]

  const handleHover = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 relative overflow-hidden">
      <style>{`
        .sustain-pillar-card {
          border: 1px solid #f0ebe3; background-color: white; padding: 2rem;
          border-radius: 2px; transition: all 0.3s ease; text-align: left;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .sustain-pillar-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.04);
        }
      `}</style>
      
      {/* Decorative Blur Nodes */}
      <div className="absolute bottom-0 left-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.02)" }} />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">12 // THE FUTURE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-black font-heading text-foreground uppercase tracking-tight leading-none">
            Sustainability & Vision
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl font-light">
            Designing custom wardrobe pieces with longevity requires protecting our raw textile ecosystems. Explore our foundational parameters.
          </p>
        </div>

        {/* 3-Column minimalist panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.title} onMouseEnter={handleHover} className="sustain-pillar-card">
                <div className="space-y-4">
                  <div style={{ backgroundColor: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.1)" }} className="rounded-sm p-3 text-[#C9A84C] w-fit border">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold text-foreground uppercase tracking-wider">{cat.title}</h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-light mt-6">
                  {cat.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}