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
      <style>{`
        .pdg { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        @media(min-width: 1024px) { .pdg { grid-template-columns: 1fr 1fr; } }

        /* --- Hover Highlights & Animations --- */

        .breadcrumb-link {
          font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none; transition: color 0.3s ease;
        }
        .breadcrumb-link:hover {
          color: #C9A84C;
        }

        .sz {
          border: 1px solid #e5e7eb; padding: 0.6rem 1.25rem; font-size: 0.8rem;
          cursor: pointer; transition: all 0.3s ease; background: white;
          font-family: inherit; border-radius: 2px; font-weight: 500; color: #4b5563;
        }
        .sz:hover {
          border-color: #C9A84C; color: #C9A84C;
          transform: translateY(-2px); box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15);
        }

        .image-wrapper {
          position: relative; aspect-ratio: 3/4; overflow: hidden;
          background-color: #F0EBE3; border-radius: 2px;
        }
        .product-image {
          object-fit: cover; transition: transform 0.6s ease;
        }
        .image-wrapper:hover .product-image {
          transform: scale(1.04);
        }

        /* Buttons */
        .btn-whatsapp {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background-color: #25D366; color: white; padding: 1rem 2rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; width: 100%;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-whatsapp:hover {
          background-color: #20b558;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        .btn-gold-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 0.875rem 2.5rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C;
        }
        .btn-gold-solid:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
        }
      `}</style>
      
      {/* Breadcrumbs */}
      <div style={{ paddingTop: "8rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <Link href="/shop" className="breadcrumb-link">Shop</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="pdg">
          
          {/* Product Image */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="image-wrapper">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="product-image"
                sizes="(max-width:1024px) 100vw,50vw" 
                priority 
              />
            </div>
          </div>

          {/* Product Details Sidebar */}
          <div style={{ position: "sticky", top: "6rem", alignSelf: "flex-start" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>
              {product.category}
            </p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", marginBottom: "1.5rem" }}>{formatPrice(product.price)}</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            
            <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>
            
            {/* Sizes */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Available Sizes</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {product.sizes.map((size) => (<button key={size} className="sz">{size}</button>))}
              </div>
            </div>
            
            {/* Colors */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Colors</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {product.colors.map((color) => (<button key={color} className="sz">{color}</button>))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ marginBottom: "1rem" }}>
              Order via WhatsApp
            </a>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginBottom: "2rem", fontWeight: 500 }}>You will be redirected to WhatsApp to complete your order</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            
            {/* Perks/Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Custom sizing available on request", "Delivery within Delta: 2-3 business days", "Nationwide delivery available"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C9A84C", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>Continue Shopping</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem" }}>Explore More Pieces</h2>
        <Link href="/shop" className="btn-gold-solid">View All Collection</Link>
      </div>
    </div>
  );
}