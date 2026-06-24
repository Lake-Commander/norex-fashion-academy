'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function ArchivePage() {
  const { soundEnabled } = useShop()
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVaultChronology() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        if (data.success) setCollections(data.collections);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadVaultChronology();
  }, []);

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />

      {/* ⚡ FIXED: Adjusted from py-16 to explicit pt-32 on mobile and md:pt-40 on desktop to prevent absolute nav content masking */}
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 border-b border-border/40">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-black">
              NOREX VAULT LEDGER
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-zinc-900">
              The Archive
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              "The Chronology of Norex Tailoring". A digital museum indexing historical design layout maps and baseline seasonal frameworks.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase">VAULT SEASONS CHRONOLOGY</span>
              <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-zinc-900">Collection Timeline</h3>
            </div>
            
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((era) => (
                  <Link
                    key={era._id}
                    href={`/archive/${era.slug}`}
                    onClick={handleInteract}
                    className="group relative cursor-pointer bg-white border border-zinc-200 hover:border-[#C9A84C] rounded-sm p-5 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="aspect-[4/3] rounded-sm bg-zinc-50 overflow-hidden relative border border-zinc-100">
                        <img src={era.coverImage || "/placeholder-garment.png"} alt="" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div style={{ backgroundColor: "#1a1a1a" }} className="absolute top-2 left-2 px-2 py-0.5 text-[8px] text-white font-mono uppercase tracking-widest rounded-sm font-bold">
                          {era.waSeason.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-base font-bold uppercase text-zinc-900 group-hover:text-[#C9A84C] transition-colors leading-tight">
                          {era.title}
                        </h4>
                        <p className="text-[10px] font-mono text-[#C9A84C] uppercase font-bold mt-1 tracking-wider">Visual: {era.photographer}</p>
                        <p className="text-xs text-zinc-500 font-light leading-relaxed mt-2 line-clamp-3 font-serif italic text-justify">
                          "{era.campaignPlot}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 mt-4 text-[9px] font-mono text-zinc-400 group-hover:text-zinc-900 transition-colors flex items-center justify-between font-bold uppercase">
                      <span>Inspect Vault</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Historical Vault Metrics Summary Stats Footnote */}
          <div className="p-8 border border-zinc-200 bg-[#FAF7F4] rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-[8px] font-mono text-zinc-400 font-black uppercase tracking-wider block">PHYSICAL VAULT ASSETS</span>
              <h4 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-black text-zinc-900 mt-1 font-mono">240+</h4>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Garments secured in long-term cedar vaults</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-zinc-400 font-black uppercase tracking-wider block">TEXTILE TRACKABILITY</span>
              <h4 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-black text-zinc-900 mt-1 font-mono">100%</h4>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Syllabus weave samples certified authentic</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-zinc-400 font-black uppercase tracking-wider block">CMS LOGGING TIMELINES</span>
              <h4 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-black text-zinc-900 mt-1 font-mono">2024</h4>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Atelier configuration indexes tracking active</p>
            </div>
          </div>

        </div>
      </section>

      <StyleOracle /><Footer />
    </main>
  )
}