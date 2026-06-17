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
                  { name: "New Arrivals", path: "/shop" },
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
              
              <div className="flex gap-3">
                {[
                  { icon: Mail, label: "Email Terminal Support", action: () => window.open("mailto:hello@norexfashion.com") },
                  { icon: Send, label: "Telegram Dispatch Pipeline", action: () => window.open("https://t.me/norexfashion", "_blank") },
                  { icon: Star, label: "Rate Client Experience Console", action: () => router.push(isAuthenticated ? "/dashboard" : "/login") }
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { handleLinkClick(); social.action(); }}
                      className="f-social-btn h-8 w-8 rounded-full text-zinc-500 hover:text-[#C9A84C]"
                      title={social.label}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}