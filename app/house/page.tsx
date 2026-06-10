'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import Link from 'next/link'

export default function HousePage() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const values = [
    { title: 'Sartorial Precision', desc: 'Every stitch balances structure and drape, combining meticulous bespoke calculations with hand-finished Nigerian craftsmanship.' },
    { title: 'Academic Mentorship', desc: 'Empowering the next generation of creative minds through world-class pattern making and creative business training at our fashion academy.' },
    { title: 'Cultural Fusion', desc: 'Intertwining timeless classic silhouettes with rich African heritage materials, luxury silks, and vibrant traditional expressions.' }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <style>{`
        .value-card {
          background-color: white; padding: 2rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .value-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        
        .presence-card {
          padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 2px;
          background-color: #FAF7F4; transition: all 0.3s ease;
        }
        .presence-card:hover {
          border-color: #C9A84C; background-color: white;
        }
        
        .manifesto-img-wrapper {
          position: relative; overflow: hidden; border: 1px solid #f0ebe3;
          aspect-ratio: 21/9; border-radius: 2px; background-color: #F0EBE3;
        }
        .manifesto-img {
          width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;
        }
        .manifesto-img-wrapper:hover .manifesto-img {
          transform: scale(1.03);
        }
      `}</style>

      <section className="relative w-full py-24 md:py-32 border-b border-border/40 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.05),_transparent,_transparent)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-20">
          
          {/* Header */}
          <div style={{ borderBottom: "1px solid #f0ebe3", paddingBottom: "2.5rem" }} className="space-y-4 max-w-3xl">
            <span style={{ color: "#C9A84C", letterSpacing: "0.25em", fontSize: "0.7rem", fontWeight: 700 }} className="font-mono text-xs uppercase block">
              NOREX FASHION BRAND IDENTITY
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }} className="tracking-tight uppercase">
              The House of Norex
            </h1>
            <p style={{ letterSpacing: "0.08em" }} className="text-xs text-muted-foreground font-mono uppercase leading-relaxed">
              Premium Ready-To-Wear Collections & Luxury Fashion Education. Founded in Warri, Nigeria.
            </p>
          </div>

          {/* Brand Manifesto */}
          <div style={{ borderBottom: "1px solid #f0ebe3", paddingBottom: "4rem" }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">HOUSE MANIFESTO</span>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
                "Fashion is an unspoken dialogue between geometry, architecture, and personal identity."
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8 }} className="font-light">
                We believe in garments that serve as cultural statements. By merging structural, architectural contours with classic Nigerian aesthetics, Norex Fashion engineers luxury silhouettes designed to flex beautifully with natural movement while asserting a timeless couture presence.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="manifesto-img-wrapper">
                <img src="/runway/hero-banner-2.avif" alt="Norex design lines landscape" className="manifesto-img" />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-8">
            <div>
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">OUR BLUEPRINT</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginTop: "0.5rem" }} className="uppercase tracking-wide">Brand Philosophy</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="value-card">
                  <h4 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem" }} className="uppercase">{v.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7 }} className="font-light">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Global Presence Boutiques details */}
          <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "4rem" }} className="space-y-8">
            <div>
              <span style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.65rem", fontWeight: 700 }} className="font-mono uppercase block">PHYSICAL STATIONS</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginTop: "0.5rem" }} className="uppercase tracking-wide">Ateliers & Hubs</h3>
            </div>
            <div style={{ gap: "1.5rem" }} className="grid grid-cols-1 sm:grid-cols-3 font-mono text-xs">
              <div className="presence-card">
                <div style={{ fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.05em" }}>MAIN ACADEMY & HQ</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "0.5rem" }}>Warri, Delta State // Nigeria</div>
              </div>
              <div className="presence-card">
                <div style={{ fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.05em" }}>BESPOKE SALON</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "0.5rem" }}>Lekki Phase 1, Lagos // Nigeria</div>
              </div>
              <div className="presence-card">
                <div style={{ fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.05em" }}>DIGITAL PUBLISHING OUTPOST</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "0.5rem" }}>Fanavera Network Hub // Global Outreach</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}