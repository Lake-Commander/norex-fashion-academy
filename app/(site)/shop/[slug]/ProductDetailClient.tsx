"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { useTelemetry } from "@/hooks/useTelemetry"; 
import { ShoppingBag, Heart, MessageCircle, Minus, Plus, Star, Check } from "lucide-react";

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { trackProduct } = useTelemetry(); 
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  
  // ⚡ Active Main Display Image Array Index Node Pointer
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Local state for reviews so it updates instantly after submission
  const [reviews, setReviews] = useState(product.reviews || []);
  
  // Interactive Review State
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewText, setReviewText] = useState("");

  // Product Selection States for Variations
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default Matrix");
  const [selectedGender, setSelectedGender] = useState(product.gender === "Both" ? "Female" : product.gender);

  // Telemetry Effect: Synchronizes product views directly down to customer history arrays
  useEffect(() => {
    if (product?._id) {
      trackProduct(product._id);
    }
  }, [product?._id, trackProduct]);

  // Update reviews state when product prop changes
  useEffect(() => {
    if (product.reviews) {
      setReviews(product.reviews);
    }
  }, [product._id, product.reviews]);

  // WhatsApp Intent Trigger String Configuration
  const msg = `Hi Norex Atelier, I am interested in ordering the ${product.name} (${formatPrice(product.price)}).\n\nMy Configurations:\n- Size: ${selectedSize}\n- Color Swatch: ${selectedColor}\n- Fit Cut: ${selectedGender === "Both" ? "Unisex" : selectedGender}\n\nPlease verify availability.`;
  const whatsappLink = generateWhatsAppLink("+2349043371380", msg);

  // Normalization Adapter to guarantee absolute runtime alignment with global type constraints
  const getContextPayload = (targetProduct = product) => {
    return {
      ...targetProduct,
      id: targetProduct._id || targetProduct.id,
      featured: targetProduct.isFeatured || targetProduct.featured,
      selectedSize: targetProduct === product ? selectedSize : targetProduct.sizes?.[0] || "M",
      selectedColor: targetProduct === product ? selectedColor : targetProduct.colors?.[0] || "Default Matrix",
      selectedGender: targetProduct === product ? selectedGender : targetProduct.gender === "Both" ? "Female" : targetProduct.gender
    };
  };

  const handleAddToCart = () => {
    addToCart(getContextPayload(), quantity);
  };

  const handleWhatsAppOrderRedirect = async () => {
    try {
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ product: product._id, name: product.name, quantity, size: selectedSize, color: selectedColor, gender: selectedGender }],
          totalAmount: product.price * quantity,
          paymentGateway: "WhatsApp",
          paymentStatus: "Pending"
        })
      });
    } catch (err) {
      console.error("Manual order tracing failed:", err);
    }
    window.open(whatsappLink, "_blank");
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
          productId: product._id, 
          user: name,
          email,
          rating,
          comment: reviewText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Review submitted!");
        setReviews((prev: any) => [...prev, data.data]);
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
        .pdg { display: grid; grid-template-columns: 1fr; gap: 4rem; position: relative; }
        @media(min-width: 1024px) { .pdg { grid-template-columns: 1fr 1.2fr; } }

        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }

        .sz { border: 1px solid #e5e7eb; padding: 0.6rem 1.25rem; font-size: 0.8rem; cursor: pointer; transition: all 0.3s ease; background: white; font-family: inherit; border-radius: 2px; font-weight: 500; color: #4b5563; }
        .sz:hover { border-color: #C9A84C; color: #C9A84C; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15); }
        .sz.active { border-color: #1a1a1a; color: #1a1a1a; background-color: #FAF7F4; font-weight: 700; }

        .image-wrapper { position: relative; aspect-ratio: 3/4; overflow: hidden; background-color: #FAF7F4; border-radius: 2px; border: 1px solid #f0ebe3; }
        
        .look-spinning-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: rgba(26,26,26,0.75); border: 1px solid rgba(255,255,255,0.1);
          padding: 0.25rem 0.6rem; font-family: monospace; font-size: 8px; color: rgba(255,255,255,0.9);
          letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; border-radius: 2px;
          z-index: 20; pointer-events: none; backdrop-filter: blur(4px);
        }

        .image-roll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .roll-thumb-btn {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background-color: #FAF7F4;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .roll-thumb-btn:hover { border-color: #C9A84C; }
        .roll-thumb-btn.active { border-color: #1a1a1a; ring: 1px solid #1a1a1a; }

        .btn-whatsapp { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #25D366; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; width: 100%; transition: all 0.3s ease; border-radius: 2px; border: none; cursor: pointer; }
        .btn-whatsapp:hover { background-color: #20b558; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }

        .btn-gold-solid { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: #1a1a1a; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #1a1a1a; cursor: pointer; width: 100%; }
        .btn-gold-solid:hover { background-color: #C9A84C; border-color: #C9A84C; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.25); }

        .btn-wishlist { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background-color: white; color: #4b5563; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s ease; border-radius: 2px; border: 1px solid #e5e7eb; cursor: pointer; width: 100%; }
        .btn-wishlist:hover { border-color: #1a1a1a; color: #1a1a1a; transform: translateY(-2px); }

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
        
        .pc { display: block; text-decoration: none; position: relative; background: white; border: 1px solid #f4f4f5; padding: 0.75rem; border-radius: 1px; }
        .pc-img-frame { position: relative; overflow: hidden; aspect-ratio: 3/4; background-color: #FAF7F4; }
        .pc-img { transition: transform 0.7s ease; }
        .pc:hover .pc-img { transform: scale(1.03); }

        .pc-overlay { position: absolute; inset: 0; background-color: rgba(0,0,0,0.12); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.5rem; gap: 0.5rem; opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 10; }
        .pc:hover .pc-overlay { opacity: 1; pointer-events: auto; }
        
        .pc-action-btn { color: white; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.8); padding: 0.5rem 1rem; transition: all 0.2s; font-weight: 700; background: rgba(26,26,26,0.8); border-radius: 1px; display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; }
        .pc-action-btn:hover { background-color: #C9A84C; border-color: #C9A84C; }
        .pc-wishlist-trigger { position: absolute; top: 0.75rem; right: 0.75rem; background: white; border: 1px solid #f4f4f5; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; box-shadow: 0 4px 10px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .pc-wishlist-trigger:hover { transform: scale(1.08); }

        .form-input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #e5e7eb; border-radius: 2px; font-size: 0.9rem; color: #1a1a1a; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .form-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 1px #C9A84C; }
        .btn-submit { align-self: flex-start; background-color: #1a1a1a; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #1a1a1a; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; }
        .btn-submit:hover { background-color: #C9A84C; border-color: #C9A84C; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.3); }
      `}</style>
      
      {/* Breadcrumbs Row */}
      <div style={{ paddingTop: "8rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "flex-start" }}>
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
          
          {/* Left Media Stage */}
          <div>
            <div className="image-wrapper">
              <div className="look-spinning-badge">
                Look-{String(product.lookNumber || product.id || 1).padStart(2, "0")}
              </div>
              <Image 
                src={product.images?.[activeImageIndex] || "/placeholder-garment.png"} 
                alt={`${product.name} - View ${activeImageIndex + 1}`} 
                fill 
                style={{ objectFit: "cover" }} 
                sizes="(max-width:1024px) 100vw,50vw" 
                priority 
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-roll-grid">
                {product.images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`roll-thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
                  >
                    <Image 
                      src={imgUrl} 
                      alt={`${product.name} thumb ${idx + 1}`} 
                      fill 
                      style={{ objectFit: "cover" }} 
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Parameters Details Panel */}
          <div style={{ position: "sticky", top: "8rem", alignSelf: "flex-start", textAlign: "left" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>{product.category}</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", marginBottom: "1.5rem", fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>
            
            {product.gender === "Both" && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Specify Fit Profile</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Female", "Male"].map((genderOption) => (
                    <button key={genderOption} type="button" onClick={() => setSelectedGender(genderOption)} className={`sz ${selectedGender === genderOption ? "active" : ""}`}>
                      {genderOption === "Female" ? "Women's Fit Profile" : "Men's Fit Profile"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Sizes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.sizes?.map((size: string) => (
                    <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`sz ${selectedSize === size ? "active" : ""}`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.875rem" }}>Colors</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.colors?.map((color: string) => (
                    <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`sz ${selectedColor === color ? "active" : ""}`}>{color}</button>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="qty-wrapper">
                  <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16}/></button>
                  <input type="text" value={quantity} readOnly className="qty-input" />
                  <button type="button" className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={16}/></button>
                </div>
                <button type="button" onClick={handleAddToCart} className="btn-gold-solid">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <button type="button" onClick={() => toggleWishlist(getContextPayload())} className="btn-wishlist">
                  <Heart size={18} fill={isInWishlist(product._id) ? "#C9A84C" : "transparent"} color={isInWishlist(product._id) ? "#C9A84C" : "#4b5563"} /> 
                  {isInWishlist(product._id) ? "Saved in Registry" : "Wishlist"}
                </button>
                <button type="button" onClick={handleWhatsAppOrderRedirect} className="btn-whatsapp">
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications Tabs */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", borderBottom: "1px solid #f0ebe3" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #e5e7eb", gap: "1rem", flexWrap: "wrap" }}>
            <button type="button" className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button type="button" className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Info</button>
            <button type="button" className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
          </div>

          <div style={{ padding: "4rem 0", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
            {activeTab === 'description' && <div><h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.25rem", marginBottom: "1rem" }} className="font-bold uppercase">Description</h3><p style={{ color: "#4b5563" }} className="text-sm font-light leading-relaxed">{product.description}</p></div>}
            
            {activeTab === 'info' && (
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.25rem", marginBottom: "1.5rem" }} className="font-bold uppercase">Additional Info</h3>
                <table style={{ width: "100%", fontSize: "0.85rem" }} className="divide-y divide-zinc-200">
                  <tbody>
                    {product.additionalInfo?.map((i: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{ padding: "0.6rem 0.5rem", fontWeight: 700 }} className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{i.label}</td>
                        <td style={{ padding: "0.6rem 0.5rem" }} className="text-zinc-600 font-light">{i.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.25rem", marginBottom: "2rem" }} className="font-bold uppercase">Customer Reviews</h3>
                
                {reviews.length === 0 ? (
                  <p className="text-zinc-400 font-mono text-xs uppercase py-4">No validation critiques left for this piece yet.</p>
                ) : (
                  reviews.map((rev: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }} className="border-b border-zinc-100 pb-3">
                      <div style={{ width: "40px", height: "40px", backgroundColor: "#1a1a1a", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{rev.user?.[0] || "U"}</div>
                      <div>
                        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={13} fill={s <= rev.rating ? "#C9A84C" : "transparent"} color={s <= rev.rating ? "#C9A84C" : "#e5e7eb"} />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{rev.user}</p>
                        <p style={{ color: "#4b5563" }} className="text-xs mt-1 font-light">{rev.comment}</p>
                      </div>
                    </div>
                  ))
                )}
                
                <div style={{ marginTop: "3rem", padding: "2.5rem", border: "1px solid #f0ebe3", backgroundColor: "white" }}>
                  <h4 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.15rem", marginBottom: "1.5rem" }} className="font-bold uppercase">Add a Review</h4>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={18} cursor="pointer" 
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
      
      {/* RELATED PRODUCTS GRID */}
      {relatedProducts.length > 0 && (
        <div style={{ paddingTop: "5rem", paddingBottom: "6rem", backgroundColor: "white" }}>
          <div className="container-custom">
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" }}>Related Products</h2>
            </div>
            <div className="pg">
              {relatedProducts.map((p) => {
                const isWished = isInWishlist(p._id || p.id);
                return (
                  <div key={p._id || p.id} className="pc">
                    <div className="pc-img-frame">
                      <div className="look-spinning-badge">
                        Look-{String(p.lookNumber || p.id || 1).padStart(2, "0")}
                      </div>
                      <Image src={p.images?.[0] || "/placeholder-garment.png"} alt={p.name} fill className="pc-img" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                      
                      <div className="pc-overlay">
                        <button type="button" className="pc-action-btn" onClick={() => addToCart(getContextPayload(p), 1)}>
                          <ShoppingBag size={12} /> Add
                        </button>
                        <Link href={`/shop/${p.slug}`} className="pc-action-btn" style={{ textDecoration: "none" }}>
                          View Details
                        </Link>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => toggleWishlist(getContextPayload(p))}
                        className="pc-wishlist-trigger"
                        title={isWished ? "Remove from registry" : "Save to registry"}
                      >
                        <Heart size={14} color="#C9A84C" fill={isWished ? "#C9A84C" : "transparent"} />
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "1rem" }}>
                      <div style={{ textAlign: "left" }}>
                        <Link href={`/shop/${p.slug}`} style={{ textDecoration: "none" }}>
                          <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>{p.name}</h3>
                        </Link>
                        <p style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500 }}>{p.category}</p>
                      </div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, color: "#C9A84C", marginLeft: "1rem", fontFamily: "monospace" }}>{formatPrice(p.price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}