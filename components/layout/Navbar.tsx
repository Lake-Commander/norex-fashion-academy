"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

// You can adjust these image paths or import them properly from your @assets folder
const home_1 = "/assets/img/menu/menu-home-1.jpg";
const home_2 = "/assets/img/menu/menu-home-2.jpg";
const home_3 = "/assets/img/menu/menu-home-3.jpg";
const home_4 = "/assets/img/menu/menu-home-4.jpg";

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
        link: "/shop",
        mega_menus: [
          { title: "Ankara & Traditional", link: "/shop?category=ankara" },
          { title: "Bridal & Occasion", link: "/shop?category=bridal" },
          { title: "Corporate Wear", link: "/shop?category=corporate" },
          { title: "Luxury Couture", link: "/shop?category=luxury" },
        ],
      },
      {
        title: "Men",
        link: "/shop",
        mega_menus: [
          { title: "Traditional Wear", link: "/shop?category=traditional" },
          { title: "Corporate Collections", link: "/shop?category=corporate" },
          { title: "Casual Designs", link: "/shop?category=casual" },
          { title: "Bespoke Tailoring", link: "/shop?category=bespoke" },
          { title: "Evening Wear", link: "/shop?category=Evening Wear" },
        ],
      },
      {
        title: "Services",
        link: "/shop",
        mega_menus: [
          { title: "Custom Design", link: "/services/custom-design" },
          { title: "Consultations", link: "/services/consultations" },
          { title: "Uniforms & Corporate", link: "/services/corporate" },
          { title: "Fashion Styling", link: "/services/styling" },
        ],
      },
      {
        title: "Account",
        link: "/profile",
        mega_menus: [
          { title: "My Account", link: "/profile" },
          { title: "My Orders", link: "/orders" },
          { title: "Wishlist", link: "/wishlist" },
          { title: "Checkout", link: "/checkout" },
        ],
      },
    ],
  },
  { id: 3, single_link: true, title: "Academy", link: "/academy" },
  { id: 4, single_link: true, title: "Portfolio", link: "/portfolio" },
  { id: 5, single_link: true, title: "About Us", link: "/about" },
  { id: 6, single_link: true, title: "Contact", link: "/contact" },
];

