"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import { Sparkles, ArrowRight, Heart, ShoppingBag, Loader2 } from "lucide-react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";

export default function NewArrivalsDynamicPage() {
  const { soundEnabled, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [newItems, setNewItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success && data.products) {
          // Sync database documents marked explicitly as fresh new catalog additions
          const arrivals = data.products.filter((p: any) => p.isNewArrival);
          setNewItems(arrivals);
        }
      } catch (err) {
        console.error("Failed compiling new arrivals tracking line:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNewArrivals();
  }, []);

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); };

  const handleAddProduct = (item: any) => {
    // Normalization adapter to map native database models safely into context
    addToCart({
      ...item,
      id: item._id,
      selectedSize: item.sizes?.[0] || "M",
      selectedColor: item.colors?.[0] || "Default Matrix",
      selectedGender: item.gender === "Both" ? "Female" : item.gender
    }, 1);
    if (soundEnabled) sounds.playSuccess();
  };

  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-900 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />
      <section className="relative w-full py-16 md:py-24 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          {/* Header Layout */}
          <div className="space-y-3 max-w-xl">
            <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-widest font-black animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>FRESH CUTS FROM THE ATELIER WORKSHOP</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-zinc-900">New Arrivals</h1>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider leading-relaxed">Fresh silhouettes newly cut and tailored inside our Warri studio tables.</p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-7 w-7 animate-spin text-[#C9A84C]" /></div>
          ) : newItems.length === 0 ? (
            <p className="text-center font-mono text-zinc-400 text-xs uppercase py-12">No recent capsule additions written to the catalog index currently.</p>
          ) : (
            /* Large Editorial Product Grid Presentation Blocks */
            <div className="space-y-16">
              {newItems.map((item, idx) => {
                const isWished = isInWishlist(item._id);
                return (
                  <div key={item._id} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-zinc-200 pb-12 last:border-b-0 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Image Canvas Frame */}
                    <div className={`lg:col-span-7 relative group aspect-[4/3] rounded-sm overflow-hidden bg-white border border-zinc-200 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <img src={item.images?.[0] || "/placeholder-garment.png"} alt={item.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-[1000ms]" />
                      <button
                        type="button"
                        onClick={() => toggleWishlist({ ...item, id: item._id })}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#C9A84C] transition-all z-10 cursor-pointer"
                      >
                        <Heart className="h-4.5 w-4.5" fill={isWished ? goldColor : "transparent"} color={isWished ? goldColor : "white"} />
                      </button>
                    </div>

                    {/* Specification Description Summary Frame */}
                    <div className="lg:col-span-5 text-left space-y-5">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-0.5 border border-zinc-200 bg-white text-zinc-500 text-[9px] font-mono uppercase rounded-sm font-bold tracking-wider">{item.category}</span>
                        <span className="px-2.5 py-0.5 border border-zinc-200 bg-white text-zinc-500 text-[9px] font-mono uppercase rounded-sm font-bold tracking-wider">{item.gender === "Both" ? "Unisex Cut" : `${item.gender} Cut`}</span>
                      </div>
                      
                      <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl sm:text-3xl font-bold uppercase text-zinc-900 tracking-tight leading-none">{item.name}</h2>
                      <div className="text-xl font-bold font-mono text-[#C9A84C]">{formatPrice(item.price)}</div>
                      
                      <div className="p-5 bg-white border border-zinc-200 rounded-sm space-y-1.5 shadow-sm">
                        <span style={{ color: goldColor }} className="text-[9px] font-mono font-black uppercase tracking-wider block">ATELIER DIRECTIVE DESIGNER NOTE</span>
                        <p className="text-xs font-serif leading-relaxed italic text-zinc-500 text-justify">
                          "{item.description}"
                        </p>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => handleAddProduct(item)} className="flex-1 py-4 bg-zinc-900 text-white hover:bg-[#C9A84C] text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                          <ShoppingBag size={14} />
                          <span>Reserve Piece</span>
                        </button>
                        <Link href={`/shop/${item.slug}`} onClick={handleInteract} className="px-6 py-4 border border-zinc-300 hover:border-zinc-900 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center shrink-0 cursor-pointer text-decoration-none text-zinc-900">Details</Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}