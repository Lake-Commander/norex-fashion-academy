'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import Link from 'next/link'

export default function RunwayArchive() {
  const { soundEnabled } = useShop()
  const [activeSeason, setActiveSeason] = useState<string>('SS25')

  const seasons = [
    {
      id: 'FW25',
      name: 'Autumn / Winter 2025',
      tag: 'COLLECTION // SERIES 04',
      image: '/product-5.jpeg',
      venue: 'The Federal Palace, Victoria Island, Lagos',
      story: 'An exploration in raw high-density textiles, tailored power blazers, and deep cultural contours. FW25 deconstructed heavy structured outer shells, emphasizing tailored alignment maps.',
      highlights: ['Structured Power Blazers', 'Asymmetric Traditional Wraps', 'Bespoke Evening Capes']
    },
    {
      id: 'SS25',
      name: 'Spring / Summer 2025',
      tag: 'COLLECTION // SERIES 03',
      image: '/product-6-new.jpeg',
      venue: 'Main Atelier Showroom, Warri, Delta State',
      story: 'Fluid canvas constructs and vibrant Ankara elements engineered to respond cleanly to postural changes and active motion. We integrated relaxed crop frames with flowing broad trousers.',
      highlights: ['Ankara Fusion Co-ords', 'Luminous Silk Coordinates', 'Bespoke Linen Slits']
    },
    {
      id: 'FW24',
      name: 'Autumn / Winter 2024',
      tag: 'COLLECTION // SERIES 02',
      image: '/product-3.png',
      venue: 'Eko Atlantic Pavilion, Lagos',
      story: 'Classical tailoring guidelines reimagined with heavy deep-tone crepe textiles. Highlighted adjustable wrap closures and detailed midi profiles with functional tailored accents.',
      highlights: ['Deep Wine Wrap Silhouettes', 'Forest Green Blazers', 'Tailored Corporate Cuts']
    },
    {
      id: 'SS24',
      name: 'Spring / Summer 2024',
      tag: 'COLLECTION // SERIES 01',
      image: '/product-1.png',
      venue: 'The Civic Centre, Victoria Island, Lagos',
      story: 'Flagship luxury evening gowns and high-fashion bridal baselines. Celebrating the uncompromised flow of pure silk charmeuse across majestic midnight, gold, and white configurations.',
      highlights: ['Crimson Evening Gowns', 'Ivory Cathedral Ensembles', 'Hand-Sewn Bodice Beadwork']
    }
  ]

  const handleSelectSeason = (seasonId: string) => {
    setActiveSeason(seasonId)
    if (soundEnabled) sounds.playSweep()
  }

  const selected = seasons.find(s => s.id === activeSeason) || seasons[0]
  const goldColor = "#C9A84C";

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 transition-colors duration-500 relative">
      <style>{`
        .timeline-selector-card {
          border: 1px solid #f0ebe3; background-color: white; padding: 2rem;
          border-radius: 2px; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;
        }
        .archive-dot {
          absolute; left: -26px; top: 6px; h-3 w-3 rounded-full border transition-all duration-300;
        }
      `}</style>
      
      {/* Decorative backdrop blur */}
      <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.02)" }} />

      <div className="mx-auto max-w-7xl">
        
        {/* Title row */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">10 // THE ARCHIVE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight leading-none">
            Runway Archive
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl font-light">
            A visual timeline of the house's past seasonal collections. Browse show venues, highlights, and structural silhouettes across our history.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Timeline Selector */}
          <div className="lg:col-span-4 timeline-selector-card">
            <div className="space-y-4">
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-bold uppercase block mb-6">
                ARCHIVE TIMELINE
              </span>
              
              <div style={{ borderLeftColor: "#f0ebe3" }} className="relative border-l pl-6 space-y-8 text-left">
                {seasons.map((s) => {
                  const isActive = activeSeason === s.id
                  return (
                    <div key={s.id} onClick={() => handleSelectSeason(s.id)} className="relative cursor-pointer group">
                      <span 
                        className="absolute -left-[32px] top-1 h-3 w-3 rounded-full border transition-all duration-300" 
                        style={{
                          backgroundColor: isActive ? goldColor : 'white',
                          borderColor: isActive ? goldColor : '#d1d5db',
                          transform: isActive ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                      <div className="space-y-0.5">
                        <span style={{ color: isActive ? goldColor : '#9ca3af' }} className="text-xs font-mono font-bold tracking-wider block">
                          {s.id}
                        </span>
                        <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className={`text-base font-bold uppercase transition-colors ${isActive ? 'text-[#1a1a1a]' : 'text-gray-400 group-hover:text-[#1a1a1a]'}`}>
                          {s.name.split(' ')[0]} {s.name.split(' ')[s.name.split(' ').length - 1]}
                        </h4>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Link
              href="/editorial"
              style={{ color: goldColor, borderTop: "1px solid #f0ebe3" }}
              className="inline-flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#1a1a1a] transition-colors pt-5 mt-6 w-full text-decoration-none"
            >
              <span>Open Campign Gazette</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Right Widescreen Details Panel */}
          <div style={{ backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.05)" }} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border rounded-sm p-6 md:p-8 relative min-h-[400px]">
            
            {/* Image Box */}
            <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="md:col-span-5 aspect-[3/4] rounded-sm overflow-hidden relative shadow-2xl bg-[#FAF7F4]">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover filter contrast-[1.02]"
                style={{ animation: "fadeIn 0.5s ease-out" }}
                key={activeSeason}
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Details content */}
            <div className="md:col-span-7 text-left space-y-6">
              <div className="space-y-1">
                <span style={{ color: goldColor, borderBottomColor: "rgba(201, 168, 76, 0.25)" }} className="text-[8px] font-mono tracking-widest font-bold uppercase border-b pb-1 inline-block">
                  {selected.tag}
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl md:text-3xl font-bold uppercase text-white tracking-wider leading-none">
                  {selected.name}
                </h3>
                <span style={{ letterSpacing: "0.05em" }} className="text-[10px] font-mono text-gray-400 uppercase block pt-1">{selected.venue}</span>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed font-serif italic">
                "{selected.story}"
              </p>

              <div style={{ borderTopColor: "rgba(255,255,255,0.05)" }} className="space-y-2 pt-4 border-t">
                <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">Key Collection Pieces</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selected.highlights.map((h) => (
                    <span 
                      key={h}
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                      className="px-3 py-1 rounded-sm border text-gray-300 font-mono text-[9px] uppercase tracking-wider"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}