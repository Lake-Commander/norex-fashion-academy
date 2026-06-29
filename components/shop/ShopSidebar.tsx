"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

const getColorHex = (colorName: string) => {
  if (!colorName) return "#ccc";
  const normalized = colorName.trim().toLowerCase();
  
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
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260); 
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

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!isDragging.current) return;
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
        .sidebar {
          background: transparent;
          position: relative;
          transition: width 0.3s ease;
        }

        /* 🖥️ PC DRAG & COLLAPSE PANEL MATRIX */
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
        }

        /* 📱 Mobile Accordion Styling Options mapped natively to Bottom-Sheet limits */
        @media(max-width: 1023px) {
          .resize-handle, .collapse-toggle-notch { display: none !important; }
          .sidebar {
            width: 100% !important;
            padding: 0;
          }
        }

        .sidebar-widget {
          margin-bottom: 2rem;
          text-align: left;
        }

        .widget-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.85rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
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
          padding: 0.45rem 0;
          text-align: left;
          font-size: 0.9rem;
          color: #27272a;
          cursor: pointer;
        }
        .filter-btn.active { color: #C9A84C; font-weight: 700; }

        .filter-count {
          font-size: 0.85rem;
          color: #71717a;
          margin-left: auto;
        }

        .color-options {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        }

        .color-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px; /* Amazon Rounded Box Style Option */
          cursor: pointer;
          border: 1px solid #e4e4e7;
          position: relative;
        }
        .color-btn.active { border: 2px solid #1a1a1a; box-shadow: 0 0 0 2px white; }

        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: #e4e4e7;
          border-radius: 4px;
          outline: none;
          margin: 1rem 0;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 1px solid #d1d5db;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
        }

        .btn-reset {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background-color: #f4f4f5;
          border: 1px solid #e4e4e7;
          color: #18181b;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>

      <div 
        className={`sidebar ${isMobileOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
        style={{ width: isCollapsed ? "45px" : `${sidebarWidth}px` }}
      >
        <button 
          type="button" 
          className="collapse-toggle-notch"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {!isCollapsed && <div className="resize-handle" onMouseDown={startResize} />}

        <div className="sidebar-content-wrapper">
          {/* Categories */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Category</h4>
            <ul className="filter-list">
              <li>
                <button className={`filter-btn ${!searchParams.get("category") ? "active" : ""}`} onClick={() => updateFilter("category", "")}>
                  <span>Any Category</span>
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

          {/* Colors */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Color Swatch</h4>
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

          {/* Price Slider */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Price Filter</h4>
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
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>
              <span>Min</span>
              <span style={{ color: "#1a1a1a", fontWeight: 700 }}>Up to {formatPrice(localPrice)}</span>
            </div>
          </div>

          {/* Conditions */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Stock Registry</h4>
            <ul className="filter-list">
              <li>
                <button className={`filter-btn ${searchParams.get("status") === "in-stock" ? "active" : ""}`} onClick={() => updateFilter("status", "in-stock")}>
                  <span>In Stock Availability</span>
                </button>
              </li>
              <li>
                <button className={`filter-btn ${searchParams.get("status") === "featured" ? "active" : ""}`} onClick={() => updateFilter("status", "featured")}>
                  <span>Curated Atelier Pieces</span>
                </button>
              </li>
            </ul>
          </div>

          <button className="btn-reset" onClick={resetFilters}>
            <RotateCcw size={13} /> Clear Layout Criteria
          </button>
        </div>
      </div>
    </>
  );
}