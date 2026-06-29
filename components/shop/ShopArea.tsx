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
        /* --- Flex Layout Architecture: Responds live to sidebar width changes --- */
        .shop-layout { 
          display: flex;
          flex-direction: column;
          gap: 1.5rem; 
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 1024px) { 
          .shop-layout { 
            flex-direction: row;
            gap: 3.5rem; 
            align-items: start;
          } 
        }

        .shop-main-pane {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        /* 📱 2-COLUMN INTENTIONAL MOBILE SCALE GRID SYSTEM */
        .product-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 0.75rem; 
          width: 100%; 
        }
        @media(min-width: 480px) { .product-grid { gap: 1rem; } }
        @media(min-width: 768px) { .product-grid { gap: 1.5rem; } }
        @media(min-width: 1200px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; } }

        .sort-select, .gender-select {
          padding: 0.45rem 1.75rem 0.45rem 0.75rem; border: 1px solid #e5e7eb; background: white;
          color: #1a1a1a; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; outline: none; cursor: pointer; border-radius: 2px; 
          transition: border-color 0.2s; appearance: none; font-family: monospace;
        }
        @media(min-width: 768px) {
          .sort-select, .gender-select { padding: 0.5rem 2rem 0.5rem 1rem; font-size: 0.75rem; }
        }
        .sort-select:focus, .gender-select:focus { border-color: #C9A84C; }

        .breadcrumb-link { font-size: 0.68rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        @media(min-width: 768px) { .breadcrumb-link { font-size: 0.72rem; } }
        .breadcrumb-link:hover { color: #C9A84C; }
        
        .sc { display: flex; flex-direction: column; position: relative; width: 100%; box-sizing: border-box; }
        .sci { transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
        .sc:hover .sci { transform: scale(1.02); }

        /* --- Hover Action Overlay (Desktop Only) --- */
        .sco {
          position: absolute; inset: 0; background-color: rgba(0,0,0,0.15);
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

        .wishlist-btn { transition: transform 0.2s ease; z-index: 20; }
        .wishlist-btn:hover { transform: scale(1.1); }

        .sct { transition: color 0.3s ease; text-decoration: none; }
        .sct:hover { color: #C9A84C !important; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 0.75rem 1.5rem;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px;
          max-width: 100%; width: 100%; sm:width: auto; box-sizing: border-box;
        }
        @media(min-width: 768px) {
          .shop-whatsapp-btn { padding: 0.875rem 2rem; font-size: 0.8rem; letter-spacing: 0.15em; }
        }
        .shop-whatsapp-btn:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }

        .gender-mobile-wrapper { display: block; margin-top: 1.25rem; width: 100%; }
        .gender-desktop-wrapper { display: none; }

        @media (max-width: 1023px) {
          .desktop-only-stat { display: none !important; }
          .shop-sidebar-container { display: none !important; }
          .mobile-action-tray { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-only-filter { display: none !important; }
          .gender-mobile-wrapper { display: none; }
          .gender-desktop-wrapper { display: block; margin-top: 2.5rem; border-bottom: 1px solid #e5e7eb; width: max-content; padding-bottom: 2px; }
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
      `}</style>

      {/* Hero Header Area */}
      <div style={{ paddingTop: "6.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4", width: "100%", overflowX: "hidden" }}>
        <div className="container-custom" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db", fontSize: "0.65rem" }}>/</span>
            <span style={{ fontSize: "0.68rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem", lineHeight: 1.15 }}>Our Collection</h1>
          <p style={{ fontSize: "clamp(0.8rem, 2vw, 0.9rem)", color: "#6b7280", maxWidth: "500px", lineHeight: 1.7 }}>Discover premium ready-to-wear expressions and custom African heritage designs constructed with architectural care.</p>
          
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
              <ChevronDown size={12} className="absolute right-3 text-zinc-500 pointer-events-none" />
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

      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
        
        {/* Sorting & Filter Interactivity Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", paddingBottom: "1rem", borderBottom: "1px solid #f0ebe3", gap: "0.75rem", flexWrap: "wrap" }}>
          <button 
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            style={{ display: "flex", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", alignItems: "center", gap: "0.4rem", padding: 0 }}
            className="mobile-only-filter"
          >
            <Filter size={14} /> Filters
          </button>
          
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }} className="desktop-only-stat">
            Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} active design records
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto", position: "relative" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }} className="desktop-only-stat">Sort framework:</span>
            <div className="relative flex items-center">
              <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Default Framework</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
              <ChevronDown size={11} className="absolute right-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="shop-layout">
          <div className="shop-sidebar-container">
            <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
          </div>

          {/* Core Product Grid Display Zone */}
          <div className="shop-main-pane">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Synchronizing Master Catalog Nodes...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>No matching pieces found</h3>
                <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Try adjusting your sidebar parameter constraints to reveal alternative listings.</p>
                <Link href="/shop" style={{ color: "#C9A84C", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline" }}>Reset baseline layout</Link>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="sc">
                    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAF7F4", aspectRatio: "3/4", marginBottom: "0.65rem", borderRadius: "2px" }}>
                      
                      <Link href={`/shop/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 50vw,(max-width:1024px) 50vw,33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={20} /></div>
                        )}
                      </Link>

                      <div style={{ position: "absolute", top: "0.4rem", left: "0.4rem", backgroundColor: "white", padding: "0.15rem 0.5rem", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: goldColor, borderRadius: "1px", pointerEvents: "none", border: "1px solid #f0ebe3" }}>
                        {product.category}
                      </div>

                      {/* Floating Wishlist Heart Pin Header Node (Desktop Only) */}
                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="wishlist-btn hidden lg:flex"
                        style={{ position: "absolute", top: "0.4rem", right: "0.4rem", background: "white", border: "1px solid #f0ebe3", borderRadius: "50%", width: "30px", height: "30px", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 10px rgba(0,0,0,0.03)" }}
                      >
                        <Heart size={13} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>

                      {/* Desktop Overlay Interaction Tray */}
                      <div className="sco">
                        <button type="button" className="action-btn" onClick={() => addToCart(product, 1)}>
                          <ShoppingBag size={11} /> Add Basket
                        </button>
                        <Link href={`/shop/${product.slug}`} className="action-btn">
                          Details
                        </Link>
                      </div>

                    </div>

                    {/* 📱 Scaled Mobile Context Action Tray (Persistent on viewports below 1024px) */}
                    <div className="mobile-action-tray" style={{ display: "none", gap: "0.35rem", width: "100%", padding: "0 0 0.5rem 0", boxSizing: "border-box" }}>
                      <button 
                        type="button" 
                        onClick={() => addToCart(product, 1)} 
                        style={{ flex: 1, backgroundColor: "#1a1a1a", color: "white", border: "none", padding: "0.45rem", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}
                      >
                        + Basket
                      </button>
                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        style={{ background: "white", border: "1px solid #e5e7eb", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}
                      >
                        <Heart size={12} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>
                    </div>
                    
                    {/* Typography Breakdown Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.25rem" }}>
                      <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                        <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                          <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(0.8rem, 2.2vw, 0.9rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                        </Link>
                        <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{product.category}</p>
                      </div>
                      <p style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.9rem)", fontWeight: 700, color: goldColor, flexShrink: 0, fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
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
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)" }} onClick={() => setIsMobileFilterOpen(false)} />
          <div style={{ position: "relative", width: "260px", maxWidth: "80vw", height: "100%", backgroundColor: "white", padding: "1.5rem", overflowY: "auto", boxShadow: "4px 0 20px rgba(0,0,0,0.1)", marginLeft: "auto" }}>
            <button type="button" style={{ position: "absolute", top: "1rem", left: "1rem", border: "none", background: "none", fontSize: "0.65rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", color: "#9ca3af" }} onClick={() => setIsMobileFilterOpen(false)}>✕ CLOSE</button>
            <div style={{ marginTop: "1.5rem" }}>
              <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
            </div>
          </div>
        </div>
      )}

      {/* Made-To-Measure WhatsApp Call-to-Action Section */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "3rem", paddingBottom: "3rem", textAlign: "center", paddingLeft: "1rem", paddingRight: "1rem", width: "100%", boxSizing: "border-box" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: goldColor, fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>Bespoke Assembly</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.35rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem" }}>Made-to-Measure Configurations</h2>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.5rem", maxWidth: "450px", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>We offer dedicated structural custom tailoring fittings. Reach out directly via WhatsApp to initiate a custom commission with our consultants.</p>
        
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="shop-whatsapp-btn">
          <MessageCircle size={15} />
          Consult via WhatsApp
        </a>
      </div>
    </>
  );
}