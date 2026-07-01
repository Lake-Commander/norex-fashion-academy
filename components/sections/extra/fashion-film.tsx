'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Play, X, Camera, Film, ArrowRight, Loader2 } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import Link from 'next/link'

interface FeedItem {
  _id: string;
  image: string;
  commentary: string;
  garmentName?: string;
}

export default function FashionFilm() {
  const { soundEnabled } = useShop()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'bts' | 'journal'>('bts')
  
  // Database State Streams
  const [featuredFilm, setFeaturedFilm] = useState<any | null>(null)
  const [btsItems, setBtsItems] = useState<FeedItem[]>([])
  const [journalItems, setJournalItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCinemaSectionData() {
      try {
        const res = await fetch('/api/runway')
        const data = await res.json()
        
        if (data.success) {
          // Isolate the latest collection containing a video anchor
          const filmCollection = data.collections.find((c: any) => c.hasFilm) || data.collections[0]
          setFeaturedFilm(filmCollection)

          // Segregate looks by data sub-type and map top three entries
          const btsRaw = data.looks.filter((l: any) => l.type === 'backstage').slice(0, 3)
          const lookRaw = data.looks.filter((l: any) => l.type === 'look').slice(0, 3)
          
          setBtsItems(btsRaw)
          setJournalItems(lookRaw)
        }
      } catch (err) {
        console.error('Failed compiling homepage cinema data feeds:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCinemaSectionData()
  }, [])

  const playClick = () => {
    if (soundEnabled) sounds.playPop()
  }

  const togglePlayer = () => {
    if (soundEnabled) sounds.playSweep()
    setIsPlaying(!isPlaying)
  }

  const activeGrid = activeTab === 'bts' ? btsItems : journalItems
  const goldColor = "#C9A84C"

  if (loading) {
    return (
      <div className="bg-background py-24 text-center flex flex-col items-center justify-center gap-2 border-b border-border/25">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Loading Cinema Nodes...</p>
      </div>
    )
  }

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 relative overflow-hidden">
      <style>{`
        .film-tab-btn {
          flex: 1; py: 0.5rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.3s ease; background: none; border: none; cursor: pointer;
        }
        .feed-row {
          display: flex; gap: 1rem; align-items: center; padding: 0.5rem; border-radius: 2px;
          background-color: white; border: 1px solid #e5e7eb; transition: all 0.3s ease;
        }
        .feed-row:hover { border-color: #C9A84C; transform: translateX(2px); }
        
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50; background-color: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(8px); display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 1.5rem;
        }
      `}</style>
      
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

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Video Preview Box */}
          <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-8 group relative rounded-sm border overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center min-h-[360px] md:min-h-[460px]">
            <img 
              src={featuredFilm?.coverImage || "/product-1.png"} 
              alt="Fashion Film Trailer Poster" 
              className="absolute inset-0 w-full h-full object-cover scale-[1.01] group-hover:scale-100 transition-transform duration-[1000ms] brightness-50 grayscale contrast-[1.02]"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

            {/* Video Play HUD Controls */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md px-6">
              {featuredFilm?.youtubeId && (
                <button 
                  type="button"
                  onClick={togglePlayer}
                  style={{ borderColor: "rgba(255,255,255,0.4)" }}
                  className="h-20 w-20 rounded-full border-2 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-[#C9A84C] hover:border-[#C9A84C] hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer"
                >
                  <Play className="h-7 w-7 fill-current ml-1" />
                </button>
              )}
              <div>
                <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-[0.3em] font-bold uppercase block mb-1">
                  OFFICIAL TRAILER // {featuredFilm?.waSeason?.toUpperCase() || 'CORE_NOTE'}
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), serif' }} className="text-2xl font-black uppercase text-white tracking-wider leading-none">
                  {featuredFilm?.filmTitle || "ATELIER CAMPAIGN FILM"}
                </h3>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 z-20 text-left text-white/50 text-[9px] font-mono tracking-widest uppercase hidden md:block">
              RUN_TIME // {featuredFilm?.filmDuration || "02:45 MINS"} • HIGH CONTRAST ATMOSPHERE FEED
            </div>
          </div>

          {/* Right Feeds Column */}
          <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-4 flex flex-col justify-between border bg-white p-6 text-left rounded-sm">
            <div className="space-y-6">
              <div style={{ borderColor: "#e5e7eb" }} className="flex gap-1 p-1 bg-[#FAF7F4] rounded-full border">
                <button
                  type="button"
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
                  type="button"
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

              {/* Feed List Container */}
              <div className="space-y-3">
                {activeGrid.length === 0 ? (
                  <p className="text-zinc-400 font-mono text-[10px] uppercase py-6 text-center">No trace images uploaded.</p>
                ) : (
                  activeGrid.map((it) => (
                    <div key={it._id} className="feed-row">
                      <div style={{ borderColor: "#f0ebe3" }} className="w-14 h-14 overflow-hidden shrink-0 border bg-[#FAF7F4] rounded-sm">
                        <img src={it.image || "/placeholder-garment.png"} alt="" className="w-full h-full object-cover filter grayscale contrast-[1.02]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold uppercase block mb-0.5">
                          REF // ID_{it._id.substring(18)}
                        </span>
                        <p className="text-[11px] leading-snug text-[#6b7280] truncate font-light font-sans">
                          {it.garmentName || it.commentary}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/lookbook"
              onClick={playClick}
              style={{ color: goldColor, borderTop: "1px solid #f0ebe3" }}
              className="inline-flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#1a1a1a] transition-colors pt-5 mt-6 text-decoration-none w-full font-mono"
            >
              <span>Explore Campaign Gazette</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

          </div>
        </div>
      </div>

      {/* Fullscreen Video Player Modal Overlay */}
      {isPlaying && featuredFilm?.youtubeId && (
        <div className="modal-overlay">
          <div className="absolute inset-0 cursor-pointer" onClick={togglePlayer} />
          
          <div style={{ borderBottomColor: "rgba(255,255,255,0.1)" }} className="w-full max-w-7xl flex justify-between items-center border-b pb-4 text-white relative z-10">
            <div className="text-left font-mono">
              <span style={{ color: goldColor }} className="text-xs font-bold tracking-[0.25em]">CORE ATELIER CINEMA</span>
              <div className="text-[10px] text-gray-400 mt-0.5">{featuredFilm.filmTitle?.toUpperCase()} OFFICIAL STREAMING SCREENING</div>
            </div>
            <button type="button" onClick={togglePlayer} className="p-2 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer bg-transparent border-none">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-5xl flex items-center justify-center py-6 relative z-10">
            <div style={{ borderColor: "rgba(255,255,255,0.1)" }} className="relative aspect-video w-full rounded-sm overflow-hidden border shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${featuredFilm.youtubeId}?autoplay=1&mute=0&loop=1&playlist=${featuredFilm.youtubeId}&controls=1&modestbranding=1`}
                title="Atelier Campaign Film Stream"
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