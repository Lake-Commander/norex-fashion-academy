'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { ArrowLeft, Sparkles, Scissors, Layers, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CraftsmanshipPage() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const materials = [
    { name: 'Premium Silk Charmeuse', source: 'Luxury Silk Collectives', threadCount: 'Fluid Luminous Weight', desc: 'Sourced for our flagship evening wear and bridal linings. Possesses a brilliant finish and fluid drape coefficient that contours cleanly to natural body movement.' },
    { name: 'Heritage Hand-Woven Textiles', source: 'Artisan Loom Cooperatives', threadCount: 'High-Density Traditional Weave', desc: 'Premium hand-selected traditional elements woven with luxury cotton threads. Brings rich textures and authentic African structure into contemporary silhouettes.' },
    { name: 'Double-Plied Crepe & Wool Gabardine', source: 'Premium Mill houses', threadCount: 'Architectural Line Definition', desc: 'A heavy, breathable structural fabric treated with hand-steamed shrinkage to ensure tailored blazers and structured items hold pristine form across seasons.' }
  ]

  const tailoringSteps = [
    { step: '01', title: 'Measurement Architecture', desc: 'Garment components are charted against personalized contour guidelines, aligning panels in perfect geometric balance before the first cut.' },
    { step: '02', title: 'Internal Canvas Padding', desc: 'Bodices and chest areas are anchored with traditional custom inserts, ensuring necklines, wraps, and structural lapels drop cleanly without folding.' },
    { step: '03', title: 'Hand-Bound Silk Seams', desc: 'Raw internal construction pathways are bound in contrasting luxury satin silk tapes, exposing clean bespoke execution rather than concealing it.' }
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

        .ledger-card {
          background-color: white; padding: 2rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px; height: 100%;
        }
        .ledger-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .step-card {
          padding: 2rem; border: 1px solid #e5e7eb; border-radius: 2px;
          background-color: #FAF7F4; transition: all 0.3s ease; height: 100%;
        }
        .step-card:hover {
          border-color: #C9A84C; background-color: white;
        }

        .atelier-img-wrapper {
          position: relative; overflow: hidden; border: 1px solid #f0ebe3;
          aspect-ratio: 21/9; border-radius: 2px; background-color: #F0EBE3;
        }
        .atelier-img {
          width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;
        }
        .atelier-img-wrapper:hover .atelier-img {
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
            <span style={{ fontSize: "0.75rem", color: "#C9A84C", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Atelier Craftsmanship</span>
          </div>

          {/* Large Hero & Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)" }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-primary font-mono text-[9px] uppercase tracking-widest font-black">
                <Scissors className="h-3.5 w-3.5" />
                <span>STUDIO REGISTER NO. 04</span>
              </div>
              
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }} className="tracking-tight uppercase">
                Artistry In Every Thread
              </h1>
              
              <p style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.7rem", fontWeight: 700 }} className="font-mono uppercase block">
                HAND-PROCESSED FABRICS // DISCIPLINED BESPOKE EXECUTION
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <div className="atelier-img-wrapper">
                <img src="/runway/bts-05.avif" alt="Norex tailors finishing custom gown" className="atelier-img" style={{ filter: "grayscale(1) contrast(1.05)" }} />
              </div>
            </div>
          </div>

          {/* Materials Ledger Grid */}
          <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "4rem" }} className="space-y-8">
            <div className="space-y-2 text-left">
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span>FIBER ALLOCATIONS</span>
              </span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a" }} className="uppercase tracking-wide">The Materials Ledger</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {materials.map((mat) => (
                <div 
                  key={mat.name}
                  onMouseEnter={handleInteract}
                  className="ledger-card"
                >
                  <div className="space-y-3 text-left">
                    <span style={{ color: "#C9A84C", letterSpacing: "0.1em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">{mat.source} // {mat.threadCount}</span>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a" }} className="uppercase">{mat.name}</h4>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                      {mat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tailoring Steps Progress */}
          <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "4rem" }} className="space-y-8">
            <div className="space-y-2 text-left">
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">THE WORKSHOP MANIFESTO</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a" }} className="uppercase tracking-wide">Atelier Assembly Pipeline</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tailoringSteps.map((step) => (
                <div key={step.step} className="step-card">
                  <div style={{ color: "#C9A84C", fontSize: "1.75rem", fontWeight: 700 }} className="font-mono leading-none mb-3">{step.step}</div>
                  <h4 style={{ fontSize: "0.85rem", letterSpacing: "0.05em", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem" }} className="uppercase">{step.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Studio Statistics */}
          <div style={{ border: "1px solid #f0ebe3", backgroundColor: "#FAF7F4", padding: "2rem", borderRadius: "2px" }} className="flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="max-w-3xl space-y-2">
              <div style={{ color: "#C9A84C", letterSpacing: "0.15em", fontSize: "0.65rem", fontWeight: 700 }} className="flex items-center gap-1.5 font-mono uppercase">
                <CheckCircle2 className="h-4 w-4" />
                <span>ATELIER CALIBRATION STANDARDS</span>
              </div>
              <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a" }} className="uppercase tracking-wide">Studio Quality Index</h4>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                Every customized dress and formal piece undergoes 4 separate sizing configuration phases and demands upwards of 48 individual artisan hours inside our Warri production hall, verifying that every alignment contour matches our absolute high-fashion criteria before launch.
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