const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: "Home",
    link: "/",
    sub_menus: [
      { title: "Norex Fashion School", link: "/" },
      { title: "Academy", link: "/academy" },
      { title: "Portfolio", link: "/portfolio" },
      { title: "Inspirations", link: "/inspiration" },
    ],
  },
  {
    id: 2,
    sub_menu: true,
    title: "Collections",
    link: "/shop",
    sub_menus: [
      { title: "All Designs", link: "/shop" },
      { title: "Women - Ankara & Traditional", link: "/shop?category=ankara" },
      { title: "Women - Bridal & Occasion", link: "/shop?category=bridal" },
      { title: "Men - Traditional Wear", link: "/shop?category=traditional" },
      { title: "Men - Bespoke Tailoring", link: "/shop?category=bespoke" },
      { title: "Custom Services", link: "/services/custom-design" },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: "Academy",
    link: "/academy",
    sub_menus: [
      { title: "Design Training", link: "/academy/design-training" },
      { title: "Sewing Classes", link: "/academy/sewing-classes" },
      { title: "Entrepreneurship", link: "/academy/entrepreneurship" },
      { title: "Women Empowerment", link: "/academy/empowerment" },
      { title: "Certifications", link: "/academy/certifications" },
    ],
  },
  {
    id: 4,
    sub_menu: true,
    title: "Services",
    link: "/services",
    sub_menus: [
      { title: "Custom Design", link: "/services/custom-design" },
      { title: "Fashion Consultations", link: "/services/consultations" },
      { title: "Corporate Uniforms", link: "/services/corporate" },
      { title: "Style Advisory", link: "/services/styling" },
      { title: "Bridal Services", link: "/services/bridal" },
    ],
  },
  { id: 5, single_link: true, title: "Portfolio", link: "/portfolio" },
  {
    id: 6,
    sub_menu: true,
    title: "More",
    link: "/about",
    sub_menus: [
      { title: "About Us", link: "/about" },
      { title: "Contact Us", link: "/contact" },
      { title: "Blog", link: "/blog" },
      { title: "FAQ", link: "/faq" },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // FIX: Explicitly type this state to hold a number or null
  const [activeMobileMenu, setActiveMobileMenu] = useState<number | null>(null);
  
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Gold theme color
  const goldColor = "#C9A84C";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveMobileMenu(null);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  // FIX: Assign the 'number' type to the 'id' parameter
  const toggleMobileMenu = (id: number) => {
    setActiveMobileMenu(activeMobileMenu === id ? null : id);
  };

  return (
    <>
      <style>{`
        :root {
          --gold: ${goldColor};
        }
        
        .nav-links { display: none; }
        .nav-cta { display: none; }
        .nav-hamburger { display: flex; }
        
        @media(min-width: 992px) {
          .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; margin: 0; padding: 0; height: 100%; }
          .nav-cta { display: flex; }
          .nav-hamburger { display: none; }
        }

        /* --- Desktop Menu Styling --- */
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          height: 72px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          transition: color 0.3s ease;
          text-decoration: none;
        }

        .nav-link:hover {
          color: var(--gold) !important;
        }

        /* --- Desktop Mega Menu --- */
        .mega-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background-color: white;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          border-top: 3px solid var(--gold);
          padding: 2.5rem;
          display: flex;
          gap: 3rem;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 100;
          min-width: 800px;
        }

        .nav-item:hover .mega-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .mega-menu-column {
          flex: 1;
        }

        .mega-menu-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .mega-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mega-menu-item a {
          font-size: 0.85rem;
          color: #555;
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }

        .mega-menu-item a:hover {
          color: var(--gold);
          padding-left: 5px;
        }

        /* --- Mobile Menu --- */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px;
          left: 0;
          width: 100%;
          height: calc(100vh - 72px);
          overflow-y: auto;
          background-color: white;
          z-index: 40;
        }
        .mobile-menu.open {
          display: block;
        }
        
        .mobile-link-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f0ebe3;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #111;
          background: none;
          width: 100%;
          border-left: none; border-right: none; border-top: none;
          cursor: pointer;
        }

        .mobile-link-header:hover {
          color: var(--gold);
        }

        .mobile-sub-menu {
          background-color: #faf9f7;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-sub-menu-inner {
          padding: 0.5rem 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .mobile-sub-link {
          padding: 0.75rem 0;
          font-size: 0.85rem;
          color: #555;
          text-decoration: none;
          border-bottom: 1px solid #f0ebe3;
        }

        .mobile-sub-link:last-child {
          border-bottom: none;
        }

        .mobile-sub-link:hover {
          color: var(--gold);
        }

        @media(max-width: 767px) {
          .nav-logo { height: 45px !important; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          backgroundColor: isTransparent ? "transparent" : "white",
          borderBottom: isTransparent ? "none" : "1px solid #f0ebe3",
        }}
      >
        <nav
          className="container-custom"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
            padding: "0 5%",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/tolani-logo.png"
              alt="Norex Fashion"
              className="nav-logo"
              style={{
                height: isTransparent ? "70px" : "55px",
                width: "auto",
                objectFit: "contain",
                transition: "all 0.3s",
                filter: isTransparent ? "brightness(0) invert(1)" : "none",
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
                    {(item.products || item.homes) && <ChevronDown size={14} style={{ marginLeft: "2px" }} />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {item.products && item.product_pages && (
                    <div className="mega-menu">
                      {item.product_pages.map((col, idx) => (
                        <div key={idx} className="mega-menu-column">
                          <div className="mega-menu-title">{col.title}</div>
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

                  {/* Small dropdown for Homes (if desired) */}
                  {item.homes && item.home_pages && (
                    <div className="mega-menu" style={{ minWidth: "250px", padding: "1.5rem", left: "0", transform: "translateX(0) translateY(10px)" }}>
                      <div className="mega-menu-column">
                        <ul className="mega-menu-list">
                          {item.home_pages.map((homeItem, i) => (
                            <li key={i} className="mega-menu-item">
                              <Link href={homeItem.link}>{homeItem.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="nav-cta">
            <Link
              href="/academy/apply"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "0.75rem 1.75rem",
                backgroundColor: isTransparent ? "white" : goldColor,
                color: isTransparent ? goldColor : "white",
                transition: "all 0.3s",
                textDecoration: "none",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                if (!isTransparent) e.currentTarget.style.backgroundColor = "#B49542";
              }}
              onMouseLeave={(e) => {
                if (!isTransparent) e.currentTarget.style.backgroundColor = goldColor;
              }}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav-hamburger"
            style={{
              color: isTransparent ? "white" : "#1a1a1a",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: "2rem" }}>
            {mobile_menu.map((item) => {
              const isSubMenuOpen = activeMobileMenu === item.id;
              
              if (item.sub_menu || item.homes) {
                return (
                  <div key={item.id}>
                    <button 
                      className="mobile-link-header"
                      onClick={() => toggleMobileMenu(item.id)}
                      style={{ color: isSubMenuOpen ? goldColor : "#111" }}
                    >
                      {item.title}
                      <ChevronDown size={18} style={{ 
                        transform: isSubMenuOpen ? "rotate(180deg)" : "rotate(0)", 
                        transition: "transform 0.3s" 
                      }} />
                    </button>
                    
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
                  className="mobile-link-header"
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: "none", color: pathname === item.link ? goldColor : "#111" }}
                >
                  {item.title}
                </Link>
              );
            })}

            <div style={{ padding: "2rem 1.5rem" }}>
              <Link
                href="/academy/apply"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: goldColor,
                  color: "white",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderRadius: "2px"
                }}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}