"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; // Fixed: Standard component import path
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, Filter, Heart, ShoppingBag, Loader2, ImageIcon } from "lucide-react";
import ShopSidebar from "./ShopSidebar";
import { useShop } from "@/context/ShopContext";

export default function ShopArea() {
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  // Read current URL filtering state parameters
  const selectedCategory = searchParams.get("category");
  const selectedColor = searchParams.get("color");
  const selectedStatus = searchParams.get("status");
  const maxPriceParam = searchParams.get("price");
  const selectedGender = searchParams.get("gender");

  // Fetch product catalog array from live database node on mount
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed querying live catalog matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  // Compute live filters completely in memory based on current URL states
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedGender) result = result.filter((p) => p.gender === selectedGender || p.gender === "Both");
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedColor) result = result.filter((p) => p.colors?.some((c: string) => c.toLowerCase() === selectedColor.toLowerCase()));
    if (selectedStatus === "in-stock") result = result.filter((p) => p.inStock);
    if (selectedStatus === "featured") result = result.filter((p) => p.isFeatured);
    if (maxPriceParam) result = result.filter((p) => p.price <= Number(maxPriceParam));

    if (sortOption === "low-to-high") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "high-to-low") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, selectedGender, selectedCategory, selectedColor, selectedStatus, maxPriceParam, sortOption]);

  const goldColor = "#C9A84C";

  return (
    <>
      <style>{`
        /* --- Grid Layout Framework --- */
        .shop-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 1024px) { .shop-layout { grid-template-columns: 280px 1fr; gap: 3rem; } }

        .product-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1280px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }

        .sort-select {
          padding: 0.5rem 1rem; border: 1px solid #e5e7eb; background: white;
          color: #4b5563; font-size: 0.85rem; outline: none; cursor: pointer; border-radius: 2px; transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: #C9A84C; }

        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }
        
        .sc { display: block; position: relative; }
        .sci { transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
        .sc:hover .sci { transform: scale(1.03); }
        
        .sco {
          position: absolute; inset: 0; background-color: rgba(0,0,0,0.12);
          display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.5rem; gap: 0.5rem;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 10;
        }
        .sc:hover .sco { opacity: 1; pointer-events: auto; }

        /* Action Buttons on Product Card Hover Overlay */
        .action-btn {
          color: white; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.8); padding: 0.5rem 1rem; transition: all 0.3s ease; 
          font-weight: 600; text-decoration: none; cursor: pointer; background: rgba(26,26,26,0.75); display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 2px;
        }
        .action-btn:hover { background-color: #C9A84C; border-color: #C9A84C; }

        .wishlist-btn { transition: transform 0.2s ease; z-index: 20; }
        .wishlist-btn:hover { transform: scale(1.1); }

        .sct { transition: color 0.3s ease; text-decoration: none; }
        .sct:hover { color: #C9A84C !important; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 0.875rem 2.5rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px;
          width: max-content; margin: 0 auto;
        }
        .shop-whatsapp-btn:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }
      `}</style>

      {/* Hero Header Area */}
      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Our Collection</h1>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>Discover premium ready-to-wear expressions and custom African heritage designs constructed with architectural care.</p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        
        {/* Mobile Filter Toggle & Sort Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3" }}>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            style={{ display: "flex", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", alignItems: "center", gap: "0.5rem" }}
            className="lg:hidden"
          >
            <Filter size={16} /> Filters
          </button>
          
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }} className="hidden lg:block">
            Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} active design records
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }} className="hidden sm:block">Sort framework:</span>
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Default Framework</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters View Linkage */}
          <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />

          {/* Core Product Grid Display Zone */}
          <div>
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-[#C9A84C]" />
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Synchronizing Master Catalog Nodes...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>No matching pieces found</h3>
                <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Try adjusting your sidebar parameter constraints to reveal alternative listings.</p>
                <Link href="/shop" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "underline" }}>Reset baseline layout</Link>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="sc">
                    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAF7F4", aspectRatio: "3/4", marginBottom: "1.25rem", borderRadius: "2px" }}>
                      
                      {/* Image Core Layer Linkage */}
                      <Link href={`/shop/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={24} /></div>
                        )}
                      </Link>

                      {/* Floating Meta Scope Tag */}
                      <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.875rem", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: goldColor, borderRadius: "1px", pointerEvents: "none", border: "1px solid #f0ebe3" }}>
                        {product.category}
                      </div>

                      {/* Interactive Wishlist Button Overlay Frame */}
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className="wishlist-btn"
                        style={{ position: "absolute", top: "1rem", right: "1rem", background: "white", border: "1px solid #f0ebe3", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                      >
                        <Heart size={15} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>

                      {/* Interactive Hover Actions Layout Grid */}
                      <div className="sco">
                        <button className="action-btn" onClick={() => addToCart(product, 1)}>
                          <ShoppingBag size={13} /> Add
                        </button>
                        <Link href={`/shop/${product.slug}`} className="action-btn">
                          View Details
                        </Link>
                      </div>

                    </div>
                    
                    {/* Typography Breakdown Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ textAlign: "left" }}>
                        <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                          <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.35rem" }}>{product.name}</h3>
                        </Link>
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontStyle: "italic" }}>{product.category} Registry</p>
                      </div>
                      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: goldColor, flexShrink: 0, marginLeft: "1rem", fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Made-To-Measure WhatsApp Order Actions Section */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: goldColor, fontWeight: 600, marginBottom: "1rem", display: "block" }}>Bespoke Assembly</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem" }}>Made-to-Measure Configurations</h2>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem", lineHeight: 1.8 }}>We offer dedicated structural custom tailoring fittings. Reach out directly via WhatsApp to initiate a custom commission with our consultants.</p>
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="shop-whatsapp-btn">
          <MessageCircle size={18} />
          Consult via WhatsApp
        </a>
      </div>
    </>
  );
}