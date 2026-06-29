"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
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
  const [products, setProducts] = useState<any[]>([]);
  const [maxProductPrice, setMaxProductPrice] = useState(100000); 
  const [localPrice, setLocalPrice] = useState(100000);

  const categories = useMemo(() => {
    if (!products.length) return [];
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  }, [products]);

  const colors = useMemo(() => {
    if (!products.length) return [];
    return Array.from(new Set(products.flatMap((p) => p.colors || []))).filter(Boolean);
  }, [products]);

  // ⚡ Fetch live catalog items on layout mount to sync item count allocations
  useEffect(() => {
    async function fetchSidebarFacets() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success && data.products?.length) {
          setProducts(data.products);
          const maxPrice = Math.max(...data.products.map((p: any) => p.price || 0));
          setMaxProductPrice(maxPrice);
          
          // ✅ FIXED: Safely analyze parameters without undefined runtime loops
          const currentPriceParam = searchParams.get("price");
          setLocalPrice(currentPriceParam ? Number(currentPriceParam) : maxPrice);
        }
      } catch (err) {
        console.error("Failed synchronizing sidebar catalog facets:", err);
      }
    }
    fetchSidebarFacets();
  }, [searchParams]);

  // Sync local price slider with search param updates
  useEffect(() => {
    const urlPrice = searchParams.get("price");
    if (urlPrice) {
      setLocalPrice(Number(urlPrice));
    } else if (products.length) {
      setLocalPrice(maxProductPrice);
    }
  }, [searchParams, maxProductPrice, products]);

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

        /* 🖥️ PC INDEPENDENT ROLLER SCROLL CONFIGURATION */
        @media(min-width: 1024px) {
          .sidebar {
            position: sticky;
            top: 8rem;                       
            height: calc(100vh - 10rem);     
            overflow-y: auto;                
            padding-right: 1rem;
          }
          
          .sidebar::-webkit-scrollbar { width: 4px; }
          .sidebar::-webkit-scrollbar-track { background: transparent; }
          .sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 2px; }
          .sidebar::-webkit-scrollbar-thumb:hover { background: #C9A84C; }
        }

        /* 📱 RESPONSIVE MOBILE ACCORDION OVERLAYS */
        @media(max-width: 1023px) {
          .sidebar {
            position: fixed; 
            inset: 0 auto 0 0; 
            width: 320px; 
            max-width: 85vw;
            background: white; 
            z-index: 50; 
            padding: 2.5rem 2rem;
            box-shadow: 25px 0 50px rgba(0,0,0,0.1);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto; 
            height: 100vh;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          
          .sidebar-content-wrapper {
            padding-bottom: 7.5rem; 
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
        .filter-btn:hover { color: #C9A84C; }
        .filter-btn.active { color: #C9A84C; font-weight: 700; }

        .filter-count {
          font-size: 0.9rem;
          color: #71717a;
          font-family: var(--font-sans), sans-serif;
          margin-left: auto;
          font-weight: 400;
        }

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
        .color-btn:hover { transform: scale(1.15); }
        .color-btn.active { border: 2px solid #C9A84C; box-shadow: 0 0 0 2px white; }

        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          background: #e4e4e7;
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
          background: #1a1a1a;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          transition: transform 0.1s ease;
        }
        .price-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

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
        .btn-reset:hover { background-color: #e4e4e7; }
      `}</style>

      <div className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-content-wrapper">
          
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
              {/* ✅ FIXED: Corrected JSX structural <li> alignment matching closure models */}
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

          {/* Variation Options Matrix Row */}
          <div className="sidebar-row-box" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.75rem" }}>Colors</p>
              <div className="color-options">
                {Array.from(new Set(products.flatMap(p => p.colors || []))).map((color: any) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => updateFilter("color", color)}
                    className={`color-btn ${searchParams.get("color") === color ? "active" : ""}`}
                    style={{ background: getColorHex(color) }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Price Widget */}
          <div className="sidebar-widget" style={{ marginTop: "1.5rem" }}>
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
      </div>
    </>
  );
}