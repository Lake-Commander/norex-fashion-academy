'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { 
  ChevronRight, 
  ChevronLeft,
  X, 
  Maximize2, 
  Volume2,
  VolumeX,
  Layers,
  Camera,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

// 16 Looks matching the runway look-01.avif to look-16.avif
const runwayLooks = [
  {
    id: '01',
    image: '/runway/look-01.avif',
    model: 'Anok Yai',
    garment: 'Deconstructed Twill Trench',
    desc: 'An exploration into brutalist drapery. Heavy twill wraps asymmetric curves, finished with raw seam lines and a modular double buckle belt.'
  },
  {
    id: '02',
    image: '/runway/look-02.avif',
    model: 'Mona Tougaard',
    garment: 'Asymmetric Canvas Parka',
    desc: 'Utility meets high-fashion volume. Constructed from washed tech canvas featuring structured shoulder caps and oversized pocket shields.'
  },
  {
    id: '03',
    image: '/runway/look-03.avif',
    model: 'Leon Dame',
    garment: 'Brutalist Leather Aviator',
    desc: 'Crushed textured cowhide bomber tailored with deep elastic rib drapes that adjust form dynamically during forward posture.'
  },
  {
    id: '04',
    image: '/runway/look-04.avif',
    model: 'Vittoria Ceretti',
    garment: 'Liquid Silk Shift Dress',
    desc: 'Weighted crepe-back satin bias panels configured to flow gracefully under biological motion paths.'
  },
  {
    id: '05',
    image: '/runway/look-05.avif',
    model: 'Kaia Gerber',
    garment: 'Structured Gabardine Trouser Set',
    desc: 'Double pleated trousers combined with a fitted corset waistcoat, constructed from high-twist pure wool gabardine.'
  },
  {
    id: '06',
    image: '/runway/look-06.avif',
    model: 'Loli Bahia',
    garment: 'Cyber Canvas Windbreaker',
    desc: 'An ultra-light windbreaker engineered with memory nylon fabrics, asymmetrical neck closures, and integrated elastic ropes.'
  },
  {
    id: '07',
    image: '/runway/look-07.avif',
    model: 'Adut Akech',
    garment: 'Heavy Knit Column Robe',
    desc: 'Coarse gauge Belgian linen and merino blend column knit with integrated structured shoulders and a high collar.'
  },
  {
    id: '08',
    image: '/runway/look-08.avif',
    model: 'Gigi Hadid',
    garment: 'Asymmetric Blazer & Short',
    desc: 'Sharp tailoring cut in dynamic silhouette margins. Single breasted blazer with an off-center lapel wrap and raw-hem shorts.'
  },
  {
    id: '09',
    image: '/runway/look-09.avif',
    model: 'Anok Yai',
    garment: 'Structured Hooded Anorak',
    desc: 'Waxed cotton canvas hood jacket with wide utility sleeves and double metal hardware zipper accents.'
  },
  {
    id: '10',
    image: '/runway/look-10.avif',
    model: 'Mona Tougaard',
    garment: 'Crushed Linen Duster',
    desc: 'Over-dyed, pre-washed heavy linen floor-length coat with pleated back vent structures and button cuffs.'
  },
  {
    id: '11',
    image: '/runway/look-11.avif',
    model: 'Leon Dame',
    garment: 'Brutalist Oversized Coat',
    desc: 'Extremely broad shoulder tailoring in winter melton wool, featuring exaggerated storm flaps and deep vent slits.'
  },
  {
    id: '12',
    image: '/runway/look-12.avif',
    model: 'Vittoria Ceretti',
    garment: 'Panelled Nylon Trench',
    desc: 'Translucent paper-nylon overlays combined with structural cotton drill collars and waist bindings.'
  },
  {
    id: '13',
    image: '/runway/look-13.avif',
    model: 'Kaia Gerber',
    garment: 'Industrial Denim Vest',
    desc: 'Deep indigo selvedge denim vest treated with dark resin wash, complete with signature rivets and patch panels.'
  },
  {
    id: '14',
    image: '/runway/look-14.avif',
    model: 'Loli Bahia',
    garment: 'Fitted Rib Bodysuit',
    desc: 'Ergonomic lines contour the body in double-knit compact jersey, styled with raw finish wrist thumbholes.'
  },
  {
    id: '15',
    image: '/runway/look-15.avif',
    model: 'Adut Akech',
    garment: 'Raw Edge Denim Trouser',
    desc: 'Slouchy, extra-long wide leg jeans designed with triple stitched panels and distressed hems.'
  },
  {
    id: '16',
    image: '/runway/look-16.avif',
    model: 'Gigi Hadid',
    garment: 'Cybernetic Wool Bomber',
    desc: 'Insulated nylon and boiled wool hybrid bomber jacket featuring heavy shoulder drapes and industrial hardware closures.'
  }
]

