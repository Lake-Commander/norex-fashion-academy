'use client'

import React from "react";
import Link from "next/link";

// Core Components
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AcademyHighlight from "@/components/sections/AcademyHighlight";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import Testimonials from "@/components/sections/Testimonials";

// Premium High-Fashion Section Components
import BrandManifesto from "@/components/sections/extra/brand-manifesto";
import FeaturedCollections from "@/components/sections/extra/featured-collections";
import SignaturePieces from "@/components/sections/extra/signature-pieces";
import HouseAbout from "@/components/sections/extra/house-about";
import CraftsmanshipExperience from "@/components/sections/extra/craftsmanship-experience";
import FashionFilm from "@/components/sections/extra/fashion-film";
import EditorialJournal from "@/components/sections/extra/editorial-journal";
import RunwayArchive from "@/components/sections/extra/runway-archive";
import CreativeDirector from "@/components/sections/extra/creative-director";
import Sustainability from "@/components/sections/extra/sustainability";
import GlobalPresence from "@/components/sections/extra/global-presence";
import Newsletter from "@/components/sections/extra/newsletter";
import StyleOracle from "@/components/style-oracle";

export default function HomePage() {
  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-0">
      
      {/* 01. Immersive Hero Entrance */}
      <HeroSection />

      {/* 02. High-Fashion Marquee Ticker (Customized for Norex) */}
      <div className="w-full bg-[#030303] border-y border-border/25 py-5 overflow-hidden whitespace-nowrap select-none font-mono text-[9px] tracking-[0.2em] text-white">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-loop {
            display: inline-flex;
            animation: marquee 25s linear infinite;
          }
        `}</style>
        
        <div className="animate-marquee-loop flex gap-16">
          <div className="shrink-0 flex items-center gap-16">
            <Link href="/runway" className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-white no-underline">
              <span className="font-sans font-bold text-white">NOREX HOUSE</span>
              <span className="text-[7px] bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-black tracking-normal">SS26</span>
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/runway" className="hover:text-primary transition-colors font-serif italic text-xs tracking-normal font-light cursor-pointer text-white no-underline">
              Tailored Beyond Trends
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-white no-underline">
              <span>ATELIER REGISTRY ACTIVE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </Link>
            <span className="text-white/20">•</span>
            <span style={{ color: goldColor }} className="font-serif italic text-xs tracking-normal font-light">
              Timeless Expression
            </span>
            <span className="text-white/20">•</span>
            <Link href="/shop" className="hover:text-primary transition-colors font-sans font-bold tracking-[0.25em] cursor-pointer text-white no-underline">
              WEST AFRICAN COUTURE
            </Link>
            <span className="text-white/20">•</span>
            <span className="opacity-50 font-mono">EST_2026 // CO_REF_NRX</span>
            <span className="text-white/20">•</span>
          </div>

          {/* Repeated block for seamless infinite looping */}
          <div className="shrink-0 flex items-center gap-16">
            <Link href="/runway" className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-white no-underline">
              <span className="font-sans font-bold text-white">NOREX HOUSE</span>
              <span className="text-[7px] bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-black tracking-normal">SS26</span>
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/runway" className="hover:text-primary transition-colors font-serif italic text-xs tracking-normal font-light cursor-pointer text-white no-underline">
              Tailored Beyond Trends
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-white no-underline">
              <span>ATELIER REGISTRY ACTIVE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </Link>
            <span className="text-white/20">•</span>
            <span style={{ color: goldColor }} className="font-serif italic text-xs tracking-normal font-light">
              Timeless Expression
            </span>
            <span className="text-white/20">•</span>
            <Link href="/shop" className="hover:text-primary transition-colors font-sans font-bold tracking-[0.25em] cursor-pointer text-white no-underline">
              WEST AFRICAN COUTURE
            </Link>
            <span className="text-white/20">•</span>
            <span className="opacity-50 font-mono">EST_2026 // CO_REF_NRX</span>
            <span className="text-white/20">•</span>
          </div>
        </div>
      </div>

      {/* 03. Identity Manifesto */}
      <BrandManifesto />

      {/* 04. Standard Featured Inventory Display */}
      <FeaturedCollection />

      {/* 05. Advanced Design Token Collections Toggle */}
      <FeaturedCollections />

      {/* 06. Signature Textile & Material Showcase */}
      <SignaturePieces />

      {/* 07. Workspace Statistics Grid */}
      <StatsSection />

      {/* 08. Premium Academy Education Highlight */}
      <AcademyHighlight />

      {/* 09. Deeper Insight Into The House Framework */}
      <HouseAbout />

      {/* 10. Atelier Craftsmanship Milestones */}
      <CraftsmanshipExperience />

      {/* 11. Cinematic Widescreen Brand Film */}
      <FashionFilm />

      {/* 12. Norex Gazette Magazine Grid */}
      <EditorialJournal />

      {/* 13. Historical Runway Timeline Archive */}
      <RunwayArchive />

      {/* 14. Creative Director Message Frame */}
      <CreativeDirector />

      {/* 15. Social Proof Client Testimonials */}
      <Testimonials />

      {/* 16. Sustainability & Zero-Waste Agenda */}
      <Sustainability />

      {/* 17. Studio Station Location Coordinates */}
      <GlobalPresence />

      {/* 18. End of Page Action Banner */}
      <section className="py-20 bg-[#FAF7F4] border-t border-[#f0ebe3]">
        <div className="container-custom text-center">
          <p className="block mb-4 text-sm font-semibold tracking-widest text-[#C9A84C] uppercase">
            Get In Touch
          </p>
          <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Ready to Begin Your Journey?
          </h2>
          <p className="max-w-[450px] mx-auto mb-10 text-[0.95rem] leading-[1.8] text-[#6b7280]">
            Whether you are looking for your next custom piece or ready to launch your creative career — our atelier channels are open for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center min-w-[220px] px-10 py-3.5 bg-[#C9A84C] border-2 border-[#C9A84C] text-white text-[0.8rem] font-semibold tracking-[0.15em] uppercase no-underline transition-all duration-300 rounded-sm hover:bg-[#B49542] hover:border-[#B49542] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,168,76,0.4)]"
            >
              Contact Us
            </Link>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center min-w-[220px] px-10 py-3.5 border-2 border-[#C9A84C] text-[#C9A84C] bg-transparent text-[0.8rem] font-semibold tracking-[0.15em] uppercase no-underline transition-all duration-300 rounded-sm hover:bg-[#C9A84C] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,168,76,0.2)]"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

      {/* 19. Community Newsletter Experience */}
      <Newsletter />
      
      {/* 20. Hidden Background Activation State Layer for AI Stylist Drawer */}
      <StyleOracle />
      
    </main>
  );
}