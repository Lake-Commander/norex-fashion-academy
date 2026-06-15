"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import { Sparkles, ArrowRight, Loader2, Compass, Palette } from "lucide-react";
import Link from "next/link";

interface CollectionItem {
  _id: string;
  title: string;
  slug: string;
  waSeason: "Pluvial Drop" | "Harmattan Regal" | "August Break" | "Sultry Heat";
  campaignPlot: string;
  coverImage: string;
  btsImage: string;
  palette: Array<{ name: string; hex: string; rgb: string; desc: string }>;
  hasFilm: boolean;
  photographer: string;
  stylist: string;
}

export default function MainCollectionsHubPage() {
  const { soundEnabled } = useShop();
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollectionsCatalog() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        if (data.success) {
          setCollections(data.collections);
        }
      } catch (err) {
        console.error("Failed compiling public lookbook index rows:", err);
      } finally {
        setLoading(false);
      }
    }
    // Fixed: Changed name from loadCatalog() to match the declaration above
    loadCollectionsCatalog();
  }, []);

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop();
  };

  const handleLinkClick = () => {
    if (soundEnabled) sounds.playClick();
  };

  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-900 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />

      <style>{`
        .collections-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        
        .collection-master-card {
          background: white; border: 1px solid #e4e4e7; border-radius: 1px;
          overflow: hidden; display: grid; grid-template-columns: 1fr; gap: 2rem;
          padding: 1.5rem; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @media(min-width: 1024px) {
          .collection-master-card { grid-template-columns: 1.2fr 1fr; gap: 3.5rem; padding: 2.5rem; }
        }
        .collection-master-card:hover {
          border-color: #C9A84C; box-shadow: 0 20px 40px rgba(201, 168, 76, 0.05);
          transform: translateY(-4px);
        }
        
        .card-img-frame { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; background-color: #FCFAF7; border: 1px solid #f4f4f5; }
        .master-cover-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; filter: grayscale(100%) contrast(1.02); }
        .collection-master-card:hover .master-cover-img { transform: scale(1.01); filter: grayscale(0%) contrast(1.01); }

        .swatch-dot { width: 18px; height: 18px; border-radius: 50%; border: 1px solid #e4e4e7; box-shadow: inset 0 2px 4px rgba(0,0,0,0.04); position: relative; }
        
        .btn-inspect { display: inline-flex; align-items: center; gap: 0.5rem; background-color: #1a1a1a; color: white; padding: 0.875rem 2rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; border-radius: 1px; width: fit-content; }
        .collection-master-card:hover .btn-inspect { background-color: #C9A84C; }
      `}</style>

      {/* Editorial Hub Top Banner */}
      <div style={{ paddingTop: "9rem", paddingBottom: "4.5rem", backgroundColor: "#0c0c0c", borderBottom: "1px solid #1a1a1a" }}>
        <div className="container-custom">
          <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-0.5 border rounded-full text-[9px] font-mono tracking-widest uppercase font-black mb-3">
            <Compass className="h-3 w-3" />
            <span>NOREX SHOWROOM REGISTRY HUB</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            The Collections
          </h1>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mt-2 max-w-xl leading-relaxed">
            Dynamic catalog entries tracing signature apparel drops, climatic color spectrum blocks, and runway lookbook archives.
          </p>
        </div>
      </div>

      {/* Main Stream Workspace Container */}
      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "7rem" }}>
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Compiling Available Showrooms...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-sm font-mono text-xs uppercase tracking-wider text-zinc-400">
            No active collection drop modules initialized inside the database master ledger.
          </div>
        ) : (
          <div className="collections-grid">
            {collections.map((c) => (
              <div 
                key={c._id} 
                onMouseEnter={handleInteract}
                className="collection-master-card shadow-sm"
              >
                {/* Left Side: Editorial Aspect Image Frame */}
                <Link href={`/collections/${c.slug}`} onClick={handleLinkClick} className="card-img-frame rounded-sm block">
                  <img 
                    src={c.coverImage || "/placeholder-garment.png"} 
                    alt={c.title} 
                    className="master-cover-img"
                  />
                  <div style={{ backgroundColor: "#1a1a1a" }} className="absolute top-4 left-4 text-white text-[8px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-md">
                    {c.waSeason} TRACK
                  </div>
                </Link>

                {/* Right Side: Structural Metadata & Content Description Summary */}
                <div className="flex flex-col justify-between items-start text-left space-y-4 py-1">
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider border-b pb-2">
                      <span>Credits: {c.photographer?.split(" ")[0]} // {c.stylist?.split(" ")[0]}</span>
                      <span>Syllabus Indexed</span>
                    </div>
                    
                    <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-900 leading-tight">
                      {c.title}
                    </h2>
                    
                    <p className="text-xs leading-relaxed text-zinc-500 font-light font-sans text-justify line-clamp-4">
                      {c.campaignPlot}
                    </p>
                  </div>

                  {/* Inline Color Palette Swatches Counter Track */}
                  {c.palette?.length > 0 && (
                    <div className="space-y-2 w-full pt-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                        <Palette size={12} /> Color Profile Accent Keys
                      </span>
                      <div className="flex gap-1.5 items-center">
                        {c.palette.slice(0, 5).map((sw, swIdx) => (
                          <div 
                            key={swIdx} 
                            className="swatch-dot" 
                            style={{ backgroundColor: sw.hex }} 
                            title={`${sw.name} - ${sw.hex}`}
                          />
                        ))}
                        {c.palette.length > 5 && (
                          <span className="text-[9px] font-mono text-zinc-400 font-bold ml-1">+{c.palette.length - 5} More</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Operational Entry Action Trigger Link */}
                  <Link 
                    href={`/collections/${c.slug}`} 
                    onClick={handleLinkClick}
                    className="btn-inspect"
                  >
                    <span>Inspect Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}