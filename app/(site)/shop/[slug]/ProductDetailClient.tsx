"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { ShoppingBag, Heart, MessageCircle, Minus, Plus, Star } from "lucide-react";

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 'description', 'info', 'reviews'

  const msg = `Hi I am interested in ordering the ${product.name} (${formatPrice(product.price)}). Please provide more details.`;
  const whatsappLink = generateWhatsAppLink("+2349043371380", msg);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{`
        .pdg { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        @media(min-width: 1024px) { .pdg { grid-template-columns: 1fr 1.2fr; } }

        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }

        .sz { border: 1px solid #e5e7eb; padding: 0.6rem 1.25rem; font-size: 0.8rem; cursor: pointer; transition: all 0.3s ease; background: white; font-family: inherit; border-radius: 2px; font-weight: 500; color: #4b5563; }
        .sz:hover { border-color: #C9A84C; color: #C9A84C; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15); }

        .image-wrapper { position: relative; aspect-ratio: 3/4; overflow: hidden; background-color: #F0EBE3; border-radius: 2px; }
        
        /* Buttons */
        .btn-whatsapp { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #25D366; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; width: 100%; transition: all 0.3s ease; border-radius: 2px; border: none; cursor: pointer; }
        .btn-whatsapp:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }

        .btn-gold-solid { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #C9A84C; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C; cursor: pointer; width: 100%; }
        .btn-gold-solid:hover { background-color: #B49542; border-color: #B49542; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4); }

        .btn-wishlist { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: white; color: #C9A84C; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C; cursor: pointer; width: 100%; }
        .btn-wishlist:hover { background-color: #FAF7F4; transform: translateY(-2px); }

        /* Quantity Selector */
        .qty-wrapper { display: inline-flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 2px; }
        .qty-btn { background: white; border: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1a1a1a; transition: all 0.2s; }
        .qty-btn:hover { color: #C9A84C; background: #FAF7F4; }
        .qty-input { width: 50px; height: 40px; text-align: center; border: none; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-size: 0.95rem; font-weight: 600; outline: none; background: white; color: #1a1a1a; }

        /* Tabs */
        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; cursor: pointer; transition: all 0.3s; }
        .tab-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .tab-btn:hover:not(.active) { color: #1a1a1a; }

        /* Related Products Grid */
        .pg { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width:640px){ .pg { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:1024px){ .pg { grid-template-columns: repeat(3,1fr); } }
        .pc { display: block; text-decoration: none; }
        .pc-img { transition: transform 0.7s ease; }
        .pc:hover .pc-img { transform: scale(1.05); }
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

      {/* Main Product Area */}
      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="pdg">
          
          {/* Product Image */}
          <div className="image-wrapper">
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width:1024px) 100vw,50vw" priority />
          </div>

          {/* Product Details Sidebar */}
          <div style={{ position: "sticky", top: "6rem", alignSelf: "flex-start" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>
              {product.category}
            </p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", marginBottom: "1.5rem" }}>{formatPrice(product.price)}</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            
            <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>
            
            {/* Sizes & Colors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Sizes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.sizes.map((size: string) => (<button key={size} className="sz">{size}</button>))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Colors</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.colors.map((color: string) => (<button key={color} className="sz">{color}</button>))}
                </div>
              </div>
            </div>
            
            {/* Actions: Qty, Cart, Wishlist, WhatsApp */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="qty-wrapper">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16}/></button>
                  <input type="text" value={quantity} readOnly className="qty-input" />
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={16}/></button>
                </div>
                
                <button onClick={handleAddToCart} className="btn-gold-solid">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <button onClick={() => toggleWishlist(product)} className="btn-wishlist">
                  <Heart size={18} fill={isInWishlist(product.id) ? "#C9A84C" : "transparent"} /> 
                  {isInWishlist(product.id) ? "Saved" : "Wishlist"}
                </button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>

            </div>

            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            
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

      {/* TABS SECTION: Description, Info, Reviews */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", borderBottom: "1px solid #f0ebe3" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #e5e7eb", gap: "1rem", flexWrap: "wrap" }}>
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Information</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.reviews?.length || 0})</button>
          </div>

          <div style={{ padding: "4rem 0", maxWidth: "800px", margin: "0 auto" }}>
            
            {/* Tab: Description */}
            {activeTab === 'description' && (
              <div style={{ animation: "fadeIn 0.5s" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "1rem" }}>Product Description</h3>
                <p style={{ color: "#4b5563", lineHeight: 1.8 }}>{product.description}</p>
              </div>
            )}

            {/* Tab: Additional Information */}
            {activeTab === 'info' && (
              <div style={{ animation: "fadeIn 0.5s" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "1.5rem" }}>Additional Information</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {product.additionalInfo ? product.additionalInfo.map((info: any, i: number) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "1rem", fontWeight: 600, color: "#1a1a1a", width: "30%" }}>{info.label}</td>
                        <td style={{ padding: "1rem", color: "#4b5563" }}>{info.value}</td>
                      </tr>
                    )) : (
                      <tr><td style={{ padding: "1rem", color: "#6b7280" }}>No additional information available for this product.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div style={{ animation: "fadeIn 0.5s" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "2rem" }}>Customer Reviews</h3>
                
                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
                    {product.reviews.map((rev: any, i: number) => (
                      <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", flexShrink: 0 }}>
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={14} fill={star <= rev.rating ? "#C9A84C" : "transparent"} color={star <= rev.rating ? "#C9A84C" : "#e5e7eb"} />
                            ))}
                          </div>
                          <h4 style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "1rem", marginBottom: "0.25rem" }}>{rev.user}</h4>
                          <span style={{ fontSize: "0.75rem", color: "#9ca3af", display: "block", marginBottom: "0.75rem" }}>{rev.date}</span>
                          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.6 }}>{rev.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", marginBottom: "3rem" }}>There are no reviews yet. Be the first to review!</p>
                )}

                {/* Placeholder Review Form (For MongoDB later) */}
                <div style={{ backgroundColor: "white", padding: "2rem", border: "1px solid #f0ebe3" }}>
                  <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", color: "#1a1a1a", marginBottom: "1.5rem" }}>Add a Review</h4>
                  <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 500 }}>Your Rating:</span>
                      <div style={{ display: "flex", gap: "0.25rem", cursor: "pointer" }}>
                        {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} color="#C9A84C" />)}
                      </div>
                    </div>
                    <textarea placeholder="Write your review here..." rows={4} style={{ width: "100%", padding: "1rem", border: "1px solid #e5e7eb", outline: "none", fontFamily: "inherit", resize: "none" }} />
                    <button type="submit" style={{ alignSelf: "flex-start", backgroundColor: "#1a1a1a", color: "white", padding: "0.875rem 2rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>Submit Review</button>
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>* Reviews functionality will be connected to database soon.</p>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div style={{ paddingTop: "5rem", paddingBottom: "6rem", backgroundColor: "white" }}>
          <div className="container-custom">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a" }}>Related Products</h2>
            </div>
            
            <div className="pg">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="pc">
                  <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#F0EBE3", aspectRatio: "3/4", marginBottom: "1.25rem", borderRadius: "2px" }}>
                    <Image src={p.images[0]} alt={p.name} fill className="pc-img" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem", transition: "color 0.3s" }} className="prod-name">{p.name}</h3>
                      <p style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500 }}>{p.category}</p>
                    </div>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "#C9A84C", marginLeft: "1rem" }}>{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}