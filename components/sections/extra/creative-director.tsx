'use client'

import { Sparkles } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function CreativeDirector() {
  const { soundEnabled } = useShop()
  const goldColor = "#C9A84C";

  return (
    <section className="bg-black text-white px-6 py-24 md:px-8 border-b border-white/10 relative overflow-hidden">
      
      {/* Decorative Blur Nodes */}
      <div 
        className="absolute top-1/2 left-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full" 
        style={{ backgroundColor: "rgba(201, 168, 76, 0.02)" }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Title */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">11 // THE DIRECTOR NOTE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            Creative Director Note
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl font-light">
            A statement regarding structural design discipline, architectural evening wear lines, and our dual blueprint of couture craft and training.
          </p>
        </div>

        {/* Layout: Photo + Letter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Photo Frame */}
          <div style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }} className="lg:col-span-5 relative overflow-hidden rounded-sm shadow-2xl aspect-[3/4] group">
            <img 
              src="/runway/bts-14.avif" 
              alt="Bespoke drafting lines in the Norex Studio" 
              className="w-full h-full object-cover scale-[1.01] group-hover:scale-100 transition-transform duration-1000 filter grayscale contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 text-left text-white space-y-1">
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-bold uppercase block">THE DESIGN BLUEPRINT</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-lg font-bold uppercase tracking-wide text-white">NOREX FASHION ATELIER</h3>
            </div>
          </div>

          {/* Letter Frame */}
          <div className="lg:col-span-7 text-left space-y-6 md:space-y-8 max-w-2xl">
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", borderColor: "rgba(255,255,255,0.1)" }} className="text-2xl font-bold uppercase text-white tracking-wide border-b pb-4">
              A Message from Our Creative Team
            </h3>
            
            {/* The Letter Body */}
            <div className="space-y-6 text-sm text-gray-300 font-light leading-relaxed font-serif italic text-justify">
              <p>
                "At Norex Fashion, we approach clothing design not as transient, shifting trends, but as structural permanence. The configurations we balance inside our Warri production studio are physical records of geometric line maps, luxury weights, and heritage patterns."
              </p>
              <p>
                "For our active design season, our absolute focus rested on anatomical equilibrium. Intertwining fluid, rich silk charmeuse fabrics with high-density traditional textiles allows our evening gowns and unisex coordinates to contour naturally to body motion curves without surrendering a sharp, tailored form."
              </p>
              <p>
                "Through our world-class design academy, we systematically transfer these elite bespoke metrics directly to the next generation of creative minds. Settle into an intentional language of West African elegance engineered to endure beyond the moment."
              </p>
            </div>

            {/* Signature Block */}
            <div style={{ borderTopColor: "rgba(255,255,255,0.05)" }} className="pt-6 border-t flex flex-col items-start gap-1 font-mono">
              <span style={{ color: goldColor, letterSpacing: "0.25em" }} className="text-[10.5px] font-bold uppercase block">Office of the Creative Director</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">NOREX FASHION HOUSE // ACADEMY STATIONS</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}