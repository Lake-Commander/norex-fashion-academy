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

  // Read current URL filtering state parameters
  const selectedCategory = searchParams.get("category");
  const selectedColor = searchParams.get("color");
  const selectedStatus = searchParams.get("status");
  const maxPriceParam = searchParams.get("price");
  const selectedGender = searchParams.get("gender") || "all";

  // Gender Option Master Array
  const genderOptions = [
    { id: "all", label: "All Collection" },
    { id: "Men", label: "Men" },
    { id: "Women", label: "Women" },
    { id: "Both", label: "Bespoke Unisex" }
  ];

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

  // Handler to mutate Gender parameters in URL query state search strings cleanly
  const handleGenderChange = (gender: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  // Compute live filters completely in memory based on current URL states
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
        /* --- Grid Layout Framework --- */
        .shop-layout { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 2rem; 
          align-items: start;
          width: 100%;
        }
        @media(min-width: 1024px) { 
          .shop-layout { 
            grid-template-columns: 240px 1fr; 
            gap: 4rem; 
          } 
        }

        /* --- Elegant Sidebar Refinement Overrides --- */
        .shop-sidebar-container h3, 
        .shop-sidebar-container .sidebar-heading {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 1.25rem;
          margin-top: 2rem;
          letter-spacing: 0.02em;
        }
        .shop-sidebar-container h3:first-of-type { margin-top: 0; }
        
        .shop-sidebar-container ul {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }
        
        .shop-sidebar-container ul li {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #27272a;
          padding: 0.45rem 0;
          cursor: pointer;
          transition: color 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .shop-sidebar-container ul li:hover { color: #C9A84C; }

        .product-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; width: 100%; }
        @media(min-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1280px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }

        .sort-select, .gender-select {
          padding: 0.5rem 2rem 0.5rem 1rem; border: 1px solid #e5e7eb; background: white;
          color: #1a1a1a; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; outline: none; cursor: pointer; border-radius: 2px; 
          transition: border-color 0.2s; appearance: none; font-family: monospace;
        }
        .sort-select:focus, .gender-select:focus { border-color: #C9A84C; }

        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }
        
        .sc { display: flex; flex-direction: column; position: relative; width: 100%; box-sizing: border-box; }
        .sci { transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
        .sc:hover .sci { transform: scale(1.03); }

        .sct { transition: color 0.3s ease; text-decoration: none; }
        .sct:hover { color: #C9A84C !important; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 0.875rem 2rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px;
          max-width: 100%; width: 100%; sm:width: auto; box-sizing: border-box;
        }
        .shop-whatsapp-btn:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }

        /* Adaptive Visibility Breaks */
        .gender-mobile-wrapper { display: block; margin-top: 2rem; width: 100%; }
        .gender-desktop-wrapper { display: none; }

        @media (max-width: 1023px) {
          .desktop-only-stat { display: none !important; }
          .shop-sidebar-container { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-only-filter { display: none !important; }
          .gender-mobile-wrapper { display: none; }
          .gender-desktop-wrapper { display: block; margin-top: 2.5rem; border-bottom: 1px solid #e5e7eb; width: max-content; padding-bottom: 2px; }
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
      `}</style>

      {/* Hero Header Area */}
      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4", width: "100%", overflowX: "hidden" }}>
        <div className="container-custom" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Our Collection</h1>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>Discover premium ready-to-wear expressions and custom African heritage designs constructed with architectural care.</p>
          
          {/* Mobile Dynamic Dropdown Selector */}
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
              <ChevronDown size={14} className="absolute right-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Horizon Navigation Link Bar */}
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

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        
        {/* Sorting & Filter Interactivity Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3", gap: "1rem", flexWrap: "wrap" }}>
          <button 
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            style={{ display: "flex", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", alignItems: "center", gap: "0.5rem", padding: 0 }}
            className="mobile-only-filter"
          >
            <Filter size={16} /> Filters
          </button>
          
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }} className="desktop-only-stat">
            Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} active design records
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "auto", position: "relative" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }} className="desktop-only-stat">Sort framework:</span>
            <div className="relative flex items-center">
              <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Default Framework</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="shop-layout">
          <div className="shop-sidebar-container">
            <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
          </div>

          {/* Core Product Grid Display Zone */}
          <div style={{ width: "100%", overflow: "hidden" }}>
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
                      
                      <Link href={`/shop/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={24} /></div>
                        )}
                      </Link>

                      <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.875rem", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: goldColor, borderRadius: "1px", pointerEvents: "none", border: "1px solid #f0ebe3" }}>
                        {product.category}
                      </div>

                      {/* ✅ FIXED TYPO: "justifyContext" changed back to the fully recognized "justifyContent" schema syntax */}
                      <div style={{ display: "flex", gap: "0.5rem", width: "100%", padding: "0.75rem 0", boxSizing: "border-box" }}>
                        <button 
                          type="button" 
                          onClick={() => addToCart(product, 1)} 
                          style={{ flex: 1, backgroundColor: "#1a1a1a", color: "white", border: "none", padding: "0.6rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}
                        >
                          + Add Basket
                        </button>
                        <button 
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          style={{ background: "white", border: "1px solid #e5e7eb", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}
                        >
                          <Heart size={14} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                        </button>
                      </div>

                    </div>
                    
                    {/* Typography Breakdown Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginTop: "2.5rem" }}>
                      <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                        <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                          <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                        </Link>
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontStyle: "italic" }}>{product.category} Registry</p>
                      </div>
                      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: goldColor, flexShrink: 0, fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Overlay for Mobile Sidebar Filters */}
      {isMobileFilterOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} className="mobile-only-filter">
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setIsMobileFilterOpen(false)} />
          <div style={{ position: "relative", width: "280px", maxWidth: "85vw", height: "100%", backgroundColor: "white", padding: "2rem", overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.15)", marginLeft: "auto" }}>
            <button type="button" style={{ position: "absolute", top: "1rem", left: "1rem", border: "none", background: "none", fontSize: "0.7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", color: "#9ca3af" }} onClick={() => setIsMobileFilterOpen(false)}>✕ CLOSE</button>
            <div style={{ marginTop: "2rem" }}>
              <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
            </div>
          </div>
        </div>
      )}

      {/* Made-To-Measure WhatsApp Call-to-Action Section */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center", paddingLeft: "1.5rem", paddingRight: "1.5rem", width: "100%", boxSizing: "border-box" }}>
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