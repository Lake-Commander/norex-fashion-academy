"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag, Heart, User } from "lucide-react";
import { useShop } from "@/context/ShopContext"; 

const home_1 = "/assets/img/menu/menu-home-1.jpg";

const menu_data = [
  {
    id: 1,
    homes: true,
    title: "Home",
    link: "/",
    home_pages: [
      { img: home_1, title: "Norex Fashion School", link: "/" }
    ],
  },
  {
    id: 2,
    products: true,
    title: "Collections",
    link: "/shop",
    product_pages: [
      {
        title: "Women",
        link: "/shop?gender=Female",
        mega_menus: [
          { title: "Evening Wear", link: "/shop?gender=Female&category=Evening Wear" },
          { title: "Bridal", link: "/shop?gender=Female&category=Bridal" },
          { title: "Casual Wear", link: "/shop?gender=Female&category=Casual Wear" },
          { title: "Work Wear", link: "/shop?gender=Female&category=Work Wear" },
          { title: "Unisex / Co-ords", link: "/shop?gender=Both" },
        ],
      },
      {
        title: "Men",
        link: "/shop?gender=Male",
        mega_menus: [
          { title: "Traditional Wear", link: "/shop?gender=Male&category=Traditional" },
          { title: "Corporate Collections", link: "/shop?gender=Male&category=Corporate" },
          { title: "Bespoke Tailoring", link: "/shop?gender=Male&category=Bespoke" },
          { title: "Casual Designs", link: "/shop?gender=Male&category=Casual Wear" },
          { title: "Unisex / Co-ords", link: "/shop?gender=Both" },
        ],
      }
    ],
  },
 // { id: 3, single_link: true, title: "Portfolio", link: "/portfolio" },
  { 
    id: 4, 
    sub_menu: true, 
    title: "Editorial", 
    link: "/editorial",
    sub_menus: [
      { title: "Stories", link: "/editorial/stories" },
      { title: "Insights", link: "/editorial/insights" },
      { title: "Interviews", link: "/editorial/interviews" }
    ]
  },
  { 
    id: 5, 
    sub_menu: true, 
    title: "Runway", 
    link: "/runway",
    sub_menus: [
      { title: "Latest Show", link: "/runway/latest-show" },
      { title: "Campaigns", link: "/runway/campaigns" },
      { title: "Fashion Films", link: "/runway/fashion-films" }
    ]
  },
  { id: 6, single_link: true, title: "Academy", link: "/academy" },
  { id: 7, single_link: true, title: "House", link: "/about" },
  { id: 8, single_link: true, title: "Contact", link: "/contact" },
];

