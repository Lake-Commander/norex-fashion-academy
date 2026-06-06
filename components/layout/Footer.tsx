import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/shop", label: "All Collections" },
    { href: "/shop?category=evening", label: "Evening Wear" },
    { href: "/shop?category=casual", label: "Casual Wear" },
    { href: "/shop?category=bridal", label: "Bridal" },
  ],
  academy: [
    { href: "/academy", label: "About Academy" },
    { href: "/academy/courses", label: "Our Courses" },
    { href: "/academy/apply", label: "Apply Now" },
  ],
};

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .footer-link:hover {
          color: #C9A84C !important;
          transform: translateX(5px);
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .social-icon:hover {
          transform: translateY(-4px);
          opacity: 1;
          filter: drop-shadow(0 4px 8px rgba(201, 168, 76, 0.3));
        }
      `}</style>

      <footer style={{ backgroundColor: "#1a1a1a", color: "white" }}>
        <div className="container-custom" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>

            {/* Brand */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <img src="/tolani-logo.png" alt="Norex Fashion" style={{ height: "60px", width: "auto", filter: "brightness(0) invert(1)" }} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Elegance redefined. Fashion and education in perfect harmony.
              </p>
              {/* Social Icons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                {/* Instagram */}
                <a href="https://www.instagram.com/norexdesigns/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#igGradient)">
                    <defs>
                      <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a href="https://www.tiktok.com/@fashionschool_inwarri1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/norexdesign/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", fontWeight: 500 }}>Shop</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.875rem", padding: 0 }}>
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link" style={{ fontSize: "0.875rem" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academy */}
            <div>
              <h3 style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", fontWeight: 500 }}>Academy</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.875rem", padding: 0 }}>
                {footerLinks.academy.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link" style={{ fontSize: "0.875rem" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", fontWeight: 500 }}>Contact</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem", padding: 0 }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                  <MapPin size={16} style={{ marginTop: "2px", flexShrink: 0, color: "#C9A84C" }} />
                  <span>Warri, Nigeria</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                  <Phone size={16} style={{ flexShrink: 0, color: "#C9A84C" }} />
                  <a href="tel:+2348000000000" className="footer-link">+234 800 000 0000</a>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                  <Mail size={16} style={{ flexShrink: 0, color: "#C9A84C" }} />
                  <a href="mailto:hello@norexfashion.com" className="footer-link">hello@norexfashion.com</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Norex Fashion. All rights reserved.
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
              Crafted with elegance in Warri, Nigeria
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}