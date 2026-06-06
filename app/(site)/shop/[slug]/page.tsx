import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/data/products";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const msg = ["Hi I am interested in ordering the ", product.name, " (", formatPrice(product.price), "). Please provide more details."].join("");
  const whatsappLink = generateWhatsAppLink("+2349043371380", msg);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{".sz{border:1px solid #e5e7eb;padding:0.5rem 1rem;font-size:0.8rem;cursor:pointer;transition:all 0.2s;background:white;font-family:inherit} .sz:hover{border-color:#722F37;color:#722F37} .pdg{display:grid;grid-template-columns:1fr;gap:4rem} @media(min-width:1024px){.pdg{grid-template-columns:1fr 1fr}}"}</style>
      <div style={{ paddingTop: "6rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/" style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <Link href="/shop" style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Shop</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#722F37", letterSpacing: "0.1em", textTransform: "uppercase" }}>{product.name}</span>
          </div>
        </div>
      </div>
      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="pdg">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#F0EBE3" }}>
              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width:1024px) 100vw,50vw" priority />
            </div>
          </div>
          <div style={{ position: "sticky", top: "6rem", alignSelf: "flex-start" }}>
            <p className="tag" style={{ marginBottom: "1rem", display: "block" }}>{product.category}</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#722F37", marginBottom: "1.5rem" }}>{formatPrice(product.price)}</p>
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Available Sizes</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {product.sizes.map((size) => (<button key={size} className="sz">{size}</button>))}
              </div>
            </div>
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Colors</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {product.colors.map((color) => (<button key={color} className="sz">{color}</button>))}
              </div>
            </div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", backgroundColor: "#25D366", color: "white", padding: "1rem 2rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", marginBottom: "1rem", width: "100%" }}>
              Order via WhatsApp
            </a>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginBottom: "2rem" }}>You will be redirected to WhatsApp to complete your order</p>
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Custom sizing available on request", "Delivery within Delta: 2-3 business days", "Nationwide delivery available"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#C9A84C", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }}>
        <p className="tag" style={{ marginBottom: "1rem", display: "block" }}>Continue Shopping</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem" }}>Explore More Pieces</h2>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#722F37", color: "white", padding: "0.875rem 2.5rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>View All Collection</Link>
      </div>
    </div>
  );
}