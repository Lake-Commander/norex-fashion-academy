"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Heart, Loader2 } from "lucide-react"; 
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface InfoPair {
  label: string;
  value: string;
}

// 1. Fixed: Tightened gender typing from a generic string to your exact strict literal context options
interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  gender: "Male" | "Female" | "Both"; // Fixed literal type matching context assignment rules
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSignature: boolean;
  additionalInfo?: InfoPair[];
}

export default function SignaturePieces() {
  const { soundEnabled, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSignatures() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          const signatures = data.products.filter((p: ProductItem) => p.isSignature).slice(0, 2);
          setProducts(signatures);
        }
      } catch (err) {
        console.error("Failed querying narrative blocks:", err);
      } finally {
        setLoading(false);
      }
    }
    getSignatures();
  }, []);

  // 2. Type Adapter: Normalizes context parameters seamlessly now that types are strict
  const mapToContextProduct = (item: ProductItem) => {
    return {
      ...item,
      id: item._id,               
      featured: item.isFeatured,  
    };
  };

  const handleInstantBuy = (item: ProductItem) => {
    addToCart(mapToContextProduct(item), 1);
    if (soundEnabled) sounds.playSuccess();
  };

  const getMetaValue = (item: ProductItem, targetLabel: string, fallbackDefault: string) => {
    if (!item.additionalInfo || !Array.isArray(item.additionalInfo)) return fallbackDefault;
    const match = item.additionalInfo.find(
      (info) => info.label.toLowerCase() === targetLabel.toLowerCase()
    );
    return match ? match.value : fallbackDefault;
  };

  const goldColor = "#C9A84C";

  return (
    <section className="bg-[#050505] px-6 py-24 md:px-8 border-b border-white/10 relative overflow-hidden">
      <style>{`
        .sig-img-container {
          position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); 
          background-color: #FAF7F4; aspect-ratio: 4/5; border-radius: 2px;
        }
        .sig-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .sig-img-container:hover .sig-img { transform: scale(1.02); }

        .btn-sig-gold {
          background-color: #C9A84C; color: white; padding: 1rem 2rem; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none;
          transition: all 0.3s ease; border-radius: 2px; cursor: pointer;
        }
        .btn-sig-gold:hover { background-color: #B49542; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(201,168,76,0.3); }

        .btn-sig-outline {
          padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.1); background: none;
          color: white; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; transition: all 0.3s ease; border-radius: 2px; text-decoration: none; display: inline-block;
        }
        .btn-sig-outline:hover { border-color: #C9A84C; background-color: rgba(255,255,255,0.03); color: #C9A84C; }
      `}</style>
      
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] blur-[150px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201, 168, 76, 0.02)" }} />

      <div className="mx-auto max-w-7xl">
        
        {/* Title Block */}
        <div className="mb-24 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">05 // THE SIGNATURES</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            Signature Pieces
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl font-light">
            A precise presentation of our core defining studio shapes. Inspect the architectural records, composition guidelines, and blueprints backing each layout.
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center w-full">
            <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-zinc-500 text-sm font-mono tracking-wider uppercase text-center">No structural masterpieces assigned signature flags currently.</p>
        ) : (
          <div className="space-y-32">
            {products.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isWished = isInWishlist(item._id);

              const signatureStory = getMetaValue(item, "Design Narrative", item.description);
              const textileProvenance = getMetaValue(item, "Textile Provenance", `Premium selection catalog parameters // Hand-pressed in Nigeria.`);
              const blueprintInspiration = getMetaValue(item, "Structural Blueprint Core", `Tailored architecture engineered specifically to honor contemporary West African postural geometry.`);

              const coreLabels = ["design narrative", "textile provenance", "structural blueprint core"];
              const genericSpecs = item.additionalInfo?.filter((info) => !coreLabels.includes(info.label.toLowerCase())) || [];

              return (
                <div key={item._id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* Image Presentation Block Frame */}
                  <div className={`lg:col-span-6 ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="sig-img-container">
                      <img src={item.images?.[0] || "/placeholder-garment.png"} alt={item.name} className="sig-img" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      
                      {/* Wishlist Interactive Toggle */}
                      <button
                        onClick={() => toggleWishlist(mapToContextProduct(item))}
                        className="p-3 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#C9A84C] absolute top-6 right-6 transition-all active:scale-90 z-20 cursor-pointer"
                        title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart className="h-4.5 w-4.5" fill={isWished ? goldColor : "transparent"} color={isWished ? goldColor : "white"} />
                      </button>
                      
                      <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="absolute bottom-6 left-6 text-white text-[9px] font-mono tracking-widest bg-black/60 px-3 py-1 rounded-sm border uppercase">
                        Ref // Look {item.slug ? item.slug.slice(0, 16) : item._id.slice(-6)}
                      </div>
                    </div>
                  </div>

                  {/* Information Breakdown Block */}
                  <div className={`lg:col-span-6 text-left space-y-6 md:space-y-7 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-2">
                      <span style={{ color: goldColor, letterSpacing: "0.15em" }} className="text-[10px] font-mono font-bold uppercase block">
                        ATELIER MASTERPIECE CONFIGURATION
                      </span>
                      <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-none">
                        {item.name}
                      </h3>
                      <p style={{ color: goldColor }} className="text-xl font-bold font-mono">{formatPrice(item.price)}</p>
                    </div>

                    {/* Story / Design Narrative Section */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">The Design Narrative</h4>
                      <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed font-serif italic text-justify">
                        "{signatureStory}"
                      </p>
                    </div>

                    {/* Material Section */}
                    <div style={{ borderLeftColor: goldColor }} className="space-y-1 border-l-2 pl-4 py-0.5">
                      <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">Textile Provenance</h4>
                      <p className="text-xs text-zinc-400 font-light font-mono leading-relaxed">
                        {textileProvenance}
                      </p>
                    </div>

                    {/* Inspiration Blueprint Section */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">Structural Blueprint Core</h4>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-lg">
                        {blueprintInspiration}
                      </p>
                    </div>

                    {/* Generic Appended Technical Specifications Tray */}
                    {genericSpecs.length > 0 && (
                      <div className="pt-2 border-t border-zinc-900/60 grid grid-cols-2 gap-x-4 gap-y-2">
                        {genericSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="text-[11px] font-mono">
                            <span className="text-zinc-500 uppercase tracking-wider block font-bold">{spec.label}</span>
                            <span className="text-zinc-300 block mt-0.5 font-light">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Operational Buy Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4">
                      <button onClick={() => handleInstantBuy(item)} className="btn-sig-gold">
                        Acquire Piece
                      </button>
                      
                      <Link href={`/shop/${item.slug}`} className="btn-sig-outline">
                        Specifications Detail
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}