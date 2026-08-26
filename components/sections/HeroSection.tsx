"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

//type is either image or video
const slides = [
  {
    type: "image", 
    mediaSrc: "/hero3.jpeg",
    season: "NOREX ATELIER // DELTA, WARRI, NIGERIA · EST. 2016",
    titlePrefix: "WHERE FASHION MEETS",
    desc: "Discover premium ready-to-wear collections and world-class fashion education engineered beyond transient trends. Step into the future of luxury tailoring.",
    link: "/shop",
    actionText: "Shop Collection"
  },
  {
    type: "image",
    mediaSrc: "/hero2.jpeg",
    season: "NOREX ACADEMY // PROFESSIONAL MATRICULATION PATTERNS",
    titlePrefix: "CULTIVATING ARCHITECTURAL",
    desc: "Meticulously curated training workflows balancing classical lines with sophisticated silhouettes. Experience structural garment assembly guides.",
    link: "/academy",
    actionText: "Explore Academy"
  }
];

const rotatingWords = ["Artistry", "Elegance", "Culture", "Identity"];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wordAnimating, setWordAnimating] = useState(false);
  
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordAnimating(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        setWordAnimating(false);
      }, 500);
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [currentSlide]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotSelect = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full min-h-[95vh] md:min-h-screen bg-[#1a1a1a] overflow-hidden flex items-center justify-center select-none">
      
      <style>{`
        /* 🔥 FIX: Constrained text layouts and adjusted margins to stop component collision */
        .word-mask { 
          display: inline-block; 
          position: relative;
          overflow: hidden; 
          vertical-align: bottom; 
          height: 1.2em; 
          min-width: 180px;
          margin-top: 0.25rem;
        }
        @media(min-width: 640px) { .word-mask { min-width: 320px; } }
        
        .word-inner {
          display: inline-block; color: #C9A84C; font-style: italic;
          position: absolute; bottom: 0; left: 0; white-space: nowrap;
          animation: revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .word-inner.exit { animation: hideDown 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

        @keyframes revealUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0%); opacity: 1; }
        }
        @keyframes hideDown {
          0% { transform: translateY(0%); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }

        .hero-stats { display: none; }
        @media(min-width: 1024px) {
          .hero-stats {
            display: flex; flex-direction: column; gap: 1.5rem;
            align-items: flex-end; position: absolute;
            bottom: 6.5rem; right: 2.5rem; z-index: 40;
          }
        }
      `}</style>

      {/* Dynamic Video or Image Background Media Layer */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        {slide.type === "video" ? (
          <video autoPlay muted loop playsInline key={slide.mediaSrc} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}>
            <source src={slide.mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={slide.mediaSrc} alt="Campaign presentation" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.04] border-x border-dashed border-white/20 mx-auto max-w-7xl hidden lg:grid grid-cols-4 items-stretch">
        <div className="border-r border-dashed border-white/20" />
        <div className="border-r border-dashed border-white/20" />
        <div className="border-r border-dashed border-white/20" />
        <div className="border-transparent" />
      </div>

      <div className="absolute top-28 left-8 text-[8px] font-mono tracking-[0.3em] text-white/30 hidden md:block">
        SYS_CORD // 5.5442° N, 5.7606° E <br/>
        ATELIER_GRID_V2.026
      </div>
      <div className="absolute top-28 right-8 text-[8px] font-mono tracking-[0.3em] text-white/30 hidden md:block text-right">
        MODEL_REF // NOREX_CORE <br/>
        SERIES_DROP_AW26
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 z-20 flex flex-col justify-end pt-32 pb-12 min-h-[95vh] md:min-h-screen relative">
        <div className="max-w-3xl space-y-6 md:space-y-7 text-left mt-auto">
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 text-[#C9A84C] transition-all duration-700 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <Sparkles className="h-3 w-3 animate-pulse text-[#C9A84C] shrink-0" />
            <span className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.2em] font-black font-mono">{slide.season}</span>
          </div>

          <h1 
            className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] uppercase transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {slide.titlePrefix} <br />
            <span className="word-mask">
              <span key={currentWord} className={`word-inner ${wordAnimating ? "exit" : ""}`}>
                {rotatingWords[currentWord]}
              </span>
            </span>
          </h1>

          <p className={`text-sm md:text-base text-zinc-300 leading-relaxed font-light max-w-xl transition-all duration-700 delay-100 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {slide.desc}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2 transition-all duration-700 delay-200 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <Link href={slide.link} className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-[#C9A84C] text-[#1a1a1a] hover:text-white font-mono font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-sm">
              {slide.actionText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link href="/lookbook" className="inline-flex items-center justify-center px-8 py-4 rounded-sm border border-white/20 hover:border-white/50 text-white hover:bg-white/5 font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all active:scale-95 min-w-[170px]">
              View Lookbook
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "200+", label: "Designs" },
            { value: "150+", label: "Graduates" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem", fontFamily: "var(--font-sans), sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center justify-between border-t border-white/10 pt-6 mt-16 md:mt-24">
          <div className="text-xs font-mono text-white/50 tracking-widest flex items-center gap-2">
            <span className="font-bold text-[#C9A84C]">0{currentSlide + 1}</span>
            <span className="text-white/20">/</span>
            <span className="opacity-40">0{slides.length}</span>
          </div>

          <div className="flex gap-2.5">
            {slides.map((_, index) => (
              <button key={index} onClick={() => handleDotSelect(index)} className={`h-1 rounded-sm transition-all duration-500 ${index === currentSlide ? 'w-10 bg-[#C9A84C]' : 'w-2.5 bg-white/20 hover:bg-white/40'}`} title={`Slide Node 0${index + 1}`} />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handlePrev} disabled={isTransitioning} className="h-10 w-10 rounded-sm border border-white/10 hover:border-white/40 hover:bg-white/5 flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-20" title="Previous Directive"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={handleNext} disabled={isTransitioning} className="h-10 w-10 rounded-sm border border-white/10 hover:border-white/40 hover:bg-white/5 flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-20" title="Next Directive"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] bg-[#C9A84C] transition-all duration-[8000ms] ease-linear z-30" style={{ width: isTransitioning ? '0%' : '100%' }} />
    </section>
  );
}