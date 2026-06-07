"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";

const getColorHex = (colorName: string) => {
  const map: Record<string, string> = {
    "Crimson": "#990000",
    "Midnight Black": "#111111",
    "Ivory": "#FFFFF0",
    "Pearl White": "#F8F8FF",
    "Wine": "#722F37",
    "Forest Green": "#228B22",
    "Navy": "#000080",
    "Charcoal": "#36454F",
    "Burgundy": "#800020",
    "Multi-print": "linear-gradient(to right, #C9A84C, #722F37)",
    "Noir Black": "#0a0a0a",
  };
  return map[colorName] || "#ccc";
};

export default function ShopSidebar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean, setIsMobileOpen: (v: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Dynamic filter lists based on your product data
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), []);
  const colors = useMemo(() => Array.from(new Set(products.flatMap((p) => p.colors))), []);
  const maxProductPrice = useMemo(() => Math.max(...products.map((p) => p.price)), []);

  const [localPrice, setLocalPrice] = useState(maxProductPrice);

  // Sync local price slider with URL param
  useEffect(() => {
    const urlPrice = searchParams.get("price");
    if (urlPrice) setLocalPrice(Number(urlPrice));
    else setLocalPrice(maxProductPrice);
  }, [searchParams, maxProductPrice]);

  // Handle URL updates
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && params.get(key) !== value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
    setIsMobileOpen(false);
  };

  return (
    <div className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
      {/* Mobile Close Header */}
      {isMobileOpen && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700 }}>Filters</h3>
          <button onClick={() => setIsMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a1a" }}>
            <X size={24} />
          </button>
        </div>
      )}

      {/* Categories Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Categories</h3>
        <ul className="filter-list">
          <li>
            <button className={`filter-btn ${!searchParams.get("category") ? "active" : ""}`} onClick={() => updateFilter("category", "")}>
              All Categories <span className="filter-count">{products.length}</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button 
                className={`filter-btn ${searchParams.get("category") === cat ? "active" : ""}`} 
                onClick={() => updateFilter("category", cat)}
              >
                {cat} <span className="filter-count">{products.filter((p) => p.category === cat).length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Price Range</h3>
        <input 
          type="range" min="0" max={maxProductPrice} value={localPrice} 
          onChange={(e) => setLocalPrice(Number(e.target.value))}
          onMouseUp={() => updateFilter("price", localPrice.toString())}
          onTouchEnd={() => updateFilter("price", localPrice.toString())}
          className="price-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
          <span>{formatPrice(0)}</span>
          <span style={{ color: "#C9A84C", fontWeight: 700 }}>{formatPrice(localPrice)}</span>
        </div>
      </div>

      {/* Color Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Colors</h3>
        <div className="color-options">
          {colors.map((color) => (
            <button 
              key={color} title={color}
              className={`color-btn ${searchParams.get("color") === color ? "active" : ""}`}
              style={{ background: getColorHex(color) }}
              onClick={() => updateFilter("color", color)}
            />
          ))}
        </div>
      </div>

      {/* Status Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Status</h3>
        <ul className="filter-list">
          <li>
            <button className={`filter-btn ${searchParams.get("status") === "in-stock" ? "active" : ""}`} onClick={() => updateFilter("status", "in-stock")}>
              In Stock
            </button>
          </li>
          <li>
            <button className={`filter-btn ${searchParams.get("status") === "featured" ? "active" : ""}`} onClick={() => updateFilter("status", "featured")}>
              Featured Pieces
            </button>
          </li>
        </ul>
      </div>

      {/* Reset Button */}
      <button className="btn-reset" onClick={resetFilters}>
        Reset Filters
      </button>
      
      {/* Mobile View Results Button */}
      {isMobileOpen && (
        <button onClick={() => setIsMobileOpen(false)} style={{ backgroundColor: "#C9A84C", color: "white", padding: "1rem", border: "none", width: "100%", marginTop: "1rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          View Results
        </button>
      )}
    </div>
  );
}