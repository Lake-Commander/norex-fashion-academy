'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function SustainabilityPage() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const reports = [
    {
      title: '97.2% Pattern Yield Efficiency',
      metric: '2.8% SCRAPS',
      theme: 'Zero-Waste Engineering',
      desc: 'By feeding pattern lines into mathematical layout grids before cutting, our atelier panels are nested tightly together. Creative scrap margins are dropped to 2.8%, dramatically surpassing standard manufacturing waste metrics.'
    },
    {
      title: 'Artisanal Textile Alliances',
      metric: '100% TRACEABLE',
      theme: 'Ethical Local Sourcing',
      desc: 'We secure direct trade agreements with traditional weaving cooperatives and sustainable fiber mills across West Africa, ensuring fair wage metrics and protecting heritage craftsmanship roots.'
    },
    {
      title: 'Circular Academy Upcycling',
      metric: '100% RECLAIMED REMNANTS',
      theme: 'Creative Textile Rebirth',
      desc: 'Residual offcuts of premium silk, crepe, and traditional fabrics are systematically gathered and repurposed into statement details, headwear, or student experimental modules within our design academy.'
    }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <style>{`
        .back-link {
          font-size: 0.75rem; color: #6b7280; text-decoration: none; 
          transition: color 0.3s ease; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;
        }
        .back-link:hover { color: #C9A84C; }

        .pillar-card {
          background-color: white; padding: 2rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px; display: flex; flex-direction: column; justify-content: space-between;
        }
        .pillar-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .metric-badge {
          background-color: rgba(201,168,76,0.1); color: #C9A84C; padding: 0.25rem 0.6rem;
          font-size: 0.65rem; font-weight: 700; border-radius: 2px; border: 1px solid rgba(201,168,76,0.2);
          font-family: monospace; letter-spacing: 0.05em;
        }

        .vision-img-wrapper {
          position: relative; overflow: hidden; border: 1px solid #f0ebe3;
          aspect-ratio: 21/9; border-radius: 2px; background-color: #F0EBE3;
        }
        .vision-img {
          width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;
        }
        .vision-img-wrapper:hover .vision-img {
          transform: scale(1.03);
        }
      `}</style>

      <section className="relative w-full py-24 md:py-32 border-b border-border/40 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.04),_transparent,_transparent)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-20">
          
          {/* Breadcrumb Back Link */}
          <div style={{ borderBottom: "1px solid #f0ebe3", paddingBottom: "1rem" }} className="flex items-center gap-2">
            <Link href="/about" onClick={handleInteract} className="back-link flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>The House of Norex</span>
            </Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.75rem", color: "#C9A84C", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Sustainability & Vision</span>
          </div>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: "#C9A84C" }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[9px] uppercase tracking-widest font-black">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span>ENVIRONMENTAL AUDIT RESOLUTION</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }} className="tracking-tight uppercase">
                Luxury With Intention
              </h1>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8 }} className="font-light">
                Norex Fashion reconciles striking couture and ready-to-wear expressions with ecological discipline. We prioritize carefully managed material supply chains, stand firmly behind ethical artisan contracts, and harness mathematical layout models to systematically design waste out of our production cycle.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <div className="vision-img-wrapper">
                <img src="/runway/bts-06.avif" alt="Norex zero waste pattern cutting layout" className="vision-img" style={{ filter: "grayscale(1) contrast(1.05)" }} />
              </div>
            </div>
          </div>

          {/* Detailed Reports Grid */}
          <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "4rem" }} className="space-y-8">
            <div>
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">CONSCIOUS CAPACITIES</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginTop: "0.5rem" }} className="uppercase tracking-wide">Sustainability Pillars</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reports.map((rep) => (
                <div 
                  key={rep.title} 
                  onMouseEnter={handleInteract}
                  className="pillar-card"
                >
                  <div className="space-y-4">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#C9A84C", letterSpacing: "0.1em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase">{rep.theme}</span>
                      <span className="metric-badge">{rep.metric}</span>
                    </div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }} className="uppercase">{rep.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                      {rep.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GOTS / GRS Verification Stamp */}
          <div style={{ border: "1px solid #f0ebe3", backgroundColor: "#FAF7F4", padding: "2rem", borderRadius: "2px" }} className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-4xl space-y-2">
              <div style={{ color: "#C9A84C", letterSpacing: "0.15em", fontSize: "0.65rem", fontWeight: 700 }} className="flex items-center gap-1.5 font-mono uppercase">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>AUTHENTICATED ECO STANDARDS</span>
              </div>
              <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a" }} className="uppercase tracking-wide">Supply Chain Integrity</h4>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                Norex Fashion cross-references production records with standard organic textile and recycling benchmarks across our supplier ecosystem. We hold our materials to strict transparency definitions, ensuring a verified, responsible lifecycle for both store clients and academy trainees.
              </p>
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}