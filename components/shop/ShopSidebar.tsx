"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"; //Not in use, wanted to include a sliding panel icon for the sidebar collapse toggle, but it was too small to be effective. Will revisit later.

// ✅ ENHANCED: Case-insensitive semantic matching engine for arbitrary luxury colors
const getColorHex = (colorName: string) => {
  if (!colorName) return "#ccc";
  
  const normalized = colorName.trim().toLowerCase();
  
  // 1. Direct Premium/Luxury Color Map Alignment
  const exactMap: Record<string, string> = {
    "crimson": "#990000",
    "midnight black": "#111111",
    "ivory": "#FFFFF0",
    "pearl white": "#F8F8FF",
    "wine": "#722F37",
    "forest green": "#228B22",
    "navy": "#000080",
    "charcoal": "#36454F",
    "burgundy": "#800020",
    "multi-print": "linear-gradient(to right, #C9A84C, #722F37)",
    "noir black": "#0a0a0a",
    "black": "#111111",
    "white": "#ffffff",
    "gold": "#C9A84C",
    "silver": "#C0C0C0",
    "nude": "#E3C1B4",
    "beige": "#F5F5DC",
  };
  
  if (exactMap[normalized]) return exactMap[normalized];

  // 2. Base Keyword Fallback Extraction (Handles "Emerald Green", "Sapphire Blue", etc.)
  if (normalized.includes("black") || normalized.includes("noir")) return "#111111";
  if (normalized.includes("white") || normalized.includes("ivory")) return "#F8F8FF";
  if (normalized.includes("green") || normalized.includes("emerald")) return "#046307"; 
  if (normalized.includes("blue") || normalized.includes("sapphire")) return "#0f4c81";  
  if (normalized.includes("red") || normalized.includes("wine")) return "#a91b2e";      
  if (normalized.includes("gold") || normalized.includes("yellow")) return "#D4AF37";
  if (normalized.includes("pink") || normalized.includes("rose")) return "#FFB6C1";
  if (normalized.includes("purple") || normalized.includes("plum")) return "#4A0E4E";
  if (normalized.includes("brown") || normalized.includes("tan") || normalized.includes("nude")) return "#8B5A2B";
  if (normalized.includes("grey") || normalized.includes("gray") || normalized.includes("charcoal")) return "#555555";

  // 3. Mathematical HSL String Hash Fallback for completely custom terms
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 55%, 65%)`; 
};

export default function ShopSidebar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean, setIsMobileOpen: (v: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [maxProductPrice, setMaxProductPrice] = useState(100000); 
  const [localPrice, setLocalPrice] = useState(100000);
  
  // ⚡ Interactive Layout States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260); // Base desk state width in px
  const isDragging = useRef(false);

  const categories = useMemo(() => {
    if (!products.length) return [];
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  }, [products]);

  const colors = useMemo(() => {
    if (!products.length) return [];
    return Array.from(new Set(products.flatMap((p) => p.colors || []))).filter(Boolean);
  }, [products]);

  useEffect(() => {
    async function fetchSidebarFacets() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success && data.products?.length) {
          setProducts(data.products);
          const maxPrice = Math.max(...data.products.map((p: any) => p.price || 0));
          setMaxProductPrice(maxPrice);
          
          const currentPriceParam = searchParams.get("price");
          setLocalPrice(currentPriceParam ? Number(currentPriceParam) : maxPrice);
        }
      } catch (err) {
        console.error("Failed synchronizing sidebar catalog facets:", err);
      }
    }
    fetchSidebarFacets();
  }, [searchParams]);

  useEffect(() => {
    const urlPrice = searchParams.get("price");
    if (urlPrice) {
      setLocalPrice(Number(urlPrice));
    } else if (products.length) {
      setLocalPrice(maxProductPrice);
    }
  }, [searchParams, maxProductPrice, products]);

  // 📐 Resizing Track Handle Event Listeners
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!isDragging.current) return;
    // Keep sidebar widths securely configured between 200px and 380px spaces
    if (e.clientX > 200 && e.clientX < 380) {
      setSidebarWidth(e.clientX);
    }
  };

  const stopResize = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

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
          position: relative;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* 🖥️ DESKTOP DRAG & COLLAPSE PANEL CONTROLS */
        @media(min-width: 1024px) {
          .sidebar {
            position: sticky;
            top: 8rem;                       
            height: calc(100vh - 10rem);     
            overflow-y: auto;                
            padding-right: 1.25rem;
          }
          
          .sidebar.collapsed {
            width: 45px !important;
            padding: 0 !important;
            overflow: hidden;
          }

          .sidebar.collapsed .sidebar-content-wrapper {
            display: none !important;
          }

          .sidebar::-webkit-scrollbar { width: 4px; }
          .sidebar::-webkit-scrollbar-track { background: transparent; }
          .sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 2px; }
          .sidebar::-webkit-scrollbar-thumb:hover { background: #C9A84C; }

          .resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 5px;
            cursor: col-resize;
            background: transparent;
            transition: background 0.2s;
            z-index: 30;
          }
          .resize-handle:hover, .resize-handle:active {
            background: rgba(201, 168, 76, 0.3);
          }

          .collapse-toggle-notch {
            position: absolute;
            top: 0;
            right: -12px;
            width: 24px;
            height: 24px;
            background: white;
            border: 1px solid #e4e4e7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 40;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            color: #1a1a1a;
          }
          .collapse-toggle-notch:hover {
            color: #C9A84C;
            border-color: #C9A84C;
          }
        }

        @media(max-width: 1023px) {
          .resize-handle, .collapse-toggle-notch { display: none !important; }
          .sidebar {
            position: fixed; 
            inset: 0 auto 0 0; 
            width: 320px !important; 
            max-width: 85vw;
            background: white; 
            z-index: 50; 
            padding: 2.5rem 2rem;
            box-shadow: 25px 0 50px rgba(0,0,0,0.1);
            transform: translateX(-100%);
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
          font-size: 1.2rem;
          font-weight: 700;
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

      <div 
        className={`sidebar ${isMobileOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
        style={{ width: isCollapsed ? "45px" : `${sidebarWidth}px` }}
      >
        {/* Toggle Collapse Control Notch Button */}
        <button 
          type="button" 
          className="collapse-toggle-notch"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Filters" : "Collapse Filters"}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Resizer Node Line Bar */}
        {!isCollapsed && <div className="resize-handle" onMouseDown={startResize} />}

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

          {/* Colors Widget */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Colors</h3>
            <div className="color-options">
              {colors.map((color) => (
                <button 
                  key={color} 
                  title={color}
                  type="button"
                  className={`color-btn ${searchParams.get("color") === color ? "active" : ""}`}
                  style={{ background: getColorHex(color) }}
                  onClick={() => updateFilter("color", color)}
                />
              ))}
            </div>
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