// 14 Backstage (BTS) images
const backstageImages = Array.from({ length: 14 }, (_, idx) => {
  const numStr = String(idx + 1).padStart(2, '0');
  const captions = [
    'Final fitting adjustments before entry queue.',
    'Atelier artisans securing hem drapes.',
    'Makeup preparation and aesthetic checks.',
    'Creative Director briefing the walk list.',
    'Lighting rig synchronization checks.',
    'Fabric swatch cards in the design laboratory.',
    'Models entering the main staging portal.',
    'Technical garment steaming and lint grooming.',
    'Model card lineup checks.',
    'Post-walk feedback and garment logs.',
    'Sound check and sub-bass ambient tuning.',
    'Behind-the-scenes photography capture.',
    'Atelier leather glove details.',
    'Creative Director final walk overview.'
  ];
  return {
    id: numStr,
    image: `/runway/bts-${numStr}.avif`,
    title: `Backstage Scene ${numStr}`,
    desc: captions[idx] || 'Preparations in the brutalist concrete atelier.'
  };
})

export default function RunwayLandingPage() {
  const { soundEnabled } = useShop()
  const [activeTab, setActiveTab] = useState<'looks' | 'backstage'>('looks')
  const [gridCols, setGridCols] = useState<2 | 3>(3)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [ambientPlaying, setAmbientPlaying] = useState(false)
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2>(1)
  const youtubePlayerRef = useRef<any>(null)

  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50
    if (swipeDistance > minSwipeDistance) {
      handleNextLook()
    } else if (swipeDistance < -minSwipeDistance) {
      handlePrevLook()
    }
  }

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleTabChange = (tab: 'looks' | 'backstage') => {
    if (soundEnabled) sounds.playSweep()
    setActiveTab(tab)
  }

  const handleToggleAmbient = () => {
    if (soundEnabled) sounds.playClick()
    
    if (youtubePlayerRef.current && typeof youtubePlayerRef.current.isMuted === 'function') {
      if (youtubePlayerRef.current.isMuted()) {
        youtubePlayerRef.current.unMute()
        youtubePlayerRef.current.setVolume(50)
        setAmbientPlaying(true)
      } else {
        youtubePlayerRef.current.mute()
        setAmbientPlaying(false)
      }
    } else {
      setAmbientPlaying(!ambientPlaying)
    }
  }

  useEffect(() => {
    if (!soundEnabled) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.mute === 'function') {
        youtubePlayerRef.current.mute()
      }
      setAmbientPlaying(false)
    }
  }, [soundEnabled])

  useEffect(() => {
    let fadeTimer: any = null

    if (typeof window !== 'undefined') {
      const initPlayer = () => {
        youtubePlayerRef.current = new (window as any).YT.Player('youtube-bg-player-runway', {
          videoId: 'oPtfQAFIk-4',
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: 'oPtfQAFIk-4',
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo()
              event.target.mute()
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                fadeTimer = setTimeout(() => {
                  setVideoLoaded(true)
                }, 1500)
              }
            }
          }
        })
      }

      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer()
      }

      if (!document.getElementById('youtube-iframe-api-runway')) {
        const tag = document.createElement('script')
        tag.id = 'youtube-iframe-api-runway'
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      } else if ((window as any).YT && (window as any).YT.Player) {
        initPlayer()
      }
    }

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer)
      if (youtubePlayerRef.current && youtubePlayerRef.current.destroy) {
        youtubePlayerRef.current.destroy()
      }
    }
  }, [])

  const handlePrevLook = () => {
    if (lightboxIndex !== null) {
      if (soundEnabled) sounds.playPop()
      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : runwayLooks.length - 1))
    }
  }

  const handleNextLook = () => {
    if (lightboxIndex !== null) {
      if (soundEnabled) sounds.playPop()
      setLightboxIndex(prev => (prev !== null && prev < runwayLooks.length - 1 ? prev + 1 : 0))
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowLeft') handlePrevLook()
      if (e.key === 'ArrowRight') handleNextLook()
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full aspect-[16/10] md:aspect-[21/9] lg:aspect-[3/1] min-h-[360px] md:min-h-[420px] max-h-[70vh] overflow-hidden bg-black flex items-center justify-center border-b border-border/40">
        <div className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none transition-opacity duration-[1500ms] ${
          videoLoaded ? 'opacity-75' : 'opacity-0'
        }`}>
          <div id="youtube-bg-player-runway" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[67.5vw] min-h-[100%] min-w-[177.77vh] scale-[1.3] pointer-events-none" />
        </div>
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
        
        <div className="absolute inset-x-6 bottom-6 md:bottom-12 z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-1 sm:space-y-2 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-[9px] uppercase tracking-widest font-black">
              <Sparkles className="h-3 w-3" />
              <span>Spring / Summer 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tighter uppercase leading-none">
              SPRING 2026 RUNWAY
            </h1>
            <p className="text-xs text-gray-300 font-light leading-relaxed font-mono">
              Brutalist geometry meets biological kinetic motion curves. Shot live in New York.
            </p>
          </div>

          <button
            onClick={handleToggleAmbient}
            className={`px-5 py-3 border rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 shrink-0 w-fit md:w-auto ${
              ambientPlaying 
                ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 animate-pulse' 
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {ambientPlaying ? (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>MUTE RUNWAY AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-gray-400" />
                <span>PLAY RUNWAY AUDIO</span>
              </>
            )}
          </button>
        </div>
      </section>

      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
        
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-border/40 pb-6 mb-8 gap-6">
          <div className="flex items-center gap-3 p-1 bg-secondary/30 rounded-full border border-border/30">
            <button
              onClick={() => handleTabChange('looks')}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'looks'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/60 hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>The Looks</span>
              </span>
            </button>
            <button
              onClick={() => handleTabChange('backstage')}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'backstage'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/60 hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                <span>Backstage</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6 text-xs tracking-widest font-mono text-muted-foreground">
            <span>
              {activeTab === 'looks' ? `${runwayLooks.length} LOOKS` : `${backstageImages.length} SCENES`}
            </span>
          </div>
        </div>

        {activeTab === 'looks' && (
          <div className={`grid gap-4 sm:gap-6 md:gap-8 transition-all duration-500 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
            {runwayLooks.map((look, idx) => (
              <div
                key={look.id}
                onClick={() => { if (soundEnabled) sounds.playChord(); setLightboxIndex(idx) }}
                onMouseEnter={handleInteract}
                className="group relative cursor-pointer bg-card/25 border border-border/40 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-foreground/30 transition-all duration-500 scale-100 hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                  <img
                    src={look.image}
                    alt={`${look.model} - Look ${look.id}`}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-[1.02] group-hover:scale-100 transition-all duration-[800ms]"
                  />
                  <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-white/50 group-hover:text-white transition-colors duration-300">
                    ORLIEN // SS26
                  </div>
                  <div className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-white/50 group-hover:text-white transition-colors duration-300">
                    L-{look.id}
                  </div>
                </div>

                <div className="p-3 sm:p-5 flex items-center justify-between gap-3 bg-card/60 backdrop-blur-sm border-t border-border/20">
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] text-primary font-bold">LOOK {look.id}</span>
                    <h3 className="text-[11px] sm:text-xs font-bold text-foreground truncate mt-0.5">{look.garment}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline">{look.model.split(' ')[0]}</span>
                    <Maximize2 className="h-3.5 w-3.5 stroke-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'backstage' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {backstageImages.map((bts) => (
              <div
                key={bts.id}
                onMouseEnter={handleInteract}
                className="group bg-card/25 border border-border/40 rounded-2xl md:rounded-3xl overflow-hidden hover:border-foreground/30 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  <img
                    src={bts.image}
                    alt={bts.title}
                    loading="lazy"
                    className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-500 scale-100 group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 text-[8px] text-white font-mono tracking-wider">
                    RAW FEED // SCENE-{bts.id}
                  </div>
                </div>
                <div className="p-4 text-left">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-bold mb-1">PREP / BACKSTAGE</h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground font-light">{bts.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="border-y border-border/40 py-12 my-12 md:py-20 md:my-20 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
          <span className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase font-black">CREATIVE DIRECTIVE NOTE</span>
          <blockquote className="text-2xl md:text-3xl font-light italic text-foreground leading-relaxed mt-5 max-w-3xl mx-auto font-heading px-4">
            "Spring 2026 is about structural tension. We deconstructed the classic tailored layers of the wardrobe, allowing canvas panels to interact with natural wind, body speed, and gravity curves."
          </blockquote>
          <cite className="text-xs font-mono tracking-widest block uppercase mt-6 text-muted-foreground">— ORLIEN Design Office</cite>
        </section>

      </div>

      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md overflow-y-auto animate-fade-in"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="min-h-full w-full flex flex-col justify-between items-center p-4 md:p-6">
            
            <div className="w-full max-w-7xl flex items-center justify-between border-b border-white/10 pb-4 text-white">
              <div className="text-left font-mono">
                <span className="text-xs text-primary font-bold tracking-[0.25em]">RUNWAY ARCHIVE 2026</span>
                <div className="text-[10px] text-gray-400 mt-0.5">LOOK {runwayLooks[lightboxIndex].id} OF {runwayLooks.length}</div>
              </div>
              <button
                onClick={() => { if (soundEnabled) sounds.playClick(); setLightboxIndex(null) }}
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95"
                title="Close Slideshow"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 py-6">
              <button
                onClick={handlePrevLook}
                className="hidden md:flex p-4 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 text-white transition-all active:scale-90 items-center justify-center shrink-0"
                title="Previous Look"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="relative aspect-[3/4] w-full max-w-[280px] sm:max-w-[320px] md:max-w-none h-auto md:h-full max-h-[30vh] sm:max-h-[36vh] md:max-h-[62vh] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={runwayLooks[lightboxIndex].image}
                  alt={runwayLooks[lightboxIndex].garment}
                  className="w-full h-full object-cover object-center animate-fade-in"
                />
              </div>

              <div className="max-w-md w-full text-left space-y-3 md:space-y-6 text-white px-2 md:px-0">
                <div className="space-y-1.5 md:space-y-2">
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-primary font-black">
                    LOOK {runwayLooks[lightboxIndex].id}
                  </span>
                  <h2 className="text-xl md:text-3xl font-black uppercase font-heading tracking-wide leading-tight">
                    {runwayLooks[lightboxIndex].garment}
                  </h2>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">MODEL SPEC //</span>
                    <span className="text-[11px] font-bold tracking-wider text-primary font-mono">{runwayLooks[lightboxIndex].model}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-3 md:pt-4">
                  <p className="text-[11px] md:text-sm text-gray-300 font-light leading-relaxed">
                    {runwayLooks[lightboxIndex].desc}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 pt-2 overflow-x-auto max-w-full pb-1">
                  {runwayLooks.map((look, i) => (
                    <button
                      key={look.id}
                      onClick={() => { if (soundEnabled) sounds.playPop(); setLightboxIndex(i) }}
                      className={`h-9 w-9 rounded-md overflow-hidden border transition-all shrink-0 ${
                        i === lightboxIndex ? 'border-primary scale-110 shadow-md shadow-primary/20' : 'border-white/20 opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img src={look.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextLook}
                className="hidden md:flex p-4 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 text-white transition-all active:scale-90 items-center justify-center shrink-0"
                title="Next Look"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="w-full max-w-xs flex items-center justify-between md:hidden border-t border-white/10 pt-4 text-white">
              <button
                onClick={handlePrevLook}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>PREV</span>
              </button>
              <span className="text-[10px] font-mono">SWIPE / TAP</span>
              <button
                onClick={handleNextLook}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-400 hover:text-white"
              >
                <span>NEXT</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <StyleOracle />
      <Footer />
    </main>
  )
}
