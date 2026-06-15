'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Maximize2, X, ChevronLeft, ChevronRight, Quote, Loader2, Sparkles } from 'lucide-react'

interface RunwayLookItem {
  _id: string;
  collectionId: string;
  lookNumber: string;
  type: "look" | "backstage";
  image: string;
  garmentName?: string;
  modelName?: string;
  commentary: string;
}

interface CollectionData {
  _id: string;
  title: string;
  slug: string;
  waSeason: "Pluvial Drop" | "Harmattan Regal" | "August Break" | "Sultry Heat";
  campaignPlot: string;
  coverImage: string;
}

export default function LatestShowPage() {
  const { soundEnabled } = useShop()
  const [collection, setCollection] = useState<CollectionData | null>(null)
  const [looks, setLooks] = useState<RunwayLookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLook, setSelectedLook] = useState<number | null>(null)

  useEffect(() => {
    async function loadLatestShowRegistry() {
      try {
        const res = await fetch("/api/runway")
        const data = await res.json()
        
        if (data.success && data.collections?.length > 0) {
          // The collections endpoint returns items sorted by latest creation date natively
          const activeShow = data.collections[0]
          setCollection(activeShow)
          
          // Filter out look documents belonging explicitly to the active collection container
          const lookbookSet = data.looks.filter(
            (l: RunwayLookItem) => l.collectionId === activeShow._id && l.type === "look"
          )
          setLooks(lookbookSet)
        }
      } catch (err) {
        console.error("Failed synchronizing live runway sequence streams:", err)
      } finally {
        setLoading(false)
      }
    }
    loadLatestShowRegistry()
  }, [])

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleOpenLightbox = (idx: number) => {
    if (soundEnabled) sounds.playChord()
    setSelectedLook(idx)
  }

  const handlePrevLook = () => {
    if (selectedLook !== null) {
      setSelectedLook(prev => (prev !== null && prev > 0 ? prev - 1 : looks.length - 1))
      if (soundEnabled) sounds.playPop()
    }
  }

  const handleNextLook = () => {
    if (selectedLook !== null) {
      setSelectedLook(prev => (prev !== null && prev < looks.length - 1 ? prev + 1 : 0))
      if (soundEnabled) sounds.playPop()
    }
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
            <h1 style={{ fontFamily: "var(--font-heading), sans-serif" }} className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-zinc-900">
              Latest Show
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Broadcast coordinates direct from the atelier production floors.
            </p>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Syncing Runway Coordinates...</p>
            </div>
          ) : !collection ? (
            <p className="text-center font-mono text-zinc-400 text-xs uppercase py-12 border border-dashed border-zinc-200">No dynamic runway shows deployed inside panel registries.</p>
          ) : (
            <>
              {/* Collection Introduction Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-12">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {collection.waSeason} SEASON OVERVIEW
                  </span>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-serif font-black uppercase text-foreground">
                    {collection.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground font-light text-justify font-sans">
                    {collection.campaignPlot}
                  </p>
                </div>
                <div className="lg:col-span-7 aspect-[21/9] bg-secondary rounded-sm overflow-hidden border border-border/30">
                  <img src={collection.coverImage || "/placeholder-garment.png"} alt="Runway Staging Intro" className="w-full h-full object-cover filter grayscale contrast-[1.01]" />
                </div>
              </div>

              {/* Runway Gallery (Look Breakdown) */}
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">RUNWAY INDEX MAPS</span>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1">Featured Looks</h3>
                </div>
                
                {looks.length === 0 ? (
                  <p className="text-zinc-400 font-mono text-xs uppercase text-left py-6">No specific silhouettes pinned to this collection node loop yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {looks.map((look, idx) => (
                      <div 
                        key={look._id}
                        onClick={() => handleOpenLightbox(idx)}
                        onMouseEnter={handleInteract}
                        className="group relative cursor-pointer flex flex-col justify-between"
                      >
                        <div className="aspect-[3/4] w-full rounded-sm overflow-hidden bg-secondary border border-border/30 group-hover:border-[#C9A84C] transition-all duration-300">
                          <img src={look.image || "/placeholder-garment.png"} alt={look.garmentName} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        <div className="mt-3 text-left">
                          <span className="text-[8px] font-mono text-[#C9A84C] font-bold uppercase tracking-wider">LOOK {look.lookNumber}</span>
                          <h4 className="text-xs font-bold text-zinc-900 truncate mt-0.5 uppercase tracking-wide">{look.garmentName || "Atelier Silhouette"}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Designer Commentary Quote Anchor */}
              <div className="border-t border-border/40 pt-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                <Quote className="h-8 w-8 text-zinc-100 absolute top-4 left-4 pointer-events-none" />
                <span className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase font-black">ATELIER DIRECTIVE FRAMEWORK NOTES</span>
                <blockquote style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-light italic text-foreground leading-relaxed mt-4">
                  "Fashion design lives dynamically inside physical movement. Silhouette parameters must bend, stretch, and flow gracefully across West African environmental contexts."
                </blockquote>
                <cite className="text-xs font-mono tracking-widest block uppercase mt-4 text-muted-foreground font-bold">— Norex Design Office</cite>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Lightbox Slider Layout Details Modal Stage */}
      {selectedLook !== null && looks[selectedLook] && (
        <div className="fixed inset-0 z-50 bg-black/96 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedLook(null)} />
          <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-sm p-6 text-left shadow-2xl z-10">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 mb-4">
              <span className="text-xs font-mono font-bold text-[#C9A84C] uppercase">LOOK BREAKDOWN MATRIX // L-{looks[selectedLook].lookNumber}</span>
              <button 
                type="button"
                onClick={() => setSelectedLook(null)} 
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 aspect-[3/4] rounded-sm overflow-hidden bg-zinc-50 border border-zinc-200">
                <img src={looks[selectedLook].image || "/placeholder-garment.png"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="sm:col-span-7 space-y-4 flex flex-col justify-between py-1 text-left">
                <div className="space-y-1">
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold uppercase text-zinc-900 tracking-wide leading-tight">{looks[selectedLook].garmentName || "Atelier Silhouette"}</h3>
                  <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">MODEL SPEC // {looks[selectedLook].modelName || "Atelier Catalog Frame"}</div>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-1">
                  <span className="text-[8px] font-mono text-[#C9A84C] font-black uppercase tracking-wider block">STUDIO METRIC ANALYSIS</span>
                  <p className="text-xs font-serif italic text-zinc-600 text-justify">"{looks[selectedLook].commentary}"</p>
                </div>
                
                {/* Horizontal Navigation Trigger Buttons Inside Lightbox */}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                  <button type="button" onClick={handlePrevLook} className="text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-900 uppercase cursor-pointer">← Previous</button>
                  <button type="button" onClick={handleNextLook} className="text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-900 uppercase cursor-pointer">Next →</button>
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