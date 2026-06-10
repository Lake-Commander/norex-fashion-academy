'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, Calendar, ShieldAlert, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ArchivePage() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const eras = [
    { season: 'ss24', title: 'Spring / Summer 24', theme: 'Obsidian Minimal', desc: 'Introduced basic geometric coats and raw cotton overlays.' },
    { season: 'fw24', title: 'Autumn / Winter 24', theme: 'Freezing Vectors', desc: 'Dense heavy Melton wool shapes tailored for wind protection.' },
    { season: 'ss25', title: 'Spring / Summer 25', theme: 'Kinetic Bias', desc: 'Experimenting with bias-cut silk panels and posture adaptation.' },
    { season: 'fw25', title: 'Autumn / Winter 25', theme: 'Monolith Canvas', desc: 'Heavy canvas utility shells featuring oversized pockets.' }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 border-b border-border/40 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black">
              ORLIEN VAULT LEDGER
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none">
              The Archive
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              "The History of ORLIEN". A digital museum displaying previous design frameworks and collections.
            </p>
          </div>

          {/* Timeline Eras */}
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary font-black">VAULT CHRONOLOGY</span>
              <h3 className="text-xl font-bold uppercase tracking-wide mt-1">Collection Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {eras.map((era) => (
                <Link
                  key={era.season}
                  href={`/archive/${era.season}`}
                  onClick={handleInteract}
                  className="group relative cursor-pointer bg-card/25 border border-border/40 hover:border-foreground/35 rounded-2xl p-5 flex flex-col justify-between text-left transition-all hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-xl bg-secondary overflow-hidden relative border border-border/30">
                      <img src="/runway/bts-01.avif" alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white font-mono uppercase tracking-widest">
                        {era.season.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                        {era.title}
                      </h4>
                      <p className="text-[9px] font-mono text-primary font-black uppercase mt-0.5">{era.theme}</p>
                      <p className="text-xs text-muted-foreground font-light leading-relaxed mt-2 font-serif">
                        {era.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/20 mt-4 text-[9px] font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 group/btn">
                    <span>Inspect Vault</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Archive Vault Stats */}
          <div className="p-8 border border-border/40 bg-card/5 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <span className="text-[8px] font-mono text-primary font-black uppercase tracking-wider">TOTAL PIECES</span>
              <h4 className="text-3xl font-black font-heading text-foreground mt-1">420+</h4>
              <p className="text-xs text-muted-foreground mt-1">Garments stored in physical vault</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-primary font-black uppercase tracking-wider">GOTS CERTIFIED</span>
              <h4 className="text-3xl font-black font-heading text-foreground mt-1">100%</h4>
              <p className="text-xs text-muted-foreground mt-1">Full ecological supply traceability</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-primary font-black uppercase tracking-wider">ACTIVE SINCE</span>
              <h4 className="text-3xl font-black font-heading text-foreground mt-1">2024</h4>
              <p className="text-xs text-muted-foreground mt-1">Bespoke design logs cataloged</p>
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
