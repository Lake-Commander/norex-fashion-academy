"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Loader2, MessageSquare, Trash2, ExternalLink, Calendar } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ⚡ Load all reviews alongside populated product metadata fields
  useEffect(() => {
    async function fetchAllReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.data || []);
        }
      } catch (err) {
        console.error("Critical error parsing master review matrices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllReviews();
  }, []);

  // 🗑️ Administrative Review Deletion Intercept Trigger Handler
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you absolutely sure you want to drop this customer feedback row permanently?")) return;
    
    setDeletingId(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        alert("Review cleared from live indices.");
      } else {
        alert(data.error || "Failed dropping target entry node loop.");
      }
    } catch (err) {
      console.error(err);
      alert("Handshake validation intercept failed completely.");
    } finally {
      setDeletingId(null);
    }
  };

  const goldColor = "#C9A84C";

  return (
    <div style={{ padding: "2rem", width: "100%", boxSizing: "border-box", minHeight: "100vh", backgroundColor: "#FCFAF7" }}>
      
      {/* Page Header Deck Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1.25rem" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.85rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Product Reviews</h1>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#9ca3af", marginTop: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Customer Critiques & Quality Validation Registers
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "white", border: "1px solid #e5e7eb", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600, fontFamily: "monospace", color: "#1a1a1a" }}>
          <MessageSquare size={14} color={goldColor} />
          <span>Total Records: {reviews.length}</span>
        </div>
      </div>

      {/* Core Dynamic Content Container Stage */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
          <Loader2 className="animate-spin" size={28} color={goldColor} />
          <p style={{ fontSize: "0.68rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>Synchronizing Feedback Registries...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "4rem 2rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <MessageSquare size={36} style={{ color: "#d1d5db", marginBottom: "1rem" }} />
          <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.2rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 0.5rem 0" }}>Ledger Clean</h3>
          <p style={{ color: "#71717a", fontSize: "0.85rem", maxWidth: "400px", margin: "0 auto" }}>No user validation critiques or star entries have been logged across the live digital storefront registry yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          {reviews.map((rev) => (
            <div 
              key={rev._id}
              style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.01)" }}
            >
              
              {/* Product Reference Block Panel */}
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.1rem" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= rev.rating ? goldColor : "transparent"} color={s <= rev.rating ? goldColor : "#e5e7eb"} />
                    ))}
                  </div>
                  
                  {/* ✅ ALIGNED: Securely reads the nested populate fields mapping back directly to mongoose schema ref keys */}
                  {rev.productId ? (
                    <Link 
                      href={`/shop/${rev.productId.slug || ""}`} 
                      target="_blank"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: goldColor, textDecoration: "none", background: "#FAF7F4", padding: "0.25rem 0.6rem", borderRadius: "2px", border: "1px solid #f0ebe3" }}
                    >
                      <span>Product: {rev.productId.name || "Unnamed Piece"}</span>
                      <ExternalLink size={10} />
                    </Link>
                  ) : (
                    <span style={{ fontSize: "0.7rem", fontFamily: "monospace", background: "#f4f4f5", padding: "0.25rem 0.5rem", borderRadius: "2px", color: "#9ca3af" }}>Garment Detached / Orphaned Node</span>
                  )}
                </div>

                {/* Review Text Content */}
                <p style={{ fontSize: "0.9rem", color: "#1a1a1a", lineHeight: 1.6, margin: "0 0 1rem 0", fontWeight: 400 }}>
                  "{rev.comment}"
                </p>

                {/* Meta Matrix Footnote Row */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.75rem", color: "#71717a" }}>
                  <div>Author: <strong style={{ color: "#1a1a1a" }}>{rev.user}</strong></div>
                  <div>Email: <span style={{ fontFamily: "monospace", color: "#4b5563" }}>{rev.email}</span></div>
                  {rev.createdAt && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Calendar size={12} />
                      <span>{new Date(rev.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Administrative Trash Controls Split Column */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", borderTop: "1px solid #f4f4f5", paddingTop: "1rem" }}>
                <button
                  type="button"
                  disabled={deletingId === rev._id}
                  onClick={() => handleDeleteReview(rev._id)}
                  style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", padding: "0.6rem 1rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "2px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s" }}
                >
                  {deletingId === rev._id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  <span>Drop Critique</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}