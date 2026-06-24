"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { useTelemetry } from "@/hooks/useTelemetry"; 
import { ShoppingBag, Heart, MessageCircle, Minus, Plus, Star } from "lucide-react";

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { trackProduct } = useTelemetry(); 
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  
  // ⚡ Active Main Display Image Array Index Node Pointer
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Single unified reviews state tracker declaration
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
    const isMainProduct = targetProduct._id === product._id || targetProduct.id === product.id;
    return {
      ...targetProduct,
      id: targetProduct._id || targetProduct.id,
      featured: targetProduct.isFeatured || targetProduct.featured,
      selectedSize: isMainProduct ? selectedSize : targetProduct.sizes?.[0] || "M",
      selectedColor: isMainProduct ? selectedColor : targetProduct.colors?.[0] || "Default Matrix",
      selectedGender: isMainProduct ? selectedGender : targetProduct.gender === "Both" ? "Female" : targetProduct.gender
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

  const goldColor = "#C9A84C";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", width: "100%", overflowX: "hidden" }}>
      <style>{`
        .pdg { display: grid; grid-template-columns: 1fr; gap: 2.5rem; position: relative; width: 100%; box-sizing: border-box; }
        @media(min-width: 1024px) { .pdg { grid-template-columns: 1fr 1.2fr; gap: 4rem; } }

        .breadcrumb-link { font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .breadcrumb-link:hover { color: #C9A84C; }

        .sz { border: 1px solid #e5e7eb; padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; transition: all 0.3s ease; background: white; font-family: inherit; border-radius: 2px; font-weight: 500; color: #4b5563; }
        .sz:hover { border-color: #C9A84C; color: #C9A84C; }
        .sz.active { border-color: #1a1a1a; color: #1a1a1a; background-color: #FAF7F4; font-weight: 700; }

        .image-wrapper { position: relative; aspect-ratio: 3/4; overflow: hidden; background-color: #FAF7F4; border-radius: 2px; border: 1px solid #f0ebe3; width: 100%; }
        
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
          gap: 0.5rem;
          margin-top: 0.75rem;
          width: 100%;
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
          width: 100%;
        }
        .roll-thumb-btn:hover { border-color: #C9A84C; }
        .roll-thumb-btn.active { border-color: #1a1a1a; }

        /* Unified responsive action button blocks */
        .btn-whatsapp, .btn-gold-solid, .btn-wishlist {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem; 
          padding: 1rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; 
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease; 
          border-radius: 2px; cursor: pointer; width: 100%; box-sizing: border-box;
        }
        .btn-whatsapp { background-color: #25D366; color: white; border: none; }
        .btn-whatsapp:hover { background-color: #20b558; }
        .btn-gold-solid { background-color: #1a1a1a; color: white; border: 1px solid #1a1a1a; }
        .btn-gold-solid:hover { background-color: #C9A84C; border-color: #C9A84C; }
        .btn-wishlist { background-color: white; color: #4b5563; border: 1px solid #e5e7eb; }
        .btn-wishlist:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .qty-container-row { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
        @media (min-width: 480px) { .qty-container-row { flex-direction: row; } }

        .qty-wrapper { display: inline-flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 2px; width: 100%; justify-content: space-between; }
        @media (min-width: 480px) { .qty-wrapper { width: auto; justify-content: flex-start; } }
        
        .qty-btn { background: white; border: none; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1a1a1a; transition: all 0.2s; }
        .qty-btn:hover { color: #C9A84C; background: #FAF7F4; }
        .qty-input { width: 50px; height: 45px; text-align: center; border: none; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-size: 0.95rem; font-weight: 600; outline: none; background: white; color: #1a1a1a; }

        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #9ca3af; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
        .tab-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }

        /* Handle responsive tab alignment */
        .tabs-nav-bar { display: flex; justify-content: flex-start; border-bottom: 1px solid #e5e7eb; gap: 0.5rem; overflow-x: auto; WebkitOverflowScrolling: touch; padding-left: 1.5rem; }
        @media (min-width: 640px) { .tabs-nav-bar { justify-content: center; padding-left: 0; } }

        /* Handle responsive button splitting layout */
        .action-split-row { display: flex; gap: 1rem; flex-direction: column; width: 100%; }
        @media (min-width: 640px) { .action-split-row { flex-direction: row; } }

        .pg { display: grid; grid-template-columns: 1fr; gap: 1.5rem; width: 100%; box-sizing: border-box; }
        @media(min-width:640px){ .pg { grid-template-columns: repeat(2,1fr); gap: 2rem; } }
        @media(min-width:1024px){ .pg { grid-template-columns: repeat(3,1fr); } }
        
        .pc { display: block; text-decoration: none; position: relative; background: white; border: 1px solid #f4f4f5; padding: 0.5rem; border-radius: 1px; width: 100%; box-sizing: border-box; }
        .pc-img-frame { position: relative; overflow: hidden; aspect-ratio: 3/4; background-color: #FAF7F4; width: 100%; }
        .pc-img { transition: transform 0.7s ease; }
        .pc:hover .pc-img { transform: scale(1.03); }

        .form-input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #e5e7eb; border-radius: 2px; font-size: 0.9rem; color: #1a1a1a; outline: none; transition: border-color 0.2s; font-family: inherit; box-sizing: border-box; }
        .form-input:focus { border-color: #C9A84C; }
        .btn-submit { background-color: #1a1a1a; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #1a1a1a; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; width: 100%; sm:width: auto; }
        .btn-submit:hover { background-color: #C9A84C; border-color: #C9A84C; }
        
        .variation-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        @media (min-width: 560px) { .variation-row { grid-template-columns: 1fr 1fr; gap: 2rem; } }
      `}</style>
      
      {/* Breadcrumbs Row */}
      <div style={{ paddingTop: "8rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0ebe3", backgroundColor: "#FAF7F4", width: "100%" }}>
        <div className="container-custom" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db", fontSize: "0.7rem" }}>/</span>
            <Link href="/shop" className="breadcrumb-link">Shop</Link>
            <span style={{ color: "#d1d5db", fontSize: "0.7rem" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, display: "inline-block", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "3rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div className="pdg">
          
          {/* Left Media Stage */}
          <div style={{ width: "100%" }}>
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
          <div style={{ textAlign: "left", width: "100%" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "0.75rem" }}>{product.category}</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1rem" }}>{product.name}</h1>
            <p style={{ fontSize: "1.5rem", fontWeight: 400, color: "#C9A84C", marginBottom: "1.5rem", fontFamily: "monospace" }}>{formatPrice(product.price)}</p>
            
            <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.8, marginBottom: "2rem" }}>{product.description}</p>
            
            {product.gender === "Both" && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.75rem" }}>Specify Fit Profile</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["Female", "Male"].map((genderOption) => (
                    <button key={genderOption} type="button" onClick={() => setSelectedGender(genderOption)} className={`sz ${selectedGender === genderOption ? "active" : ""}`} style={{ flex: "1 1 auto", textAlign: "center" }}>
                      {genderOption === "Female" ? "Women's Fit" : "Men's Fit"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="variation-row">
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.75rem" }}>Sizes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.sizes?.map((size: string) => (
                    <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`sz ${selectedSize === size ? "active" : ""}`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.75rem" }}>Colors</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.colors?.map((color: string) => (
                    <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`sz ${selectedColor === color ? "active" : ""}`}>{color}</button>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", width: "100%" }}>
              <div className="qty-container-row">
                <div className="qty-wrapper">
                  <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14}/></button>
                  <input type="text" value={quantity} readOnly className="qty-input" />
                  <button type="button" className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={14}/></button>
                </div>
                <button type="button" onClick={handleAddToCart} className="btn-gold-solid">
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>

              <div className="action-split-row">
                <button type="button" onClick={() => toggleWishlist(getContextPayload())} className="btn-wishlist">
                  <Heart size={16} fill={isInWishlist(product._id) ? "#C9A84C" : "transparent"} color={isInWishlist(product._id) ? "#C9A84C" : "#4b5563"} /> 
                  {isInWishlist(product._id) ? "Saved in Registry" : "Wishlist"}
                </button>
                <button type="button" onClick={handleWhatsAppOrderRedirect} className="btn-whatsapp">
                  <MessageCircle size={16} /> WhatsApp Order
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications Tabs */}
      <div style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", borderBottom: "1px solid #f0ebe3", width: "100%" }}>
        <div className="container-custom" style={{ paddingLeft: "0rem", paddingRight: "0rem" }}>
          <div className="tabs-nav-bar scrollbar-hide">
            <button type="button" className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button type="button" className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Info</button>
            <button type="button" className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
          </div>

          <div style={{ padding: "3rem 1.5rem", maxWidth: "800px", margin: "0 auto", textAlign: "left", boxSizing: "border-box" }}>
            {activeTab === 'description' && <div><h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.1rem", marginBottom: "1rem" }} className="font-bold uppercase">Description</h3><p style={{ color: "#4b5563", lineHeight: 1.7 }} className="text-sm font-light">{product.description}</p></div>}
            
            {activeTab === 'info' && (
              <div style={{ width: "100%", overflowX: "hidden" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.1rem", marginBottom: "1.5rem" }} className="font-bold uppercase">Additional Info</h3>
                <table style={{ width: "100%", fontSize: "0.85rem" }} className="divide-y divide-zinc-200">
                  <tbody>
                    {product.additionalInfo?.map((i: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{ padding: "0.6rem 0.5rem 0.6rem 0", fontWeight: 700, width: "35%" }} className="font-mono text-[9px] tracking-wide text-zinc-400 uppercase">{i.label}</td>
                        <td style={{ padding: "0.6rem 0" }} className="text-zinc-600 font-light">{i.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ width: "100%" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.1rem", marginBottom: "2rem" }} className="font-bold uppercase">Customer Reviews</h3>
                
                {reviews.length === 0 ? (
                  <p className="text-zinc-400 font-mono text-xs uppercase py-2">No validation critiques left for this piece yet.</p>
                ) : (
                  reviews.map((rev: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }} className="border-b border-zinc-100 pb-4">
                      <div style={{ width: "36px", height: "36px", backgroundColor: "#1a1a1a", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", flexShrink: 0 }}>{rev.user?.[0] || "U"}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", gap: "0.15rem", marginBottom: "0.25rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={11} fill={s <= rev.rating ? "#C9A84C" : "transparent"} color={s <= rev.rating ? "#C9A84C" : "#e5e7eb"} />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{rev.user}</p>
                        <p style={{ color: "#4b5563", lineHeight: 1.6 }} className="text-xs mt-1 font-light break-words">{rev.comment}</p>
                      </div>
                    </div>
                  ))
                )}
                
                <div style={{ marginTop: "2.5rem", padding: "1.5rem", border: "1px solid #f0ebe3", backgroundColor: "white", boxSizing: "border-box" }}>
                  <h4 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", marginBottom: "1.25rem" }} className="font-bold uppercase">Add a Review</h4>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        <div style={{ paddingTop: "4rem", paddingBottom: "5rem", backgroundColor: "white", width: "100%" }}>
          <div className="container-custom" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
            <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" }}>Related Products</h2>
            </div>
            <div className="pg">
              {relatedProducts.map((p) => {
                const isWished = isInWishlist(p._id || p.id);
                return (
                  <div key={p._id || p.id} className="pc" style={{ display: "flex", flexDirection: "column" }}>
                    <div className="pc-img-frame">
                      <div className="look-spinning-badge">
                        Look-{String(p.lookNumber || p.id || 1).padStart(2, "0")}
                      </div>
                      <Link href={`/shop/${p.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                        <Image src={p.images?.[0] || "/placeholder-garment.png"} alt={p.name} fill className="pc-img" style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                      </Link>
                    </div>

                    {/* Typography Breakdown Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "1rem", gap: "0.5rem" }}>
                      <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                        <Link href={`/shop/${p.slug}`} style={{ textDecoration: "none" }}>
                          <h3 className="sct" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</h3>
                        </Link>
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>{p.category}</p>
                      </div>
                      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#C9A84C", flexShrink: 0, fontFamily: "monospace" }}>{formatPrice(p.price)}</p>
                    </div>

                    {/* Permanent Grid Action Tray */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
                      <button 
                        type="button" 
                        onClick={() => addToCart(getContextPayload(p), 1)}
                        style={{ backgroundColor: "#1a1a1a", color: "white", border: "none", padding: "0.75rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", borderRadius: "2px" }}
                      >
                        <ShoppingBag size={12} /> Add
                      </button>
                      <Link 
                        href={`/shop/${p.slug}`}
                        style={{ backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", padding: "0.75rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}
                      >
                        Details
                      </Link>
                    </div>

                    {/* Permanent Full-width Wishlist Action Button */}
                    <button 
                      type="button"
                      onClick={() => toggleWishlist(getContextPayload(p))}
                      style={{ width: "100%", marginTop: "0.5rem", padding: "0.6rem", background: "#FAF7F4", border: "1px solid #f0ebe3", color: isWished ? "#C9A84C" : "#6b7280", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", borderRadius: "2px", cursor: "pointer" }}
                    >
                      <Heart size={12} fill={isWished ? "#C9A84C" : "transparent"} color="#C9A84C" />
                      <span>{isWished ? "In Registry" : "Save to Registry"}</span>
                    </button>
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