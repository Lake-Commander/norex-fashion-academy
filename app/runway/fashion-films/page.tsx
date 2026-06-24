'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Play, Loader2, Film, Video, X } from 'lucide-react'
import { useTelemetry } from "@/hooks/useTelemetry" // ⚡ Telemetry Import

export default function FashionFilmsPage() {
  const { soundEnabled } = useShop()
  const [films, setFilms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  
  const { trackVideo } = useTelemetry() // ⚡ Destructure Hook

  useEffect(() => {
    async function loadCinemaStreams() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        if (data.success) {
          setFilms(data.collections.filter((c: any) => c.hasFilm));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCinemaStreams();
  }, []);

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); }
  
  // ⚡ Telemetry: Append video tracking token signatures to the user profile
  const handlePlayFilm = (ytId: string) => {
    if (soundEnabled) sounds.playSuccess();
    setActiveVideo(ytId);
    trackVideo(ytId); 
  }

  const featuredFilm = films[0];

  return (
    <main className="min-h-screen bg-black text-[#faf9f6] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />

      {/* ⚡ FIXED: Adjusted from py-16/py-24 to explicit pt-32 on mobile and pt-40 on desktop to clear the nav collision seamlessly */}
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C] uppercase font-black flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5" />
              <span>NOREX CINEMATIC SHIELD INDEX</span>
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Fashion Films
            </h1>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider leading-relaxed">
              Explore dynamic streaming categories of seasonal campaign shorts and behind-the-scenes directives.
            </p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <>
              {featuredFilm && (
                <div className="relative w-full aspect-[21/9] bg-zinc-950 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center shadow-2xl">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: `url(${featuredFilm.coverImage || "/placeholder.png"})` }} />
                  <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
                  
                  <div className="absolute inset-6 md:inset-12 z-10 flex flex-col justify-end space-y-3 max-w-xl">
                    <span className="text-[8px] font-mono text-[#C9A84C] font-black uppercase tracking-widest">LATEST MATURED CINEMATIC SHORT</span>
                    <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl sm:text-4xl font-bold text-white uppercase leading-none">{featuredFilm.filmTitle}</h2>
                    <p className="text-xs text-gray-300 font-light leading-relaxed font-serif italic line-clamp-2 sm:line-clamp-none">
                      "{featuredFilm.filmDescription}"
                    </p>
                    <button
                      type="button"
                      onClick={() => handlePlayFilm(featuredFilm.youtubeId)}
                      className="px-6 py-3 bg-white text-black hover:bg-[#C9A84C] hover:text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all w-fit flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Stream Film Release</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-6">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#C9A84C] font-black block">THE ATELIER SCREENING RACKS</span>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-white">Editorial Film Releases</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {films.map((f) => (
                    <div 
                      key={f._id}
                      onClick={() => handlePlayFilm(f.youtubeId)}
                      onMouseEnter={handleInteract}
                      className="group relative cursor-pointer bg-zinc-900/60 border border-white/5 hover:border-[#C9A84C]/40 rounded-sm p-5 flex flex-col justify-between transition-all hover:-translate-y-1"
                    >
                      <div className="space-y-4">
                        <div className="aspect-[16/9] w-full rounded-sm bg-black/80 overflow-hidden relative border border-white/10 flex items-center justify-center">
                          <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:opacity-50 transition-opacity" style={{ backgroundImage: `url(${f.coverImage || "/placeholder.png"})` }} />
                          <Play className="h-8 w-8 text-white/40 group-hover:text-[#C9A84C] transition-colors z-10 shrink-0 fill-current" />
                          <span className="absolute bottom-2 right-2 text-[8px] font-mono text-gray-400 bg-black/80 px-1.5 py-0.5 rounded-sm font-bold">
                            {f.filmDuration || "3m 45s"}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-base font-bold text-white uppercase tracking-wide group-hover:text-[#C9A84C] transition-colors leading-tight">
                            {f.filmTitle || f.title}
                          </h4>
                          <p className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider">DIRECTOR: {f.filmDirector || "Atelier Core"}</p>
                          <p className="text-xs text-gray-400 font-light font-serif leading-relaxed line-clamp-2 text-justify">
                            {f.filmDescription}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-4 text-[9px] font-mono text-[#C9A84C] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5" />
                        <span>LAUNCH STREAM CONNECTIONS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </section>

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 sm:p-8">
          <button type="button" onClick={() => setActiveVideo(null)} className="absolute top-6 right-6 p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white z-50 cursor-pointer">
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-5xl aspect-[16/9] bg-zinc-950 rounded-sm overflow-hidden border border-white/10 shadow-2xl relative">
            <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&controls=1`} title="Atelier Video Pipeline Player" className="absolute inset-0 w-full h-full border-none" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}

      <StyleOracle /><Footer />
    </main>
  )
}