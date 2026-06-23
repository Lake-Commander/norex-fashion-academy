"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ FIXED: Added useRouter import
import { useSession, signOut } from "next-auth/react"; 
import { Menu, X, ChevronDown, ShoppingBag, Heart, User, LayoutDashboard, ArrowUpRight, ArrowDownRight, ClipboardList, GraduationCap, LogOut } from "lucide-react";
import { useShop } from "@/context/ShopContext"; 

const menu_data = [
  { id: 1, title: "Home", link: "/" },
  {
    id: 2,
    products: true,
    title: "Shop",
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
  { 
    id: 3, 
    sub_menu: true, 
    title: "Runway", 
    link: "/runway",
    sub_menus: [
      { title: "Seasonal Collections", link: "/collections" },
      { title: "Luxury Campaigns", link: "/runway/campaigns" },
      { title: "Fashion Films", link: "/runway/fashion-films" },
      { title: "Historical Archive", link: "/archive" }
    ]
  },
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
    title: "Academy", 
    link: "/academy",
    sub_menus: [
      { title: "Academy Hub", link: "/academy" },
      { title: "Explore Courses", link: "/academy/courses" },
      { title: "Apply Online", link: "/academy/apply" }
    ]
  },
  { 
    id: 6, 
    sub_menu: true, 
    title: "House", 
    link: "/house",
    sub_menus: [
      { title: "About Us", link: "/about" },
      { title: "Atelier Craftsmanship", link: "/house/craftsmanship" },
      { title: "Sustainability", link: "/house/sustainability" },
      { title: "Contact Us", link: "/contact" }
    ]
  },
];

