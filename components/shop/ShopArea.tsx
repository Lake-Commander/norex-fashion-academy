"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, Filter } from "lucide-react";
import ShopSidebar from "./ShopSidebar";

export default function ShopArea() {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  // Read URL parameters
  const selectedCategory = searchParams.get("category");
  const selectedColor = searchParams.get("color");
  const selectedStatus = searchParams.get("status");
  const maxPriceParam = searchParams.get("price");

  // Filter products based on URL parameters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedColor) result = result.filter((p) => p.colors.includes(selectedColor));
    if (selectedStatus === "in-stock") result = result.filter((p) => p.inStock);
    if (selectedStatus === "featured") result = result.filter((p) => p.featured);
    if (maxPriceParam) result = result.filter((p) => p.price <= Number(maxPriceParam));

    if (sortOption === "low-to-high") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "high-to-low") result.sort((a, b) => b.price - a.price);

    return result;
  }, [selectedCategory, selectedColor, selectedStatus, maxPriceParam, sortOption]);

  return (
    <>
      <style>{`
        /* --- Grid Layout --- */
        .shop-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 1024px) { .shop-layout { grid-template-columns: 280px 1fr; gap: 3rem; } }

        .product-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1280px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }

        /* --- Sidebar Styles --- */
        .sidebar { display: none; flex-direction: column; gap: 2.5rem; }
        @media(min-width: 1024px) { .sidebar { display: flex; } }
        .sidebar.mobile-open {
          display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: white; z-index: 100; padding: 2rem; overflow-y: auto;
        }

        .widget-title { 
          font-family: var(--font-playfair), Georgia, serif; font-size: 1.1rem; font-weight: 700; color: #1a1a1a; 
          margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f0ebe3; 
        }

        .filter-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem; }
        .filter-btn { 
          display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: none; padding: 0; 
          color: #6b7280; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; text-align: left; 
        }
        .filter-btn:hover, .filter-btn.active { color: #C9A84C; font-weight: 600; }
        .filter-count { font-size: 0.75rem; background: #FAF7F4; padding: 0.1rem 0.5rem; border-radius: 12px; color: #9ca3af; transition: all 0.2s ease; }
        .filter-btn:hover .filter-count, .filter-btn.active .filter-count { background: #C9A84C; color: white; }

        .color-options { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .color-btn { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s; outline: 2px solid transparent; outline-offset: 2px; }
        .color-btn:hover { transform: scale(1.1); }
        .color-btn.active { outline-color: #C9A84C; border-color: transparent; }

        .price-slider { width: 100%; accent-color: #C9A84C; margin-bottom: 1rem; cursor: pointer; }

        .sort-select {
          padding: 0.5rem 1rem; border: 1px solid #e5e7eb; background: white;
          color: #4b5563; font-size: 0.85rem; outline: none; cursor: pointer; border-radius: 2px; transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: #C9A84C; }

        .btn-reset {
          width: 100%; padding: 0.875rem; background: #FAF7F4; border: 1px solid #f0ebe3;
          color: #1a1a1a; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-reset:hover { background: #C9A84C; color: white; border-color: #C9A84C; }

        /* --- Product Card Hover Effects --- */
        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }
        .sc { display: block; text-decoration: none; }
        .sci { transition: transform 0.7s ease; }
        .sc:hover .sci { transform: scale(1.05); }
        .sco {
          position: absolute; inset: 0; background-color: rgba(0,0,0,0.15);
          display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2rem;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .sc:hover .sco { opacity: 1; }
        .view-btn {
          color: white; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.8); padding: 0.6rem 1.75rem; transition: all 0.3s ease; font-weight: 600;
        }
        .sc:hover .view-btn { background-color: #C9A84C; border-color: #C9A84C; }
        .sct { transition: color 0.3s ease; }
        .sc:hover .sct { color: #C9A84C; }

        .shop-whatsapp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 0.875rem 2.5rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px;
          width: max-content; margin: 0 auto;
        }
        .shop-whatsapp-btn:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }
      `}</style>

      {/* Header */}
      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Our Collection</h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>Discover pieces crafted for the modern woman who values elegance, quality, and individuality.</p>
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
            Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{filteredProducts.length}</span> of {products.length} pieces
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }} className="hidden sm:block">Sort by:</span>
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <ShopSidebar isMobileOpen={isMobileFilterOpen} setIsMobileOpen={setIsMobileFilterOpen} />

          {/* Product Grid Area */}
          <div>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>No products found</h3>
                <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Try adjusting your filters to see more results.</p>
                <Link href="/shop" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "underline" }}>Clear all filters</Link>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={["/shop/", product.slug].join("")} className="sc">
                    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#F0EBE3", aspectRatio: "3/4", marginBottom: "1.25rem", borderRadius: "2px" }}>
                      <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                      <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.875rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C9A84C", borderRadius: "2px" }}>
                        {product.category}
                      </div>
                      <div className="sco">
                        <span className="view-btn">View Details</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.35rem" }}>{product.name}</h3>
                        <p style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 500 }}>{product.colors.slice(0, 2).join(" · ")}</p>
                      </div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, color: "#C9A84C", flexShrink: 0, marginLeft: "1rem" }}>{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>Custom Orders</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem" }}>Can't Find What You're Looking For?</h2>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem", lineHeight: 1.8 }}>We offer custom made-to-measure pieces. Reach out via WhatsApp to discuss your perfect outfit.</p>
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="shop-whatsapp-btn">
          <MessageCircle size={18} />
          Order via WhatsApp
        </a>
      </div>
    </>
  );
}