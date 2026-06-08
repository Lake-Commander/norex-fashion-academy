import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
export default function FeaturedCollection() {
  const products = getFeaturedProducts().slice(0, 3);
  return (
    <section style={{ backgroundColor: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
      <style>{".pc-img { transition: transform 0.7s ease; } .pc:hover .pc-img { transform: scale(1.05); } .pc-ov { opacity: 0; transition: opacity 0.3s; } .pc:hover .pc-ov { opacity: 1; } .pg { display: grid; grid-template-columns: 1fr; gap: 2rem; } @media(min-width:640px){ .pg { grid-template-columns: repeat(2,1fr); } } @media(min-width:1024px){ .pg { grid-template-columns: repeat(3,1fr); } }"}</style>
      <div className="container-custom">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="tag" style={{ marginBottom: "0.75rem", display: "block" }}>New Arrivals</p>
            <h2 className="section-title">Featured Collection</h2>
          </div>
          <Link href="/shop" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 500, borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>View All</Link>
        </div>
        <div className="pg">
          {products.map((product, index) => (
            <Link key={product.id} href={["/shop/", product.slug].join("")} className="pc" style={{ display: "block", textDecoration: "none" }}>
              <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#F0EBE3", aspectRatio: "3/4" }}>
                <Image src={product.images[0]} alt={product.name} fill className="pc-img" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.3rem 0.75rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C9A84C" }}>{product.category}</div>
                <div className="pc-ov" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.15)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "1.5rem" }}>
                  <span style={{ color: "white", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid white", padding: "0.5rem 1.5rem" }}>View Details</span>
                </div>
              </div>
              <div style={{ paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.25rem" }}>{product.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{product.category}</p>
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#C9A84C", whiteSpace: "nowrap", marginLeft: "1rem" }}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}