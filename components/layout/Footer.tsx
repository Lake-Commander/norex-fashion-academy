"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { Mail, Send, Star, ArrowUp, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const { soundEnabled } = useShop();
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [showScrollBtn, setShowScrollTopBtn] = useState(false);

  useEffect(() => {
    const checkScrollHeight = () => {
      setShowScrollTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScrollHeight);
    return () => window.removeEventListener("scroll", checkScrollHeight);
  }, []);

  const handleLinkClick = () => {
    if (soundEnabled && (window as any).soundEnabled !== false) sounds.playClick();
  };

  const handleScrollTop = () => {
    if (soundEnabled && (window as any).soundEnabled !== false) sounds.playSweep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .f-link {
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0px;
        }
        .f-link:hover {
          color: #C9A84C !important;
          transform: translateX(4px);
        }
        .f-link-bullet {
          width: 0px;
          height: 1px;
          background-color: #C9A84C;
          transition: all 0.3s ease;
        }
        .f-link:hover .f-link-bullet {
          width: 6px;
          margin-right: 6px;
        }
        .f-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0.7;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
        }
        .f-social-btn:hover {
          transform: translateY(-3px);
          opacity: 1;
          border-color: #C9A84C;
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15);
        }
        .float-scroll-bubble {
          position: fixed;
          bottom: 5.5rem;
          right: 2rem;
          background: #1a1a1a;
          color: white;
          border: 1.5px solid #C9A84C;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 45;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
        }
        .float-scroll-bubble.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .float-scroll-bubble:hover {
          background: #C9A84C;
          color: #1a1a1a;
          box-shadow: 0 6px 24px rgba(201, 168, 76, 0.4);
        }
        @media(max-width: 991px) {
          .float-scroll-bubble {
            bottom: 6rem;
            right: 1.5rem;
          }
        }
      `}</style>

      {/* Floating Cinematic Back-To-Top Arrow Trigger Node */}
      <button
        type="button"
        onClick={handleScrollTop}
        className={`float-scroll-bubble ${showScrollBtn ? "visible" : ""}`}
        aria-label="Scroll back to top boundary"
      >
        <ArrowUp size={18} className="animate-pulse" />
      </button>

      <footer style={{ backgroundColor: "#050505", color: "#a1a1aa" }} className="border-t border-white/5 font-sans">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            
            {/* Brand Column Matrix */}
            <div className="col-span-2 md:col-span-1 space-y-4 text-left">
              <Link href="/" onClick={handleLinkClick} className="block w-fit">
                <img src="/tolani-logo.png" alt="NOREX" className="h-14 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-xs leading-relaxed max-w-xs font-light text-zinc-500">
                Curating timeless West African tailoring textures and advanced geometric contours for a modern luxury lifestyle.
              </p>
              <div className="text-[10px] text-zinc-600 font-mono tracking-widest font-bold uppercase">ESTABLISHED / 2016</div>
            </div>

            {/* Collection Catalog Lines */}
            <div className="text-left">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Collections</h4>
              <ul className="space-y-3 text-xs font-light list-none p-0 m-0">
                {[
                  { name: "New Arrivals", path: "/new-arrivals" },
                  { name: "Best Sellers", path: "/shop" },
                  { name: "Collections", path: "/collections" },
                  { name: "Bespoke Atelier", path: "/house/craftsmanship" }
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.path} onClick={handleLinkClick} className="f-link">
                      <span className="f-link-bullet" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academy & Customer Care Segment Mapping Matrix */}
            <div className="text-left">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Academy & Care</h4>
              <ul className="space-y-3 text-xs font-light list-none p-0 m-0">
                {[
                  { name: "Academy Hub", path: "/academy" },
                  { name: "Explore Courses", path: "/academy/courses" },
                  { name: "Apply Online", path: "/academy/apply" },
                  { name: "Help Center FAQ", path: "/customer-care" }, // Links directly to page root layout
                  { name: "Shipping Info", path: "/customer-care" },  // Links straight to tab selectors
                  { name: "Returns Policy", path: "/customer-care" }, // Links straight to tab selectors
                  { name: "Size Guides", path: "/customer-care" }     // Links straight to tab selectors
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.path} onClick={handleLinkClick} className="f-link">
                      <span className="f-link-bullet" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Studio Identity Coordinates Contact */}
            <div className="text-left">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Contact & House</h4>
              <ul className="space-y-3.5 text-xs font-light list-none p-0 m-0">
                <li className="flex items-start gap-2.5 text-zinc-400">
                  <MapPin size={15} className="text-[#C9A84C] shrink-0 mt-0.5" />
                  <span>Warri, Delta State, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#C9A84C] shrink-0" />
                  <a href="tel:+2348081258048" onClick={handleLinkClick} className="f-link">
                    <span>+234 808 125 8048</span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#C9A84C] shrink-0" />
                  <a href="mailto:hello@norexfashion.com" onClick={handleLinkClick} className="f-link">
                    <span>hello@norexfashion.com</span>
                  </a>
                </li>
                <li className="pt-2 flex flex-col gap-2">
              <Link href="/privacy" className="text-[10px] font-mono tracking-wider font-bold text-zinc-600 uppercase hover:text-[#C9A84C] transition-colors">
                Privacy Protection Policy
              </Link>
              <Link href="/terms" className="text-[10px] font-mono tracking-wider font-bold text-zinc-600 uppercase hover:text-[#C9A84C] transition-colors">
                Terms of Service
              </Link>
            </li>
              </ul>
            </div>
          </div>

          {/* Lower Copyright Horizon Strip */}
<div className="border-t border-white/5 pt-8 mt-10">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    <p className="text-[10px] tracking-widest text-zinc-600 font-mono font-bold uppercase">
      © 2026 NOREX FASHION. All rights reserved.
    </p>
    
    {/* Clean Branded Production Channels */}
    <div style={{ display: "flex", gap: "1rem" }}>
      
      {/* Instagram */}
      <a 
        href="https://www.instagram.com/norexdesigns/" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Instagram" 
        onClick={handleLinkClick}
        className="f-social-btn h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#C9A84C]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#igGradientFooter)">
          <defs>
            <linearGradient id="igGradientFooter" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      </a>

      {/* TikTok */}
      <a 
        href="https://www.tiktok.com/@fashionschool_inwarri1" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="TikTok" 
        onClick={handleLinkClick}
        className="f-social-btn h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#C9A84C]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
        </svg>
      </a>

      {/* Facebook */}
      <a 
        href="https://www.facebook.com/norexdesign/" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Facebook" 
        onClick={handleLinkClick}
        className="f-social-btn h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#C9A84C]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

    </div>
  </div>
</div>

        </div>
      </footer>
    </>
  );
}