export default function Navbar() {
  const router = useRouter(); // ✅ FIXED: Initialized the application routing controller hook
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<number | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pulseCart, setPulseCart] = useState(false);
  const [pulseWishlist, setPulseWishlist] = useState(false);

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  
  const isHome = pathname === "/";
  
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "Member";
  
  const { cart, wishlist } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.orderQuantity, 0);
  const wishlistCount = wishlist.length;

  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [prevWishlistCount, setPrevWishlistCount] = useState(wishlistCount);

  const goldColor = "#C9A84C";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (cartCount > prevCartCount) {
      setPulseCart(true);
      setShowCartPopup(true);
      const timer = setTimeout(() => {
        setPulseCart(false);
        setShowCartPopup(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (wishlistCount > prevWishlistCount) {
      setPulseWishlist(true);
      setShowWishlistPopup(true);
      const timer = setTimeout(() => {
        setPulseWishlist(false);
        setShowWishlistPopup(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    setPrevWishlistCount(wishlistCount);
  }, [wishlistCount, prevWishlistCount, mounted]);

  useEffect(() => {
    setIsOpen(false);
    setActiveMobileMenu(null);
    setShowUserDropdown(false);
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
          .nav-links { display: flex; align-items: center; gap: 0.85rem; list-style: none; margin: 0; padding: 0; height: 100%; }
          .nav-cta { display: flex; align-items: center; gap: 1rem; }
          .mobile-actions { display: none; }
        }
        @media(min-width: 1200px) {
          .nav-links { gap: 1.35rem; }
          .nav-cta { gap: 1.25rem; }
        }

        .nav-item { position: relative; display: flex; align-items: center; height: 72px; }
        .nav-link { display: flex; align-items: center; gap: 0.15rem; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; transition: color 0.3s ease; text-decoration: none; }
        .nav-link:hover { color: var(--gold) !important; }

        .mega-menu {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px);
          background-color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border-top: 3px solid var(--gold);
          padding: 2rem; display: flex; gap: 3rem; opacity: 0; visibility: hidden; transition: all 0.3s ease;
          pointer-events: none; z-index: 100; min-width: 440px; justify-content: center;
        }
        .nav-item:hover .mega-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        .mega-menu-column { min-width: 170px; }
        .mega-menu-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #111; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.4rem; }
        .mega-menu-title a { text-decoration: none; color: inherit; }
        .mega-menu-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; }
        .mega-menu-item a { font-size: 0.8rem; color: #555; text-decoration: none; transition: color 0.2s ease, padding-left 0.2s ease; display: inline-block; }
        .mega-menu-item a:hover { color: var(--gold); padding-left: 4px; }

        .simple-sub-menu {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px);
          background-color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border-top: 3px solid var(--gold);
          padding: 0.75rem 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transition: all 0.3s ease;
          pointer-events: none; z-index: 100; min-width: 200px;
        }
        .nav-item:hover .simple-sub-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        .simple-sub-menu-item a { font-size: 0.8rem; color: #555; text-decoration: none; padding: 0.5rem 1.25rem; display: block; transition: all 0.2s ease; text-align: left; }
        .simple-sub-menu-item a:hover { color: var(--gold); background-color: #faf9f7; padding-left: 1.5rem; }

        .header-action-link {
          position: relative; display: flex; align-items: center; justify-content: center;
          color: inherit; transition: color 0.3s; height: 100%; padding: 0.5rem; cursor: pointer;
        }
        .header-action-link:hover { color: var(--gold) !important; }
        
        .user-luxury-dropdown {
          position: absolute; top: calc(100% - 15px); right: 0;
          background-color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-top: 3px solid var(--gold);
          padding: 0.5rem 0; display: flex; flex-direction: column; opacity: 0; visibility: hidden;
          transform: translateY(10px); transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
          z-index: 110; min-width: 220px; border-radius: 0 0 2px 2px;
        }
        .user-luxury-dropdown.open { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-greeting { padding: 0.75rem 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; border-bottom: 1px solid #f4f4f5; text-align: left; }
        .dropdown-menu-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #555; text-decoration: none; padding: 0.65rem 1.25rem; transition: all 0.2s ease; border: none; background: transparent; width: 100%; cursor: pointer; }
        .dropdown-menu-item:hover { color: var(--gold); background-color: #faf9f7; padding-left: 1.5rem; }

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

        .comic-base-box {
          position: absolute; background: white; color: #1a1a1a; border: 2.5px solid #1a1a1a;
          padding: 0.45rem 0.75rem; font-family: monospace; font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;
          box-shadow: 4px 4px 0px #1a1a1a; z-index: 150; pointer-events: none;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .comic-desktop-box {
          top: 110%; left: 50%; transform: translateX(-50%);
          animation: comicZoomInTop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .comic-desktop-box::after {
          content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
          border-width: 0 7px 7px 7px; border-style: solid; border-color: transparent transparent #1a1a1a transparent;
        }
        .comic-desktop-box::before {
          content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%) translateY(2.5px);
          border-width: 0 6px 6px 6px; border-style: solid; border-color: transparent transparent white transparent; z-index: 160;
        }
        .comic-mobile-box {
          bottom: 145%; left: 50%; transform: translateX(-50%);
          animation: comicZoomInBottom 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .comic-mobile-box::after {
          content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border-width: 7px 7px 0 7px; border-style: solid; border-color: #1a1a1a transparent transparent transparent;
        }
        .comic-mobile-box::before {
          content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(-2.5px);
          border-width: 6px 6px 0 6px; border-style: solid; border-color: white transparent transparent transparent; z-index: 160;
        }

        @keyframes comicZoomInTop {
          0% { transform: translateX(-50%) scale(0.4) translateY(-10px); opacity: 0; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
        @keyframes comicZoomInBottom {
          0% { transform: translateX(-50%) scale(0.4) translateY(10px); opacity: 0; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }

        .mobile-menu {
          display: none; position: fixed; top: 72px; left: 0; width: 100%; height: calc(100vh - 72px);
          overflow-y: auto; background-color: white; z-index: 40; padding-bottom: 80px;
        }
        .mobile-menu.open { display: block; }
        .mobile-sub-menu { background-color: #faf9f7; overflow: hidden; transition: max-height 0.3s ease; }
        .mobile-sub-menu-inner { padding: 0.5rem 1.5rem; display: flex; flex-direction: column; }
        .mobile-sub-link { padding: 0.75rem 0; font-size: 0.85rem; color: #555; text-decoration: none; border-bottom: 1px solid #f0ebe3; text-align: left; }
        .mobile-sub-link:last-child { border-bottom: none; }
        .mobile-sub-link:hover { color: var(--gold); }

        @keyframes subtleBadgeGrow {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); background-color: #1a1a1a; }
          100% { transform: scale(1); }
        }
        .badge-pulse-active { animation: subtleBadgeGrow 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

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
            font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.3s; position: relative;
          }
          .bottom-bar-link:hover { color: var(--gold); }
          .nav-logo { height: 45px !important; }
        }

        .icon-badge {
          position: absolute; top: 0px; right: -4px; background-color: var(--gold); color: white;
          font-size: 0.55rem; width: 16px; height: 16px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; font-weight: bold; transition: all 0.3s;
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
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px", padding: "0 4%" }}
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
                    {(item.products || item.sub_menu) && <ChevronDown size={11} style={{ marginLeft: "1px" }} />}
                  </Link>

                  {item.products && item.product_pages && (
                    <div className="mega-menu">
                      {item.product_pages.map((col, idx) => (
                        <div key={idx} className="mega-menu-column text-left">
                          <Link href={col.link} className="mega-menu-title">{col.title}</Link>
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

          {/* Desktop Actions Layout */}
          <div className="nav-cta">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isTransparent ? "white" : "#1a1a1a" }}>
              
              {/* Interactive Dropdown Core */}
              <div 
                ref={dropdownRef} 
                className="relative" 
                style={{ height: "100%", display: "flex", alignItems: "center" }}
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      setShowUserDropdown(!showUserDropdown);
                    } else {
                      router.push("/login");
                    }
                  }} 
                  className="header-action-link"
                >
                  {isAuthenticated ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#C9A84C]">
                      <span>Hi, {firstName}</span>
                      <ChevronDown size={12} style={{ transform: showUserDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  ) : (
                    <User size={16} />
                  )}
                  {!isAuthenticated && <span className="action-tooltip">Sign In / Register</span>}
                </div>

                            {/* Account Dashboard Popover menu passes */}
            {isAuthenticated && (
              <div 
                className={`user-luxury-dropdown ${showUserDropdown ? "open" : ""}`}
                style={{ top: "calc(100% + 12px)" }} /* ⚡ Pushes the layout block down directly */
              >
                {/* <div className="dropdown-greeting">Atelier Registry Node</div> */}
                <Link href="/dashboard" className="dropdown-menu-item">
                  <LayoutDashboard size={13} /> <span>Go to Dashboard</span>
                </Link>
                <Link href="/dashboard?tab=commerce" className="dropdown-menu-item">
                  <ClipboardList size={13} /> <span>My Orders</span>
                </Link>
                <Link href="/dashboard?tab=academy" className="dropdown-menu-item">
                  <GraduationCap size={13} /> <span>Academy Apps</span>
                </Link>
                <button 
                  type="button" 
                  onClick={() => signOut({ callbackUrl: "/" })} 
                  className="dropdown-menu-item text-red-500 hover:text-red-600 font-bold border-t"
                  style={{ borderTopColor: '#f4f4f5', marginTop: '0.25rem', paddingTop: '0.5rem' }}
                >
                  <LogOut size={13} /> <span>Sign Out</span>
                </button>
              </div>
            )}
              </div>

              <div style={{ width: "1px", height: "14px", backgroundColor: isTransparent ? "rgba(255,255,255,0.3)" : "#e5e7eb", margin: "0 0.15rem" }} />

              <Link href="/wishlist" className="header-action-link">
                <Heart size={16} />
                {mounted && wishlistCount > 0 && (
                  <span className={`icon-badge ${pulseWishlist ? "badge-pulse-active" : ""}`}>{wishlistCount}</span>
                )}
                {showWishlistPopup && (
                  <div className="comic-base-box comic-desktop-box">
                    <span>Pinned to Registry!</span> <ArrowDownRight size={11} className="text-[#C9A84C]" />
                  </div>
                )}
                <span className="action-tooltip">Wishlist</span>
              </Link>
              
              <Link href="/cart" className="header-action-link">
                <ShoppingBag size={16} />
                {mounted && cartCount > 0 && (
                  <span className={`icon-badge ${pulseCart ? "badge-pulse-active" : ""}`}>{cartCount}</span>
                )}
                {showCartPopup && (
                  <div className="comic-base-box comic-desktop-box">
                    <span>Added to Bag!</span> <ArrowDownRight size={11} className="text-[#C9A84C]" />
                  </div>
                )}
                <span className="action-tooltip">Cart</span>
              </Link>
            </div>

            <Link
              href="/academy/apply"
              style={{
                fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
                padding: "0.6rem 1.35rem", backgroundColor: isTransparent ? "white" : goldColor,
                color: isTransparent ? goldColor : "white", transition: "all 0.3s", textDecoration: "none", borderRadius: "2px",
              }}
              onMouseEnter={(e) => { if (!isTransparent) e.currentTarget.style.backgroundColor = "#B49542"; }}
              onMouseLeave={(e) => { if (!isTransparent) e.currentTarget.style.backgroundColor = goldColor; }}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Hamburger toggle */}
          <div className="mobile-actions" style={{ alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: isTransparent ? "white" : "#1a1a1a", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Sidebar Navigation Menu */}
        <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {menu_data.map((item) => {
              const isSubMenuOpen = activeMobileMenu === item.id;
              const processingSubmenuList = item.products 
                ? [
                    { title: "Women's Department", link: "/shop?gender=Female" },
                    { title: "Men's Department", link: "/shop?gender=Male" },
                    { title: "Full Catalog", link: "/shop" }
                  ]
                : item.sub_menus;
              
              if (item.products || item.sub_menu) {
                return (
                  <div key={item.id}>
                    <div style={{ display: "flex", borderBottom: "1px solid #f0ebe3" }}>
                      <Link 
                        href={item.link} 
                        onClick={() => setIsOpen(false)}
                        style={{ 
                          flex: 1, padding: "1.25rem 1.5rem", color: isSubMenuOpen ? goldColor : "#111", 
                          textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, 
                          textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left"
                        }}
                      >
                        {item.title}
                      </Link>
                      <button 
                        type="button"
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
                    
                    <div className="mobile-sub-menu" style={{ maxHeight: isSubMenuOpen ? "500px" : "0" }}>
                      <div className="mobile-sub-menu-inner">
                        {processingSubmenuList?.map((sub, i) => (
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
                    fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left"
                  }}
                >
                  {item.title}
                </Link>
              );
            })}

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

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <Link href={isAuthenticated ? "/dashboard" : "/login"} className="bottom-bar-link">
          {isAuthenticated ? <LayoutDashboard size={20} className="text-[#C9A84C]" /> : <User size={20} />}
          <span>{isAuthenticated ? "Dashboard" : "Account"}</span>
        </Link>
        
        <Link href="/wishlist" className="bottom-bar-link">
          <div style={{ position: "relative" }}>
            <Heart size={20} />
            {mounted && wishlistCount > 0 && (
              <span className={`icon-badge bottom-badge ${pulseWishlist ? "badge-pulse-active" : ""}`}>{wishlistCount}</span>
            )}
          </div>
          {showWishlistPopup && (
            <div className="comic-base-box comic-mobile-box">
              <span>Pinned to Registry!</span> <ArrowUpRight size={11} className="text-[#C9A84C]" />
            </div>
          )}
          <span>Wishlist</span>
        </Link>
        
        <Link href="/cart" className="bottom-bar-link">
          <div style={{ position: "relative" }}>
            <ShoppingBag size={20} />
            {mounted && cartCount > 0 && (
              <span className={`icon-badge bottom-badge ${pulseCart ? "badge-pulse-active" : ""}`}>{cartCount}</span>
            )}
          </div>
          {showCartPopup && (
            <div className="comic-base-box comic-mobile-box">
              <span>Added to Bag!</span> <ArrowUpRight size={11} className="text-[#C9A84C]" />
            </div>
          )}
          <span>Cart</span>
        </Link>
      </div>
    </>
  );
}