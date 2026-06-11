'use client'

import { useState } from 'react'
import { Sparkles, Play, X, Camera, Film, ArrowRight } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import Link from 'next/link'

export default function FashionFilm() {
  const { soundEnabled } = useShop()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'bts' | 'journal'>('bts')

  const playClick = () => {
    if (soundEnabled) sounds.playClick()
  }

  const togglePlayer = () => {
    if (soundEnabled) sounds.playSweep()
    setIsPlaying(!isPlaying)
  }

  const btsItems = [
    { id: 'bts-01', image: '/runway/bts-01.avif', caption: 'Artisans adjusting luxury corset lines.' },
    { id: 'bts-02', image: '/runway/bts-04.avif', caption: 'Hand-sewing intricate bodice beadwork profiles.' },
    { id: 'bts-03', image: '/runway/bts-06.avif', caption: 'Nesting mathematical pattern grids in the lab.' }
  ]

  const journalItems = [
    { id: 'look-01', image: '/product-1.png', caption: 'Crimson Evening Gown silk sweep details.' },
    { id: 'look-04', image: '/product-4.jpg', caption: 'Ivory Bridal Ensemble structure layers.' },
    { id: 'look-06', image: '/product-6-new.jpeg', caption: 'Ankara Fusion unisex crop jacket geometry.' }
  ]

  const activeGrid = activeTab === 'bts' ? btsItems : journalItems
  const goldColor = "#C9A84C";

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 relative overflow-hidden">
      <style>{`
        .film-tab-btn {
          flex: 1; py: 0.5rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.3s ease; background: none; border: none;
        }
        .feed-row {
          display: flex; gap: 1rem; items-center; padding: 0.5rem; border-radius: 2px;
          bg-white; border: 1px solid #e5e7eb; transition: all 0.3s ease;
        }
        .feed-row:hover { border-color: #C9A84C; transform: translateX(2px); }
        
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50; bg-black; background-color: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(8px); display: flex; flex-direction: column; justify-content: space-between; items-center; padding: 1.5rem;
        }
      `}</style>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.02)" }} />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Title Section */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">08 // THE CINEMA</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none text-foreground">
            Norex Fashion Film
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl font-light">
            Experience our flagship tailored capsules in motion. Watch the cinematic atelier trailer and browse high-contrast layout photography feeds.
          </p>
        </div>

        {/* Netflix-style layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Video Preview Box */}
          <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-8 group relative rounded-sm border overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center min-h-[360px] md:min-h-[460px]">
            <img 
              src="/runway/hero-banner-2.avif" 
              alt="Fashion Film Trailer Poster" 
              className="absolute inset-0 w-full h-full object-cover scale-[1.01] group-hover:scale-100 transition-transform duration-[1000ms] brightness-50"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

            {/* Video Play HUD Controls */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md px-6">
              <button 
                onClick={togglePlayer}
                style={{ borderColor: "rgba(255,255,255,0.4)" }}
                className="h-20 w-20 rounded-full border-2 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-[#C9A84C] hover:border-[#C9A84C] hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer"
              >
                <Play className="h-7 w-7 fill-current ml-1" />
              </button>
              <div>
                <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-[0.3em] font-bold uppercase block mb-1">
                  OFFICIAL TRAILER // DIR_NOTE
                </span>
                <h3 className="text-2xl font-black font-heading uppercase text-white tracking-wider leading-none">
                  ATELIER CAMPAIGN FILM
                </h3>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 z-20 text-left text-white/50 text-[9px] font-mono tracking-widest uppercase hidden md:block">
              RUN_TIME // 02:45 MINS • HIGH CONTRAST ATMOSPHERE FEED
            </div>
          </div>

          {/* Right Feeds Column */}
          <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-4 flex flex-col justify-between border bg-white p-6 text-left rounded-sm">
            
            <div className="space-y-6">
              <div style={{ borderColor: "#e5e7eb" }} className="flex gap-1 p-1 bg-[#FAF7F4] rounded-full border">
                <button
                  onClick={() => { playClick(); setActiveTab('bts') }}
                  className="film-tab-btn"
                  style={{
                    backgroundColor: activeTab === 'bts' ? '#1a1a1a' : 'transparent',
                    color: activeTab === 'bts' ? 'white' : '#6b7280',
                    boxShadow: activeTab === 'bts' ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Film className="h-3 w-3" />
                    <span>Backstage</span>
                  </span>
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('journal') }}
                  className="film-tab-btn"
                  style={{
                    backgroundColor: activeTab === 'journal' ? '#1a1a1a' : 'transparent',
                    color: activeTab === 'journal' ? 'white' : '#6b7280',
                    boxShadow: activeTab === 'journal' ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Camera className="h-3 w-3" />
                    <span>Editorial</span>
                  </span>
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-3">
                {activeGrid.map((it) => (
                  <div key={it.id} className="feed-row">
                    <div style={{ borderColor: "#f0ebe3" }} className="w-14 h-14 overflow-hidden shrink-0 border bg-[#FAF7F4] rounded-sm">
                      <img src={it.image} alt={it.caption} className="w-full h-full object-cover filter grayscale contrast-[1.02]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold uppercase block mb-0.5">
                        REF // {it.id}
                      </span>
                      <p className="text-[11px] leading-snug text-[#6b7280] truncate font-light">
                        {it.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/editorial"
              onClick={playClick}
              style={{ color: goldColor, borderTop: "1px solid #f0ebe3" }}
              className="inline-flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#1a1a1a] transition-colors pt-5 mt-6 text-decoration-none"
            >
              <span>Explore Campaign Gazette</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

          </div>
        </div>
      </div>

      {/* Fullscreen Video Player Modal Overlay */}
      {isPlaying && (
        <div className="modal-overlay">
          <div className="absolute inset-0 cursor-pointer" onClick={togglePlayer} />
          
          <div style={{ borderBottomColor: "rgba(255,255,255,0.1)" }} className="w-full max-w-7xl flex justify-between items-center border-b pb-4 text-white relative z-10">
            <div className="text-left font-mono">
              <span style={{ color: goldColor }} className="text-xs font-bold tracking-[0.25em]">NOREX FASHION CINEMA</span>
              <div className="text-[10px] text-gray-400 mt-0.5">ATELIER CAMPAIGN CAPSULE OFFICIAL SCREENING</div>
            </div>
            <button onClick={togglePlayer} className="p-2 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-5xl flex items-center justify-center py-6 relative z-10">
            <div style={{ borderColor: "rgba(255,255,255,0.1)" }} className="relative aspect-video w-full rounded-sm overflow-hidden border shadow-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/oPtfQAFIk-4?autoplay=1&mute=0&loop=1&playlist=oPtfQAFIk-4&controls=1&showinfo=0&rel=0&modestbranding=1"
                title="Norex Fashion Campaign Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
          </div>

          <div className="text-white/40 text-[9px] font-mono tracking-widest uppercase relative z-10">
            NOREX STATIONS STREAMING PLATFORM • MULTI-BASS AUDIO CALIBRATION
          </div>
        </div>
      )}
    </section>
  )
}