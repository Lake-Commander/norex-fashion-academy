"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Loader2, ImageIcon } from "lucide-react";

export default function FeaturedCollection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        
        if (data.success && data.products) {
          // Isolate products marked as new arrival drops and take the top 3
          const arrivals = data.products.filter((p: any) => p.isNewArrival).slice(0, 3);
          setProducts(arrivals);
        }
      } catch (err) {
        console.error("Failed syncing storefront arrival components:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  const goldColor = "#C9A84C";

  return (
    <section style={{ backgroundColor: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
      <style>{`
        .pc-img { transition: transform 0.7s ease; } 
        .pc:hover .pc-img { transform: scale(1.05); } 
        .pc-ov { opacity: 0; transition: opacity 0.3s; } 
        .pc:hover .pc-ov { opacity: 1; } 
        .pg { display: grid; grid-template-columns: 1fr; gap: 2rem; } 
        @media(min-width:640px){ .pg { grid-template-columns: repeat(2,1fr); } } 
        @media(min-width:1024px){ .pg { grid-template-columns: repeat(3,1fr); } }
      `}</style>
      
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ textAlign: "left" }}>
            <p className="tag" style={{ marginBottom: "0.75rem", display: "block", color: goldColor, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              New Arrivals
            </p>
            <h2 className="section-title" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700 }}>
              Featured Collection
            </h2>
          </div>
          <Link href="/shop" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: goldColor, fontWeight: 600, borderBottom: `1px solid ${goldColor}`, paddingBottom: "2px", textDecoration: "none" }}>
            View All
          </Link>
        </div>

        {/* Dynamic Display Logic */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: goldColor }} />
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Streaming Showcase Matrix...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs font-mono uppercase tracking-wider">
            No active collection drop markers pinned to display frames.
          </div>
        ) : (
          <div className="pg">
            {products.map((product) => (
              <Link key={product._id} href={`/shop/${product.slug}`} className="pc" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAF7F4", aspectRatio: "3/4", borderRadius: "2px" }}>
                  
                  {product.images?.[0] ? (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="pc-img" 
                      style={{ objectFit: "cover" }} 
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.75rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: goldColor, border: "1px solid #f0ebe3" }}>
                    {product.category}
                  </div>

                  {/* Action Overlay Visual */}
                  <div className="pc-ov" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.08)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "1.5rem" }}>
                    <span style={{ color: "white", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid white", padding: "0.5rem 1.5rem", backgroundColor: "rgba(0,0,0,0.4)" }}>
                      View Details
                    </span>
                  </div>
                </div>

                {/* Info Text Breakdown */}
                <div style={{ paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", textAlign: "left" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.25rem" }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{product.category}</p>
                  </div>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: goldColor, whiteSpace: "nowrap", marginLeft: "1rem", fontFamily: "monospace" }}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}