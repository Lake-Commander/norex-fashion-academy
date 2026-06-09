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
  const [activeTab, setActiveTab] = useState("description");
  
  // Local state for reviews so it updates instantly after submission
  const [reviews, setReviews] = useState(product.reviews || []);
  
  // Interactive Review State
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewText, setReviewText] = useState(""); // Renamed from 'review' to 'reviewText' to avoid confusion

  const msg = `Hi I am interested in ordering the ${product.name} (${formatPrice(product.price)}). Please provide more details.`;
  const whatsappLink = generateWhatsAppLink("+2349043371380", msg);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          user: name,
          email,
          rating,
          comment: reviewText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Review submitted!");

        // Instantly append the new review from the database to the screen
        setReviews((prev: any) => [...prev, data.data]);

        // Reset the form
        setName("");
        setEmail("");
        setReviewText("");
        setRating(0);
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
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
        
        .btn-whatsapp { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #25D366; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; width: 100%; transition: all 0.3s ease; border-radius: 2px; border: none; cursor: pointer; }
        .btn-whatsapp:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }

        .btn-gold-solid { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #C9A84C; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C; cursor: pointer; width: 100%; }
        .btn-gold-solid:hover { background-color: #B49542; border-color: #B49542; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4); }

        .btn-wishlist { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: white; color: #C9A84C; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C; cursor: pointer; width: 100%; }
        .btn-wishlist:hover { background-color: #FAF7F4; transform: translateY(-2px); }

        .qty-wrapper { display: inline-flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 2px; }
        .qty-btn { background: white; border: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1a1a1a; transition: all 0.2s; }
        .qty-btn:hover { color: #C9A84C; background: #FAF7F4; }
        .qty-input { width: 50px; height: 40px; text-align: center; border: none; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-size: 0.95rem; font-weight: 600; outline: none; background: white; color: #1a1a1a; }

        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; cursor: pointer; transition: all 0.3s; }
        .tab-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .tab-btn:hover:not(.active) { color: #1a1a1a; }

        .pg { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width:640px){ .pg { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:1024px){ .pg { grid-template-columns: repeat(3,1fr); } }
        .pc { display: block; text-decoration: none; }
        .pc-img { transition: transform 0.7s ease; }
        .pc:hover .pc-img { transform: scale(1.05); }

        .form-input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #e5e7eb; border-radius: 2px; font-size: 0.9rem; color: #1a1a1a; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .form-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 1px #C9A84C; }
        
        .btn-submit { align-self: flex-start; background-color: #1a1a1a; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #1a1a1a; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; }
        .btn-submit:hover { background-color: #C9A84C; border-color: #C9A84C; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.3); }
      `}</style>
      
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

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="pdg">
          <div className="image-wrapper">
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width:1024px) 100vw,50vw" priority />
          </div>

          <div style={{ position: "sticky", top: "6rem", alignSelf: "flex-start" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>{product.category}</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", marginBottom: "1.5rem" }}>{formatPrice(product.price)}</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>
            
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
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", borderBottom: "1px solid #f0ebe3" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #e5e7eb", gap: "1rem", flexWrap: "wrap" }}>
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Info</button>
            
            {/* UPDATED TO USE REVIEWS STATE LENGTH */}
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
          </div>

          <div style={{ padding: "4rem 0", maxWidth: "800px", margin: "0 auto" }}>
            {activeTab === 'description' && <div><h3 style={{ fontFamily: "var(--font-playfair)", marginBottom: "1rem" }}>Description</h3><p style={{ color: "#4b5563" }}>{product.description}</p></div>}
            
            {activeTab === 'info' && (
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair)", marginBottom: "1.5rem" }}>Additional Info</h3>
                <table style={{ width: "100%" }}><tbody>{product.additionalInfo?.map((i: any, idx: number) => <tr key={idx}><td style={{ padding: "0.5rem", fontWeight: 600 }}>{i.label}</td><td>{i.value}</td></tr>)}</tbody></table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair)", marginBottom: "2rem" }}>Customer Reviews</h3>
                
                {/* UPDATED TO MAP OVER REVIEWS STATE */}
                {reviews.map((rev: any, i: number) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", backgroundColor: "#C9A84C", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{rev.user[0]}</div>
                    <div>
                      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= rev.rating ? "#C9A84C" : "transparent"} color={s <= rev.rating ? "#C9A84C" : "#e5e7eb"} />
                        ))}
                      </div>
                      <p><strong>{rev.user}</strong></p>
                      <p style={{ color: "#4b5563" }}>{rev.comment}</p>
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: "3rem", padding: "2.5rem", border: "1px solid #f0ebe3", backgroundColor: "white" }}>
                  <h4 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.25rem", marginBottom: "1.5rem" }}>Add a Review</h4>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={20} cursor="pointer" 
                          onClick={() => setRating(s)} 
                          fill={(hoveredStar || rating) >= s ? "#C9A84C" : "transparent"} 
                          color={(hoveredStar || rating) >= s ? "#C9A84C" : "#d1d5db"} 
                          onMouseEnter={() => setHoveredStar(s)} 
                          onMouseLeave={() => setHoveredStar(0)} 
                        />
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <input value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder="Name" className="form-input" required />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Email" className="form-input" required />
                    </div>
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} name="review" placeholder="Your review..." rows={3} className="form-input" required />
                    <button type="submit" className="btn-submit">Submit Review</button>
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