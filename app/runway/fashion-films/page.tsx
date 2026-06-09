'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Play, Sparkles, Video, Film, Eye, X } from 'lucide-react'

const films = [
  {
    id: '1',
    title: 'Solstice Motion Curve',
    duration: '4m 32s',
    director: 'Tyler Mitchell',
    description: 'A study of draped silk panels reacting to wind speed and thermal air vectors in slow-motion detail.',
    youtubeId: 'oPtfQAFIk-4'
  },
  {
    id: '2',
    title: 'Brutalist Shadows Upstate',
    duration: '6m 15s',
    director: 'David Sims',
    description: 'An architectural investigation contrasting winter wool silhouettes with industrial raw concrete scaffolding.',
    youtubeId: 'oPtfQAFIk-4'
  },
  {
    id: '3',
    title: 'Atelier Making: The Trench',
    duration: '3m 50s',
    director: 'Johnny Dufort',
    description: 'Behind the scenes fittings highlighting stitch precision, horn buttons detail, and cotton loom algorithms.',
    youtubeId: 'oPtfQAFIk-4'
  }
]

export default function FashionFilmsPage() {
  const { soundEnabled } = useShop()
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handlePlayFilm = (ytId: string) => {
    if (soundEnabled) sounds.playSuccess()
    setActiveVideo(ytId)
  }

  return (
    <main className="min-h-screen bg-black text-[#faf9f6] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-white/10 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-primary" />
              <span>ORLIEN CINEMATIC SHIELD</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading text-white uppercase tracking-tight leading-none">
              Fashion Films
            </h1>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider leading-relaxed">
              Explore Netflix-style category layers of seasonal campaign shorts and behind-the-scenes directives.
            </p>
          </div>

          {/* Featured Video Player Banner */}
          <div className="relative w-full aspect-[21/9] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('/runway/hero-banner-2.avif')" }} />
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            
            <div className="absolute inset-6 md:inset-12 z-10 flex flex-col justify-end space-y-4 max-w-xl text-left">
              <span className="text-[8px] font-mono text-primary font-black uppercase tracking-widest">FEATURED CINEMATIC SHORT</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase leading-none">Solstice Motion Curve</h2>
              <p className="text-xs text-gray-300 font-light leading-relaxed font-serif">
                A gorgeous slow-motion research documentary analyzing Crepe Silk drapery reacting to warm coastal breeze. Directed by Mitchell.
              </p>
              <button
                onClick={() => handlePlayFilm('oPtfQAFIk-4')}
                className="px-6 py-3 bg-white text-black hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all w-fit flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5 active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play Film</span>
              </button>
            </div>
          </div>

          {/* Film Archive (Netflix Rows) */}
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary font-black">THE COLLECTION RACKS</span>
              <h3 className="text-xl font-bold uppercase tracking-wide mt-1 text-white">Editorial Film Releases</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {films.map((f) => (
                <div 
                  key={f.id}
                  onClick={() => handlePlayFilm(f.youtubeId)}
                  onMouseEnter={handleInteract}
                  className="group relative cursor-pointer bg-zinc-900 border border-white/5 hover:border-white/25 rounded-2xl p-5 flex flex-col justify-between text-left transition-all hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full rounded-xl bg-black/80 overflow-hidden relative flex items-center justify-center border border-white/5">
                      <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:opacity-50 transition-opacity" style={{ backgroundImage: "url('/runway/look-02.avif')" }} />
                      <Play className="h-8 w-8 text-white/40 group-hover:text-primary transition-colors z-10 shrink-0" />
                      <span className="absolute bottom-2 right-2 text-[8px] font-mono text-gray-400 bg-black/60 px-1.5 py-0.5 rounded">
                        {f.duration}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-primary transition-colors">
                        {f.title}
                      </h4>
                      <p className="text-[9px] font-mono text-gray-500">DIRECTOR: {f.director}</p>
                      <p className="text-xs text-gray-400 font-light font-serif leading-relaxed line-clamp-2">
                        {f.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 text-[9px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" />
                    <span>LAUNCH STREAM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Full-screen video drawer overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 sm:p-8 md:p-12 animate-fade-in">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white z-50 transition-all active:scale-90"
            title="Close video stream"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="w-full max-w-5xl aspect-[16/9] bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <iframe 
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&controls=1`} 
              title="ORLIEN Fashion Film Frame" 
              className="absolute inset-0 w-full h-full border-none"
              allow="autoplay; encrypted-media; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      )}

      <StyleOracle />
      <Footer />
    </main>
  )
}