const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: "Home",
    link: "/",
    sub_menus: [
      { title: "Norex Fashion", link: "/" },
    ],
  },
  {
    id: 2,
    sub_menu: true,
    title: "Collections",
    link: "/shop",
    sub_menus: [
      { title: "All Designs", link: "/shop" },
      { title: "Women's Collection", link: "/shop?gender=Female" },
      { title: "Men's Collection", link: "/shop?gender=Male" },
      { title: "Unisex Designs", link: "/shop?gender=Both" },
    ],
  },
 // { id: 3, single_link: true, title: "Portfolio", link: "/portfolio" },
  {
    id: 4,
    sub_menu: true,
    title: "Editorial",
    link: "/editorial",
    sub_menus: [
      { title: "Stories", link: "/editorial/stories" },
      { title: "Insights", link: "/editorial/insights" },
      { title: "Interviews", link: "/editorial/interviews" },
    ],
  },
  {
    id: 5,
    sub_menu: true,
    title: "Runway",
    link: "/runway",
    sub_menus: [
      { title: "Latest Show", link: "/runway/latest-show" },
      { title: "Campaigns", link: "/runway/campaigns" },
      { title: "Fashion Films", link: "/runway/fashion-films" },
    ],
  },
  {
    id: 6,
    sub_menu: true,
    title: "Academy",
    link: "/academy",
    sub_menus: [
      { title: "Design Training", link: "/academy/design-training" },
      { title: "Sewing Classes", link: "/academy/sewing-classes" },
      { title: "Entrepreneurship", link: "/academy/entrepreneurship" },
    ],
  },
  { id: 7, single_link: true, title: "About Us", link: "/about" },
  { id: 8, single_link: true, title: "Contact Us", link: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<number | null>(null);
  
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  // Context Data
  const { cart, wishlist } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.orderQuantity, 0);
  const wishlistCount = wishlist.length;

  const goldColor = "#C9A84C";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveMobileMenu(null);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  const toggleMobileMenu = (id: number) => {
    setActiveMobileMenu(activeMobileMenu === id ? null : id);
  };

  return (
    <>
      <style>{`
        :root { --gold: ${goldColor}; }
        
        .nav-links { display: none; }
        .nav-cta { display: none; }
        .mobile-actions { display: flex; }
        .mobile-bottom-bar { display: none; }
        
        @media(min-width: 992px) {
          .nav-links { display: flex; align-items: center; gap: 1.25rem; list-style: none; margin: 0; padding: 0; height: 100%; }
          .nav-cta { display: flex; align-items: center; gap: 1.5rem; }
          .mobile-actions { display: none; }
        }
        @media(min-width: 1200px) {
          .nav-links { gap: 2rem; }
        }

        /* --- Desktop Menu Styling --- */
        .nav-item { position: relative; display: flex; align-items: center; height: 72px; }
        .nav-link { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; transition: color 0.3s ease; text-decoration: none; }
        .nav-link:hover { color: var(--gold) !important; }

        /* --- Desktop Mega Menu (Collections) --- */
        .mega-menu {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px);
          background-color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border-top: 3px solid var(--gold);
          padding: 2.5rem; display: flex; gap: 4rem; opacity: 0; visibility: hidden; transition: all 0.3s ease;
          pointer-events: none; z-index: 100; min-width: 400px; justify-content: center;
        }
        .nav-item:hover .mega-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        .mega-menu-column { min-width: 180px; }
        .mega-menu-title { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: #111; margin-bottom: 1.25rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .mega-menu-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .mega-menu-item a { font-size: 0.85rem; color: #555; text-decoration: none; transition: color 0.2s ease, padding-left 0.2s ease; display: inline-block; }
        .mega-menu-item a:hover { color: var(--gold); padding-left: 5px; }

        /* --- Desktop Simple Sub Menu (Editorial/Runway) --- */
        .simple-sub-menu {
          position: absolute; top: 100%; left: 0;
          background-color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border-top: 3px solid var(--gold);
          padding: 1rem 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transition: all 0.3s ease;
          pointer-events: none; z-index: 100; min-width: 220px;
        }
        .nav-item:hover .simple-sub-menu { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
        .simple-sub-menu-item a { font-size: 0.85rem; color: #555; text-decoration: none; padding: 0.6rem 1.5rem; display: block; transition: all 0.2s ease; }
        .simple-sub-menu-item a:hover { color: var(--gold); background-color: #faf9f7; padding-left: 1.75rem; }

        /* --- Header Actions & Tooltips --- */
        .header-action-link {
          display: flex; align-items: center; justify-content: center; position: relative;
          color: inherit; transition: color 0.3s; height: 100%; padding: 0.5rem;
        }
        .header-action-link:hover { color: var(--gold) !important; }
        
        .action-tooltip {
          position: absolute; bottom: -35px; left: 50%; transform: translateX(-50%) translateY(5px);
          background-color: #1a1a1a; color: white; padding: 0.4rem 0.75rem;
          font-size: 0.65rem; border-radius: 2px; white-space: nowrap;
          opacity: 0; visibility: hidden; transition: all 0.2s ease;
          pointer-events: none; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
        }
        .action-tooltip::before {
          content: ''; position: absolute; top: -4px; left: 50%; transform: translateX(-50%);
          border-width: 0 4px 4px 4px; border-style: solid; border-color: transparent transparent #1a1a1a transparent;
        }
        .header-action-link:hover .action-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }

        /* --- Mobile Menu --- */
        .mobile-menu {
          display: none; position: fixed; top: 72px; left: 0; width: 100%; height: calc(100vh - 72px);
          overflow-y: auto; background-color: white; z-index: 40; padding-bottom: 80px; /* Space for bottom bar */
        }
        .mobile-menu.open { display: block; }
        
        .mobile-sub-menu { background-color: #faf9f7; overflow: hidden; transition: max-height 0.3s ease; }
        .mobile-sub-menu-inner { padding: 0.5rem 1.5rem; display: flex; flex-direction: column; }
        .mobile-sub-link { padding: 0.75rem 0; font-size: 0.85rem; color: #555; text-decoration: none; border-bottom: 1px solid #f0ebe3; }
        .mobile-sub-link:last-child { border-bottom: none; }
        .mobile-sub-link:hover { color: var(--gold); }

        /* --- Mobile Bottom Bar --- */
        @media(max-width: 991px) {
          .mobile-bottom-bar {
            display: flex; position: fixed; bottom: 0; left: 0; width: 100%;
            background-color: white; border-top: 1px solid #f0ebe3; z-index: 60;
            justify-content: space-around; padding: 0.75rem 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          }
          .bottom-bar-link {
            flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 0.25rem; color: #1a1a1a; text-decoration: none; font-size: 0.65rem;
            font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.3s;
          }
          .bottom-bar-link:hover { color: var(--gold); }
          .nav-logo { height: 45px !important; }
        }

        /* --- Utility --- */
        .icon-badge {
          position: absolute; top: 0px; right: -4px; background-color: var(--gold); color: white;
          font-size: 0.55rem; width: 16px; height: 16px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; font-weight: bold;
        }
        .bottom-badge { top: -6px; right: -10px; }
      `}</style>

      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all 0.3s ease",
          backgroundColor: isTransparent ? "transparent" : "white",
          borderBottom: isTransparent ? "none" : "1px solid #f0ebe3",
        }}
      >
        <nav
          className="container-custom"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px", padding: "0 5%" }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/tolani-logo.png"
              alt="Norex Fashion"
              className="nav-logo"
              style={{
                height: isTransparent ? "70px" : "55px", width: "auto", objectFit: "contain",
                transition: "all 0.3s", filter: isTransparent ? "brightness(0) invert(1)" : "none",
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {menu_data.map((item) => {
              const isActive = pathname === item.link || pathname.startsWith(item.link + "/");
              const linkColor = isTransparent ? "rgba(255,255,255,0.9)" : (isActive ? goldColor : "#4b5563");

              return (
                <li key={item.id} className="nav-item group">
                  <Link href={item.link} className="nav-link" style={{ color: linkColor }}>
                    {item.title}
                    {(item.products || item.sub_menu || item.homes) && <ChevronDown size={14} style={{ marginLeft: "2px" }} />}
                  </Link>

                  {/* Mega Menu Dropdown (For Collections) */}
                  {item.products && item.product_pages && (
                    <div className="mega-menu">
                      {item.product_pages.map((col, idx) => (
                        <div key={idx} className="mega-menu-column">
                          <Link href={col.link} className="mega-menu-title" style={{ display: "block", textDecoration: "none" }}>{col.title}</Link>
                          <ul className="mega-menu-list">
                            {col.mega_menus.map((linkItem, i) => (
                              <li key={i} className="mega-menu-item">
                                <Link href={linkItem.link}>{linkItem.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Simple Sub Menu Dropdown (For Editorial & Runway) */}
                  {item.sub_menu && item.sub_menus && (
                    <div className="simple-sub-menu">
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {item.sub_menus.map((sub, i) => (
                          <li key={i} className="simple-sub-menu-item">
                            <Link href={sub.link}>{sub.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-cta">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isTransparent ? "white" : "#1a1a1a" }}>
              
              <Link href="/login" className="header-action-link">
                <User size={18} />
                <span className="action-tooltip">Sign In / Register</span>
              </Link>

              <div style={{ width: "1px", height: "16px", backgroundColor: isTransparent ? "rgba(255,255,255,0.3)" : "#e5e7eb", margin: "0 0.25rem" }} />

              <Link href="/wishlist" className="header-action-link">
                <Heart size={18} />
                {mounted && wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
                <span className="action-tooltip">Wishlist</span>
              </Link>
              
              <Link href="/cart" className="header-action-link">
                <ShoppingBag size={18} />
                {mounted && cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
                <span className="action-tooltip">Cart</span>
              </Link>
            </div>

            <Link
              href="/academy/apply"
              style={{
                fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                padding: "0.75rem 1.75rem", backgroundColor: isTransparent ? "white" : goldColor,
                color: isTransparent ? goldColor : "white", transition: "all 0.3s", textDecoration: "none", borderRadius: "2px",
              }}
              onMouseEnter={(e) => { if (!isTransparent) e.currentTarget.style.backgroundColor = "#B49542"; }}
              onMouseLeave={(e) => { if (!isTransparent) e.currentTarget.style.backgroundColor = goldColor; }}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Hamburger (Icons moved to bottom bar) */}
          <div className="mobile-actions" style={{ alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: isTransparent ? "white" : "#1a1a1a", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {mobile_menu.map((item) => {
              const isSubMenuOpen = activeMobileMenu === item.id;
              
              if (item.sub_menu || item.homes) {
                return (
                  <div key={item.id}>
                    {/* Split Click Area: Text Link & Button Edge */}
                    <div style={{ display: "flex", borderBottom: "1px solid #f0ebe3" }}>
                      <Link 
                        href={item.link} 
                        onClick={() => setIsOpen(false)}
                        style={{ 
                          flex: 1, padding: "1.25rem 1.5rem", color: isSubMenuOpen ? goldColor : "#111", 
                          textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, 
                          textTransform: "uppercase", letterSpacing: "0.05em" 
                        }}
                      >
                        {item.title}
                      </Link>
                      <button 
                        onClick={() => toggleMobileMenu(item.id)}
                        style={{ 
                          padding: "0 1.5rem", borderLeft: "1px solid #f0ebe3", background: "none", 
                          borderTop: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", 
                          color: isSubMenuOpen ? goldColor : "#111" 
                        }}
                      >
                        <ChevronDown size={18} style={{ transform: isSubMenuOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
                      </button>
                    </div>
                    
                    {/* Dropdown Content */}
                    <div className="mobile-sub-menu" style={{ maxHeight: isSubMenuOpen ? "500px" : "0" }}>
                      <div className="mobile-sub-menu-inner">
                        {item.sub_menus?.map((sub, i) => (
                          <Link key={i} href={sub.link} className="mobile-sub-link" onClick={() => setIsOpen(false)}>
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    display: "block", padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ebe3", 
                    textDecoration: "none", color: pathname === item.link ? goldColor : "#111", 
                    fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" 
                  }}
                >
                  {item.title}
                </Link>
              );
            })}

            {/* Mobile Action Buttons inside Menu */}
            <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link
                href="/academy/apply"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "block", textAlign: "center", padding: "1rem", backgroundColor: goldColor, color: "white",
                  fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none", borderRadius: "2px"
                }}
              >
                Apply for Academy
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <Link href="/login" className="bottom-bar-link">
          <User size={20} />
          <span>Account</span>
        </Link>
        
        <Link href="/wishlist" className="bottom-bar-link">
          <div style={{ position: "relative" }}>
            <Heart size={20} />
            {mounted && wishlistCount > 0 && <span className="icon-badge bottom-badge">{wishlistCount}</span>}
          </div>
          <span>Wishlist</span>
        </Link>
        
        <Link href="/cart" className="bottom-bar-link">
          <div style={{ position: "relative" }}>
            <ShoppingBag size={20} />
            {mounted && cartCount > 0 && <span className="icon-badge bottom-badge">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </Link>
      </div>
    </>
  );
}