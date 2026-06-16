'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { ChevronRight, X, BookOpen, Star, Quote, Compass, Clock, ArrowRight, TrendingUp, Loader2 } from 'lucide-react'
import { useTelemetry } from "@/hooks/useTelemetry" // ⚡ Telemetry Import
import Link from 'next/link'

export default function EditorialPage() {
  const { soundEnabled } = useShop()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
  
  const { trackRead } = useTelemetry() // ⚡ Destructure Hook

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/editorial");
        const data = await res.json();
        if (data.success) {
          setArticles(data.publications.filter((p: any) => p.contentType === "article"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); }
  
  // ⚡ Telemetry: Track exact article ID whenever drawer view opens
  const handleSelectArticle = (article: any) => { 
    if (soundEnabled) sounds.playChord(); // Fixed: Resolved missing signature crash
    setSelectedArticle(article);
    trackRead(article._id); 
  }
  
  const handleCloseDrawer = () => { if (soundEnabled) sounds.playSweep(); setSelectedArticle(null); }

  const categories = ['ALL', 'COUTURE & ATELIER', 'SUSTAINABILITY DECK', 'CULTURE & HERITAGE']
  const filteredArticles = activeCategory === 'ALL' ? articles : articles.filter(art => art.category.toUpperCase() === activeCategory)
  
  const coverStory = articles[0];
  const goldColor = "#C9A84C"

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />
      <style>{`
        .gazette-border { border-color: #1a1a1a; } .text-gold { color: #C9A84C; } .bg-gold { background-color: #C9A84C; }
        .article-card { border: 1px solid #e5e7eb; padding: 1.25rem; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); background-color: white; }
        .article-card:hover { border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.08); transform: translateY(-2px); }
        .pick-row { display: flex; gap: 1rem; padding: 0.75rem; border: 1px solid #e5e7eb; transition: all 0.3s ease; background-color: white; }
        .pick-row:hover { border-color: #C9A84C; transform: translateX(2px); }
        .btn-black-outline { display: inline-flex; padding: 0.75rem 1.5rem; border: 1px solid #1a1a1a; background: none; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; cursor: pointer; transition: all 0.3s; }
        .btn-black-outline:hover { background-color: #1a1a1a; color: white; }
        .drawer-overlay { position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; justifyContent: flex-end; }
      `}</style>

      <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-24 md:px-8">
        <header style={{ borderBottom: "2px solid #1a1a1a" }} className="pb-6 mb-12 text-center space-y-4">
          <div style={{ borderColor: "#e5e7eb" }} className="text-[10px] font-mono tracking-[0.3em] text-[#6b7280] uppercase flex justify-between items-center border-b pb-2">
            <span>ISSUE NO. 04 // SEASONAL 2026</span>
            <span className="hidden md:inline">POWERED BY NOREX DESIGN ACADEMY STATIONS</span>
            <span>EST. WARRI, NIGERIA</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900, color: "#1a1a1a" }} className="tracking-tighter uppercase select-none leading-none pt-2">Norex Gazette</h1>
          <p style={{ letterSpacing: "0.2em" }} className="text-[10px] font-mono text-[#6b7280] uppercase pt-1">THE CHRONICLES OF WEST AFRICAN TAILORING, GEOMETRIC CONTOURS & COUTURE EDUCATION</p>
        </header>

        {loading ? (
          <div className="py-24 text-center flex justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" /></div>
        ) : articles.length === 0 ? (
          <p className="text-center font-mono text-zinc-400 text-xs uppercase py-12">No Gazette print files streaming currently.</p>
        ) : (
          <>
            {coverStory && (
              <section style={{ borderBottom: "1px solid #e5e7eb" }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 mb-12 items-center">
                <div onClick={() => handleSelectArticle(coverStory)} style={{ border: "1px solid #e5e7eb" }} className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden bg-gray-100 cursor-pointer group relative shadow-sm">
                  <img src={coverStory.image || "/placeholder-garment.png"} alt={coverStory.title} className="w-full h-full object-cover filter grayscale contrast-[1.02] group-hover:grayscale-0 transition-all duration-[1000ms]" />
                  <div style={{ background: "rgba(26,26,26,0.75)" }} className="absolute bottom-4 left-4 px-3 py-1 text-[8px] text-white font-mono uppercase tracking-widest rounded-sm font-bold">COVER STORY</div>
                </div>
                <div className="lg:col-span-5 text-left space-y-4">
                  <span style={{ color: "#C9A84C", letterSpacing: "0.15em" }} className="text-[9px] font-mono uppercase font-bold block">{coverStory.category}</span>
                  <h2 onClick={() => handleSelectArticle(coverStory)} style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15 }} className="uppercase text-[#1a1a1a] hover:text-[#C9A84C] cursor-pointer transition-colors">{coverStory.title}</h2>
                  <p className="text-sm text-[#4b5563] font-serif italic leading-relaxed">"{coverStory.summary}"</p>
                  <div style={{ borderTop: "1px solid #f0ebe3" }} className="pt-3 flex items-center justify-between text-[10px] font-mono text-[#6b7280]">
                    <span>By {coverStory.author}</span><span>{coverStory.readTime}</span>
                  </div>
                  <button onClick={() => handleSelectArticle(coverStory)} className="btn-black-outline inline-flex gap-2 items-center mt-2 group">
                    <span>Read Studio Feature</span><ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-10 text-left">
                <div style={{ borderBottom: "1px solid #e5e7eb" }} className="flex flex-wrap items-center gap-2 pb-5 overflow-x-auto">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { handleInteract(); setActiveCategory(cat) }} style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }} className={`px-4 py-2 border rounded-full font-bold uppercase transition-all ${activeCategory === cat ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' : 'border-gray-300 text-[#6b7280] hover:border-[#C9A84C] hover:text-[#C9A84C]'}`}>{cat.replace('SUSTAINABILITY DECK', 'LAB LEDGER')}</button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {filteredArticles.map((art) => (
                    <article key={art._id} className="article-card flex flex-col justify-between bg-white shadow-sm">
                      <div className="space-y-4">
                        <div onClick={() => handleSelectArticle(art)} style={{ border: "1px solid #f0ebe3" }} className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 cursor-pointer"><img src={art.image || "/placeholder-garment.png"} alt={art.title} loading="lazy" className="w-full h-full object-cover filter grayscale contrast-[1.03] hover:grayscale-0 transition-all duration-700" /></div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-[#6b7280] uppercase tracking-wider">
                          <span style={{ color: "#C9A84C" }}>{art.category}</span><span>{art.date}</span>
                        </div>
                        <h3 onClick={() => handleSelectArticle(art)} style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }} className="uppercase text-[#1a1a1a] hover:text-[#C9A84C] cursor-pointer line-clamp-2">{art.title}</h3>
                        <p className="text-xs text-[#6b7280] leading-relaxed font-light line-clamp-3">{art.summary}</p>
                      </div>
                      <div style={{ borderTop: "1px solid #f9f9f9" }} className="pt-4 mt-5 flex items-end justify-between">
                        <div className="text-[8px] font-mono text-gray-400 leading-tight">
                          <div>IMAGE: {art.photography}</div><div>STYLING: {art.styling}</div>
                        </div>
                        <button onClick={() => handleSelectArticle(art)} className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#C9A84C] flex items-center gap-1 group"><span>Open Story</span><ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-4 space-y-10 border-t lg:border-t-0 lg:border-l pt-10 lg:pt-0 lg:pl-10 text-left">
                <div className="space-y-6">
                  <h4 style={{ borderBottom: "2px solid #1a1a1a" }} className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a1a] font-black pb-2 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-gold" /><span>CRITICAL ACCLAIM COUTURE</span></h4>
                  <div style={{ borderBottom: "1px solid #e5e7eb" }} className="space-y-2 pb-5">
                    <div className="flex items-center justify-between"><span className="font-serif font-bold text-xs text-[#1a1a1a]">LAGOS FASHION WEEK</span><div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div></div>
                    <blockquote className="text-xs font-serif italic text-[#4b5563] leading-relaxed">"Norex has delivered an impeccable statement of structural integrity. Their evening gowns represent a brilliant fusion of mathematical calculations and timeless Nigerian identity."</blockquote>
                    <p className="text-[9px] font-mono text-[#9ca3af] uppercase">— Runway Report Editor</p>
                  </div>
                </div>

                <div style={{ border: "1px solid #1a1a1a" }} className="p-6 bg-white text-center space-y-4">
                  <h5 className="text-xs font-mono font-black uppercase tracking-wider">THE ATELIER JOURNAL</h5>
                  <p className="text-[11px] text-[#6b7280] font-light leading-relaxed">Receive physical copies of the Norex Gazette directly to your station, complete with seasonal swatch bundles.</p>
                  <Link href="/contact" className="block w-full py-3 bg-[#1a1a1a] text-white hover:bg-[#C9A84C] transition-all font-mono font-bold uppercase text-[10px] tracking-widest text-decoration-none">REQUEST REGISTER ACCESS</Link>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {selectedArticle && (
        <div className="drawer-overlay" style={{ animation: "fadeIn 0.3s ease out" }}>
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseDrawer} />
          <div style={{ borderLeft: "1px solid #e5e7eb" }} className="relative w-full max-w-2xl bg-[#faf9f6] text-[#1a1a1a] h-full flex flex-col p-6 md:p-10 shadow-2xl z-10 overflow-y-auto">
            <div style={{ borderBottom: "1px solid #e5e7eb" }} className="flex items-center justify-between pb-4 mb-6">
              <div className="text-left font-mono"><span style={{ color: "#C9A84C", letterSpacing: "0.15em" }} className="text-[9px] font-bold uppercase">{selectedArticle.category}</span><div className="text-[10px] text-[#9ca3af] font-mono mt-0.5">NOREX GAZETTE // JOURNAL CORE</div></div>
              <button onClick={handleCloseDrawer} style={{ border: "1px solid #e5e7eb" }} className="p-2 rounded-full hover:bg-gray-100"><X className="h-4 w-4" /></button>
            </div>
            <article className="space-y-6 text-left max-w-xl mx-auto">
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 }} className="uppercase text-[#1a1a1a]">{selectedArticle.title}</h2>
              <div style={{ border: "1px solid #e5e7eb" }} className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#6b7280] py-2 border-t border-b">
                <div className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-gray-400" /><span>By <strong className="text-black font-bold">{selectedArticle.author}</strong></span></div>
                <div>•</div><div>{selectedArticle.date}</div><div>•</div><div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" /><span>{selectedArticle.readTime}</span></div>
              </div>
              <div style={{ border: "1px solid #e5e7eb" }} className="aspect-[16/9] w-full overflow-hidden my-4"><img src={selectedArticle.image || "/placeholder-garment.png"} alt={selectedArticle.title} className="w-full h-full object-cover" /></div>
              <div className="space-y-4 font-serif text-sm leading-relaxed text-[#222]">
                {selectedArticle.content?.map((p: string, idx: number) => (
                  <p key={idx} className={`font-light text-justify ${idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:font-black first-letter:text-[#C9A84C]" : ""}`}>{p}</p>
                ))}
              </div>
              {selectedArticle.pullQuote && (
                <div style={{ borderTop: "2px solid #1a1a1a", borderBottom: "2px solid #1a1a1a" }} className="my-8 py-6 text-center relative max-w-md mx-auto">
                  <Quote className="h-8 w-8 text-gold opacity-10 absolute top-2 left-2 pointer-events-none" />
                  <blockquote style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem" }} className="italic text-[#1a1a1a] leading-relaxed px-6">"{selectedArticle.pullQuote}"</blockquote>
                </div>
              )}
            </article>
          </div>
        </div>
      )}
      <StyleOracle /><Footer />
    </main>
  )
}