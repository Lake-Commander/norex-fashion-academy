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
        /* --- Hardened Viewport Constraint Layout Wrapper: Stops mobile horizontal zooming glitches --- */
        .shop-layout { 
          display: flex;
          flex-direction: column;
          gap: 1.5rem; 
          width: 100%;
          max-width: 100vw;
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
          box-sizing: border-box;
        }

        /* 📱 Amazon UX 2-Column Mobile Scale Matrix */
        .product-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 0.5rem; 
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 480px) { .product-grid { gap: 0.75rem; } }
        @media(min-width: 768px) { .product-grid { gap: 1.5rem; } }
        @media(min-width: 1200px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }

        .sort-select, .gender-select {
          padding: 0.45rem 1.5rem 0.45rem 0.5rem; border: 1px solid #e5e7eb; background: white;
          color: #1a1a1a; font-size: 0.75rem; font-weight: 500;
          outline: none; cursor: pointer; border-radius: 4px; 
          appearance: none; font-family: inherit;
        }
        @media(min-width: 768px) {
          .sort-select, .gender-select { padding: 0.5rem 2rem 0.5rem 1rem; font-size: 0.8rem; }
        }

        .breadcrumb-link { font-size: 0.68rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        @media(min-width: 768px) { .breadcrumb-link { font-size: 0.72rem; } }
        .breadcrumb-link:hover { color: #C9A84C; }
        
        /* 📱 Amazon Borderless Product Card Concept on Mobile */
        .sc { 
          display: flex; 
          flex-direction: column; 
          position: relative; 
          width: 100%; 
          box-sizing: border-box; 
          background: white;
          padding: 0.4rem;
          border: 1px solid #f3f4f6;
          border-radius: 4px;
        }
        @media(min-width: 1024px) {
          .sc { border: none; padding: 0; background: transparent; }
        }
        .sci { transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
        .sc:hover .sci { transform: scale(1.02); }

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

        .sct { transition: color 0.3s ease; text-decoration: none; }
        .sct:hover { color: #C9A84C !important; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 0.75rem 1.5rem;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px;
          max-width: 100%; width: 100%; sm:width: auto; box-sizing: border-box;
        }

        /* ⚡ Amazon Sticky Action Bar Setup */
        .sticky-filter-bar {
          position: sticky;
          top: 3.9rem; /* Pinned under navbar context */
          z-index: 40;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 1024px) {
          .sticky-filter-bar {
            position: static;
            padding: 0 0 1.5rem 0;
            margin-bottom: 2rem;
            border-bottom: 1px solid #f0ebe3;
          }
        }

        .gender-mobile-wrapper { display: block; margin-top: 1rem; width: 100%; box-sizing: border-box; }
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

        /* 📱 Amazon Bottom-Sheet Drawer Overlay Configuration */
        @media (max-width: 1023px) {
          .amazon-bottom-sheet {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 100;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }
          .amazon-bottom-sheet.open {
            transform: translateY(0);
          }
          .amazon-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 90;
          }
          .bottom-sheet-body {
            overflow-y: auto;
            padding: 1.5rem;
            flex: 1;
            box-sizing: border-box;
          }
        }
      `}</style>

      {/* Hero Header Area */}
      <div style={{ paddingTop: "7rem", paddingBottom: "2rem", backgroundColor: "#FAF7F4", width: "100%", maxWidth: "100vw", overflowX: "hidden", boxSizing: "border-box" }}>
        <div className="container-custom" style={{ paddingLeft: "1rem", paddingRight: "1rem", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db", fontSize: "0.65rem" }}>/</span>
            <span style={{ fontSize: "0.68rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4.5vw, 3rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem", lineHeight: 1.15 }}>Our Collection</h1>
          
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

      {/* ⚡ Amazon Sticky Interactivity Header Row */}
      <div className="sticky-filter-bar">
        <button 
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          style={{ display: "flex", background: "#f3f4f6", border: "1px solid #e5e7eb", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "4px" }}
          className="mobile-only-filter"
        >
          <Filter size={14} /> Filter & Refine
        </button>
        
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }} className="desktop-only-stat">
          Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} design items
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }} className="desktop-only-stat">Sort by:</span>
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

      <div className="container-custom" style={{ paddingTop: "1.5rem", paddingBottom: "4rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", boxSizing: "border-box", maxWidth: "100vw", overflowX: "hidden" }}>
        <div className="shop-layout">
          <div className="shop-sidebar-container">
            <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
          </div>

          <div className="shop-main-pane">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Loading Matrix Catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700 }}>No results matched</h3>
                <Link href="/shop" style={{ color: "#C9A84C", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline" }}>Clear filters</Link>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="sc">
                    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAF7F4", aspectRatio: "3/4", marginBottom: "0.5rem", borderRadius: "4px" }}>
                      
                      <Link href={`/shop/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 50vw, 33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={20} /></div>
                        )}
                      </Link>

                      <div style={{ position: "absolute", top: "0.4rem", left: "0.4rem", backgroundColor: "white", padding: "0.15rem 0.5rem", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: goldColor, borderRadius: "1px", pointerEvents: "none", border: "1px solid #f0ebe3" }}>
                        {product.category}
                      </div>

                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="wishlist-btn hidden lg:flex"
                        style={{ position: "absolute", top: "0.4rem", right: "0.4rem", background: "white", border: "1px solid #f0ebe3", borderRadius: "50%", width: "30px", height: "30px", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <Heart size={13} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>

                      <div className="sco">
                        <button type="button" className="action-btn" onClick={() => addToCart(product, 1)}>
                          <ShoppingBag size={11} /> Add Basket
                        </button>
                      </div>
                    </div>
                    
                    {/* Compact Typography Data Space */}
                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "0.15rem", padding: "0 0.25rem" }}>
                      <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                        <h3 className="sct" style={{ fontSize: "0.82rem", fontWeight: 500, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                      </Link>
                      <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: 0 }}>{product.category}</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a1a1a", margin: "0.15rem 0 0.35rem 0", fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
                    </div>

                    {/* Persistent Mobile Action Strip */}
                    <div className="mobile-action-tray" style={{ display: "none", gap: "0.35rem", width: "100%", boxSizing: "border-box", marginTop: "auto" }}>
                      <button 
                        type="button" 
                        onClick={() => addToCart(product, 1)} 
                        style={{ flex: 1, backgroundColor: "#FAF7F4", color: "#1a1a1a", border: "1px solid #d1d5db", padding: "0.45rem", fontSize: "0.68rem", fontWeight: 600, cursor: "pointer", borderRadius: "4px" }}
                      >
                        Add
                      </button>
                      <button 
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        style={{ background: "white", border: "1px solid #d1d5db", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "4px" }}
                      >
                        <Heart size={13} color="#C9A84C" fill={isInWishlist(product._id) ? goldColor : "transparent"} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Amazon Bottom-Sheet Drawers for Mobile Filters */}
      {isMobileFilterOpen && (
        <>
          <div className="amazon-backdrop mobile-only-filter" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="amazon-bottom-sheet open mobile-only-filter">
            <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Filter & Refine</span>
              <button type="button" style={{ border: "none", background: "none", fontSize: "0.85rem", fontWeight: 600, color: "#C9A84C" }} onClick={() => setIsMobileFilterOpen(false)}>Done</button>
            </div>
            <div className="bottom-sheet-body">
              <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />
            </div>
          </div>
        </>
      )}

      {/* Made-To-Measure WhatsApp Call-to-Action Section */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "3rem", paddingBottom: "3rem", textAlign: "center", paddingLeft: "1rem", paddingRight: "1rem", width: "100%", boxSizing: "border-box" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: goldColor, fontWeight: 600, marginBottom: "0.5rem" }}>Bespoke Assembly</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem" }}>Made-to-Measure Configurations</h2>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.5rem", maxWidth: "450px", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>We offer dedicated structural custom tailoring fittings. Reach out directly via WhatsApp to initiate a custom commission with our consultants.</p>
        
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="shop-whatsapp-btn">
          <MessageCircle size={15} /> Consult via WhatsApp
        </a>
      </div>
    </>
  );
}