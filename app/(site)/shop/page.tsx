import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Shop | Norex Fashion",
  description: "Browse our premium ready-to-wear fashion collections.",
};

export default function ShopPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{".sg{display:grid;grid-template-columns:1fr;gap:2rem} @media(min-width:640px){.sg{grid-template-columns:repeat(2,1fr)}} @media(min-width:1024px){.sg{grid-template-columns:repeat(3,1fr)}} .sci{transition:transform 0.7s ease} .sc:hover .sci{transform:scale(1.05)} .sco{opacity:0;transition:opacity 0.3s} .sc:hover .sco{opacity:1} .sct{transition:color 0.2s} .sc:hover .sct{color:#722F37}"}</style>
      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Link href="/" style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#722F37", letterSpacing: "0.1em", textTransform: "uppercase" }}>Shop</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Our Collection</h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>Discover pieces crafted for the modern woman who values elegance, quality, and individuality.</p>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #f0ebe3", backgroundColor: "white" }}>
        <div className="container-custom" style={{ paddingTop: "1.25rem", paddingBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Showing <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{products.length}</span> pieces</p>
        </div>
      </div>
      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="sg">
          {products.map((product) => (
            <Link key={product.id} href={["/shop/", product.slug].join("")} className="sc" style={{ display: "block", textDecoration: "none" }}>
              <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#F0EBE3", aspectRatio: "3/4", marginBottom: "1.25rem" }}>
                <Image src={product.images[0]} alt={product.name} fill className="sci" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.875rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#722F37" }}>{product.category}</div>
                <div className="sco" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "2rem" }}>
                  <span style={{ color: "white", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.8)", padding: "0.6rem 1.75rem" }}>View Details</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.35rem" }}>{product.name}</h3>
                  <p style={{ fontSize: "0.78rem", color: "#9ca3af" }}>{product.colors.slice(0, 2).join(" · ")}</p>
                </div>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#722F37", flexShrink: 0, marginLeft: "1rem" }}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <p className="tag" style={{ marginBottom: "1rem", display: "block" }}>Custom Orders</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem" }}>Can't Find What You're Looking For?</h2>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem", lineHeight: 1.8 }}>We offer custom made-to-measure pieces. Reach out via WhatsApp to discuss your perfect outfit.</p>
        <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#25D366", color: "white", padding: "0.875rem 2.5rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Order via WhatsApp</a>
      </div>
    </div>
  );
}