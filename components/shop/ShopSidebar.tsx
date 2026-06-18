"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { X, RotateCcw } from "lucide-react";

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
    <>
      <style>{`
        /* --- Premium Styled Sidebar Widgets --- */
        .sidebar {
          background: transparent;
        }

        @media(max-width: 1023px) {
          .sidebar {
            position: fixed; inset: 0 auto 0 0; width: 320px; max-width: 85vw;
            background: white; z-index: 50; padding: 2.5rem 2rem;
            box-shadow: 25px 0 50px rgba(0,0,0,0.1);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto; height: 100vh;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        .sidebar-widget {
          margin-bottom: 2.5rem;
          text-align: left;
        }

        .widget-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 1.25rem;
          letter-spacing: 0.01em;
          text-transform: capitalize;
        }

        .filter-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .filter-list li {
          margin-bottom: 0.25rem;
        }

        /* Proper E-Commerce Interactive Row Buttons */
        .filter-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          padding: 0.5rem 0;
          text-align: left;
          font-family: var(--font-sans), sans-serif;
          font-size: 0.95rem;
          color: #27272a;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          color: #C9A84C;
        }
        .filter-btn.active {
          color: #C9A84C;
          font-weight: 700;
        }

        .filter-count {
          font-size: 0.9rem;
          color: #71717a;
          font-family: var(--font-sans), sans-serif;
          margin-left: auto;
          font-weight: 400;
        }

        /* True Color Palette Selection Swatches */
        .color-options {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        }

        .color-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid #e4e4e7;
          transition: all 0.2s ease;
          position: relative;
        }
        .color-btn:hover {
          transform: scale(1.15);
        }
        .color-btn.active {
          border: 2px solid #C9A84C;
          box-shadow: 0 0 0 2px white;
        }

        /* Premium Mechanical Blue HTML5 Range Track Slider */
        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          background: #0066ff;
          border-radius: 4px;
          outline: none;
          margin: 1.25rem 0;
          cursor: pointer;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0066ff;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }
        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* Structural Reset Trigger Button Styles */
        .btn-reset {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem;
          background-color: #f4f4f5;
          border: none;
          color: #18181b;
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: bold;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 2px;
          margin-top: 1rem;
        }
        .btn-reset:hover {
          background-color: #e4e4e7;
        }
      `}</style>

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
                <span>All Categories</span>
                <span className="filter-count">{products.length}</span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button 
                  className={`filter-btn ${searchParams.get("category") === cat ? "active" : ""}`} 
                  onClick={() => updateFilter("category", cat)}
                >
                  <span>{cat}</span>
                  <span className="filter-count">{products.filter((p) => p.category === cat).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Widget */}
        <div className="sidebar-widget">
          <h3 className="widget-title">Price Range</h3>
          <input 
            type="range" 
            min="0" 
            max={maxProductPrice} 
            value={localPrice} 
            onChange={(e) => setLocalPrice(Number(e.target.value))}
            onMouseUp={() => updateFilter("price", localPrice.toString())}
            onTouchEnd={() => updateFilter("price", localPrice.toString())}
            className="price-slider"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#71717a", fontWeight: 500, marginTop: "0.5rem" }}>
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
                key={color} 
                title={color}
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
                <span>In Stock</span>
              </button>
            </li>
            <li>
              <button className={`filter-btn ${searchParams.get("status") === "featured" ? "active" : ""}`} onClick={() => updateFilter("status", "featured")}>
                <span>Featured Pieces</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Reset Button */}
        <button className="btn-reset" onClick={resetFilters}>
          <RotateCcw size={14} /> Reset Filters
        </button>
        
        {/* Mobile View Results Button */}
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} style={{ backgroundColor: "#C9A84C", color: "white", padding: "1rem", border: "none", width: "100%", marginTop: "1.5rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "2px", cursor: "pointer" }}>
            View Results
          </button>
        )}
      </div>
    </>
  );
}