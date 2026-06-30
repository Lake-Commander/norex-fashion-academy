"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { useSearchParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, Filter, Heart, ShoppingBag, Loader2, ImageIcon, ChevronDown } from "lucide-react";
import ShopSidebar from "./ShopSidebar";
import { useShop } from "@/context/ShopContext";

export default function ShopArea() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const selectedCategory = searchParams.get("category");
  const selectedColor = searchParams.get("color");
  const selectedStatus = searchParams.get("status");
  const maxPriceParam = searchParams.get("price");
  const selectedGender = searchParams.get("gender") || "all";

  const genderOptions = [
    { id: "all", label: "All Collection" },
    { id: "Male", label: "Men" },
    { id: "Female", label: "Women" },
    { id: "Both", label: "Bespoke Unisex" }
  ];

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

  const handleGenderChange = (gender: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedGender && selectedGender !== "all") {
      result = result.filter((p) => p.gender === selectedGender || p.gender === "Both");
    }
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
        /* --- Viewport Stability Hardening --- */
        .shop-layout { 
          display: flex;
          flex-direction: column;
          gap: 1rem; 
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 1024px) { 
          .shop-layout { 
            flex-direction: row;
            gap: 2.5rem; 
            align-items: start;
          } 
        }

        .shop-main-pane {
          flex: 1;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        /* 📱 UNBREAKABLE TWIN-COLUMN ARCHITECTURE */
        .product-grid { 
          display: grid; 
          grid-template-columns: repeat(2, minmax(0, 1fr)); 
          gap: 0.5rem; 
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 640px) { .product-grid { gap: 1rem; } }
        @media(min-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }

        .sort-select, .gender-select {
          padding: 0.4rem 1.25rem 0.4rem 0.5rem; border: 1px solid #e5e7eb; background: white;
          color: #1a1a1a; font-size: 0.7rem; font-weight: 500;
          outline: none; cursor: pointer; border-radius: 4px; 
          appearance: none; font-family: inherit;
        }
        @media(min-width: 768px) {
          .sort-select, .gender-select { padding: 0.5rem 2rem 0.5rem 1rem; font-size: 0.8rem; }
        }

        .breadcrumb-link { font-size: 0.65rem; color: #9ca3af; letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none; }
        @media(min-width: 768px) { .breadcrumb-link { font-size: 0.72rem; } }
        
        /* 📱 Streamlined Card Configurations */
        .sc { 
          display: flex; 
          flex-direction: column; 
          position: relative; 
          width: 100%; 
          min-width: 0; 
          box-sizing: border-box; 
          background: #ffffff;
          padding: 0.25rem;
          border: 1px solid #f1f5f9;
          border-radius: 4px;
        }
        @media(min-width: 1024px) {
          .sc { border: none; padding: 0; background: transparent; border-radius: 0; }
        }
        .sci { transition: transform 0.5s ease; }
        .sc:hover .sci { transform: scale(1.02); }

        .sco {
          position: absolute; inset: 0; background-color: rgba(0,0,0,0.14);
          display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2rem; gap: 0.5rem;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 10;
        }
        .sc:hover .sco { opacity: 1; pointer-events: auto; }

        @media (max-width: 1023px) {
          .sco { display: none !important; }
        }

        .action-btn {
          color: white; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.8); padding: 0.5rem 1rem; transition: all 0.3s ease; 
          font-weight: 600; text-decoration: none; cursor: pointer; background: rgba(26,26,26,0.75); display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 2px;
        }
        .action-btn:hover { background-color: #C9A84C; border-color: #C9A84C; }

        .sct { transition: color 0.2s ease; text-decoration: none; }
        .sct:hover { color: #C9A84C !important; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          background-color: #25D366; color: white; padding: 0.65rem 1.25rem;
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase; text-decoration: none; border-radius: 4px;
        }

        /* ⚡ Amazon Mobile Sticky Header Filter Panel */
        .sticky-filter-bar {
          position: sticky;
          top: 3.9rem; 
          z-index: 40;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.4rem 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 1024px) {
          .sticky-filter-bar {
            position: static;
            padding: 0 0 1.25rem 0;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #f0ebe3;
          }
        }

        .gender-mobile-wrapper { display: block; margin-top: 0.5rem; width: 100%; box-sizing: border-box; }
        .gender-desktop-wrapper { display: none; }

        @media (max-width: 1023px) {
          .desktop-only-stat { display: none !important; }
          .shop-sidebar-container { display: none !important; }
          .mobile-action-tray { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-only-filter { display: none !important; }
          .gender-mobile-wrapper { display: none; }
          .gender-desktop-wrapper { display: block; margin-top: 2rem; border-bottom: 1px solid #e5e7eb; width: max-content; padding-bottom: 2px; }
          .mobile-action-tray { display: none !important; }
        }

        .gender-tab-btn {
          font-size: 0.75rem; font-family: monospace; font-weight: 700;
          padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer;
          color: #9ca3af; transition: all 0.3s; text-transform: uppercase; position: relative;
          white-space: nowrap;
        }
        .gender-tab-btn.active { color: #1a1a1a; }
        .gender-tab-btn.active::after {
          content: ''; position: absolute; bottom: -3px; left: 1rem; right: 1rem; height: 2px; background-color: #C9A84C;
        }

        /* 📱 Bottom-Sheet App Drawer Wrapper */
        @media (max-width: 1023px) {
          .amazon-bottom-sheet {
            position: fixed; bottom: 0; left: 0; right: 0; background: white; z-index: 100;
            border-top-left-radius: 12px; border-top-right-radius: 12px;
            transform: translateY(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 80vh; display: flex; flex-direction: column; box-sizing: border-box;
          }
          .amazon-bottom-sheet.open { transform: translateY(0); }
          .amazon-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; }
          .bottom-sheet-body { overflow-y: auto; padding: 1.25rem; flex: 1; box-sizing: border-box; }
        }
      `}</style>

      {/* Hero Header Area */}
      <div style={{ paddingTop: "6.5rem", paddingBottom: "1.5rem", backgroundColor: "#FAF7F4", width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>
        <div className="container-custom" style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db", fontSize: "0.6rem" }}>/</span>
            <span style={{ fontSize: "0.68rem", color: "#C9A84C", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 4.2vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem", lineHeight: 1.2 }}>Our Collection</h1>
          
          <div className="gender-mobile-wrapper">
            <div className="relative flex items-center w-full max-w-xs">
              <select 
                className="gender-select w-full" 
                value={selectedGender} 
                onChange={(e) => handleGenderChange(e.target.value)}
              >
                {genderOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div className="gender-desktop-wrapper">
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {genderOptions.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleGenderChange(tab.id)}
                  className={`gender-tab-btn ${selectedGender === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header Filter Control Row */}
      <div className="sticky-filter-bar">
        <button 
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          style={{ display: "flex", background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600, alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.65rem", borderRadius: "4px", color: "#334155" }}
          className="mobile-only-filter"
        >
          <Filter size={12} /> Filter
        </button>
        
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }} className="desktop-only-stat">
          Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} design items
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
          <div className="relative flex items-center">
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
            <ChevronDown size={11} className="absolute right-3 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "0.5rem", paddingBottom: "3rem", paddingLeft: "0.35rem", paddingRight: "0.35rem", boxSizing: "border-box", maxWidth: "100%", overflowX: "hidden" }}>
        <div className="shop-layout">
          <div className="shop-sidebar-container">
            <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
          </div>

          <div className="shop-main-pane">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-1">
                <Loader2 className="h-5 w-5 animate-spin text-[#C9A84C]" />
                <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Loading catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a" }}>No results matched</h3>
                <Link href="/shop" style={{ color: "#C9A84C", fontSize: "0.8rem", textDecoration: "underline" }}>Clear filters</Link>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="sc">
                    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAF7F4", aspectRatio: "3/4", marginBottom: "0.35rem", borderRadius: "4px" }}>
                      
                      <Link href={`/shop/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:1024px) 50vw, 33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={14} /></div>
                        )}
                      </Link>

                      <div style={{ position: "absolute", top: "0.25rem", left: "0.25rem", backgroundColor: "white", padding: "0.1rem 0.35rem", fontSize: "0.45rem", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 700, color: goldColor, borderRadius: "2px", border: "1px solid #f1f5f9" }}>
                        {product.category}
                      </div>

                      {/* ✅ SYNCHRONIZED: Wishlist Heart Pin Button (Desktop Only via explicit hidden lg:flex visibility rule) */}
                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="wishlist-btn hidden lg:flex"
                        style={{ position: "absolute", top: "0.35rem", right: "0.35rem", background: "white", border: "1px solid #f0ebe3", borderRadius: "50%", width: "26px", height: "26px", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 20 }}
                      >
                        <Heart size={11} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>

                      {/* Desktop Hover Action Overlay Menu */}
                      <div className="sco">
                        <button type="button" className="action-btn" onClick={() => addToCart(product, 1)}>
                          <ShoppingBag size={10} /> Add Basket
                        </button>
                        <Link href={`/shop/${product.slug}`} className="action-btn">
                          Details
                        </Link>
                      </div>
                    </div>
                    
                    {/* Data Block Segments */}
                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "0.02rem", padding: "0 0.1rem" }}>
                      <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                        <h3 className="sct" style={{ fontSize: "0.72rem", fontWeight: 600, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                      </Link>
                      <p style={{ fontSize: "0.62rem", color: "#6b7280", margin: 0 }}>{product.category}</p>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", margin: "0.1rem 0 0.2rem 0", fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
                    </div>

                    {/* Mobile Strip Action Bar */}
                    <div className="mobile-action-tray" style={{ display: "none", gap: "0.25rem", width: "100%", boxSizing: "border-box", marginTop: "auto" }}>
                      <button 
                        type="button" 
                        onClick={() => addToCart(product, 1)} 
                        style={{ flex: 1, backgroundColor: "#ffffff", color: "#1a1a1a", border: "1px solid #cbd5e1", padding: "0.3rem", fontSize: "0.62rem", fontWeight: 600, cursor: "pointer", borderRadius: "4px" }}
                      >
                        Add +
                      </button>
                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        style={{ background: "#ffffff", border: "1px solid #cbd5e1", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "4px" }}
                      >
                        <Heart size={11} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom-Sheet Drawer Overlay */}
      {isMobileFilterOpen && (
        <>
          <div className="amazon-backdrop mobile-only-filter" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="amazon-bottom-sheet open mobile-only-filter">
            <div style={{ padding: "0.85rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>Filters</span>
              <button type="button" style={{ border: "none", background: "none", fontSize: "0.8rem", fontWeight: 600, color: "#C9A84C" }} onClick={() => setIsMobileFilterOpen(false)}>Done</button>
            </div>
            <div className="bottom-sheet-body">
              <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
            </div>
          </div>
        </>
      )}

      {/* Made-To-Measure Bottom Call Action Block */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "2.5rem", paddingBottom: "2.5rem", textAlign: "center", paddingLeft: "1rem", paddingRight: "1rem", width: "100%", boxSizing: "border-box" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: goldColor, fontWeight: 600, marginBottom: "0.35rem" }}>Bespoke Assembly</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.6rem" }}>Made-to-Measure Configurations</h2>
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="shop-whatsapp-btn">
          <MessageCircle size={14} /> WhatsApp Inquiry
        </a>
      </div>
    </>
  );
}