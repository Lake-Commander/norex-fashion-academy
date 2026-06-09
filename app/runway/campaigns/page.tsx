'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Camera, UserCircle, X, Maximize2 } from 'lucide-react'

const campaigns = [
  {
    id: '01',
    title: 'Chiaroscuro S26',
    image: '/runway/look-04.avif',
    concept: 'Exploring high-contrast shadows, raw sunlight, and silk panel curves.',
    photographer: 'Tyler Mitchell',
    stylist: 'Gabriella Karefa-Johnson',
    cast: 'Vittoria Ceretti, Kaia Gerber'
  },
  {
    id: '02',
    title: 'Concrete Ethereal',
    image: '/runway/look-11.avif',
    concept: 'Juxtaposing raw Brutalist architectural concrete slabs with heavy wool drapes.',
    photographer: 'David Sims',
    stylist: 'Alastair McKimm',
    cast: 'Leon Dame, Anok Yai'
  },
  {
    id: '03',
    title: 'Kinetic Motion Docks',
    image: '/runway/look-02.avif',
    concept: 'Garments reacting to natural wind vectors at the Brooklyn port docks.',
    photographer: 'Johnny Dufort',
    stylist: 'Ib Kamara',
    cast: 'Mona Tougaard, Loli Bahia'
  }
]

export default function CampaignsPage() {
  const { soundEnabled } = useShop()
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleOpenDetail = (idx: number) => {
    if (soundEnabled) sounds.playChord()
    setSelectedCampaign(idx)
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-border/40 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black">
              CREATIVE DIRECTION INDEX
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none">
              Campaigns
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Luxury editorial campaign records representing visual investigations of each season.
            </p>
          </div>

          {/* Campaign Poster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {campaigns.map((camp, idx) => (
              <div 
                key={camp.id}
                onClick={() => handleOpenDetail(idx)}
                onMouseEnter={handleInteract}
                className="group relative cursor-pointer bg-card/25 border border-border/40 rounded-3xl overflow-hidden p-5 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30"
              >
                {/* Visual poster frame */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border/30 mb-5">
                  <img src={camp.image} alt={camp.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute top-4 left-4 bg-black/60 text-white font-mono text-[8px] tracking-widest px-2.5 py-0.5 uppercase rounded">
                    VOL. {camp.id}
                  </div>
                  <div className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-left">
                  <h2 className="text-xl font-bold uppercase text-foreground tracking-wide group-hover:text-primary transition-colors">
                    {camp.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">
                    "{camp.concept}"
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Campaign detail modal */}
      {selectedCampaign !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCampaign(null)} />
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 md:p-8 text-left shadow-2xl z-10 animate-slide-in-right glass-panel overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-border/35 mb-6">
              <span className="text-xs font-mono font-bold text-primary">CAMPAIGN LEDGER // VOL. {campaigns[selectedCampaign].id}</span>
              <button 
                onClick={() => setSelectedCampaign(null)} 
                className="p-1.5 rounded-full hover:bg-secondary text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-6 aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border/35 shadow-lg">
                <img src={campaigns[selectedCampaign].image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase text-foreground leading-tight">{campaigns[selectedCampaign].title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">"{campaigns[selectedCampaign].concept}"</p>
                </div>

                <div className="space-y-4 border-t border-border/40 pt-4 font-mono text-[10px] uppercase text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary shrink-0" />
                    <span>Photography: <strong className="text-foreground">{campaigns[selectedCampaign].photographer}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>Styling: <strong className="text-foreground">{campaigns[selectedCampaign].stylist}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    <span>Featured Cast: <strong className="text-foreground">{campaigns[selectedCampaign].cast}</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-secondary/40 border border-border/30 rounded-2xl text-[11px] leading-relaxed text-muted-foreground font-light">
                  This campaign represents an aesthetic benchmark for ORLIEN visual communications. Visual sheets and raw film formats are cataloged in our archive vault, ensuring creative direction parameters are synced for reference.
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
