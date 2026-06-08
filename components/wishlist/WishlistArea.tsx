"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingBag } from "lucide-react";

export default function WishlistArea() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <>
      <style>{`
        .wishlist-table { width: 100%; border-collapse: collapse; text-align: left; }
        .wishlist-table th { padding: 1rem; border-bottom: 1px solid #f0ebe3; color: #9ca3af; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .wishlist-table td { padding: 1.5rem 1rem; border-bottom: 1px solid #f0ebe3; vertical-align: middle; }
        
        .btn-add { display: inline-flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid #C9A84C; color: #C9A84C; padding: 0.6rem 1.25rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; border-radius: 2px; }
        .btn-add:hover { background: #C9A84C; color: white; }
        .btn-outline { background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 0.75rem 1.5rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; }
        .btn-outline:hover { background: #1a1a1a; color: white; }
      `}</style>

      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#1a1a1a" }}>
        <div className="container-custom">
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "white", marginBottom: "1rem" }}>My Wishlist</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link> <span style={{ margin: "0 0.5rem" }}>/</span> <span style={{ color: "#C9A84C" }}>Wishlist</span>
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", color: "#1a1a1a", marginBottom: "1.5rem" }}>Your wishlist is empty</h2>
            <Link href="/shop" className="btn-outline">Explore Collection</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th colSpan={2}>Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: "80px" }}>
                      <Link href={`/shop/${item.slug}`}>
                        <div style={{ position: "relative", width: "70px", height: "90px", backgroundColor: "#F0EBE3" }}>
                          <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: "cover" }} />
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link href={`/shop/${item.slug}`} style={{ color: "#1a1a1a", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
                        {item.name}
                      </Link>
                    </td>
                    <td style={{ color: "#C9A84C", fontWeight: 600 }}>{formatPrice(item.price)}</td>
                    <td>
                      {item.inStock ? (
                        <span style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 500 }}>In Stock</span>
                      ) : (
                        <span style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>Out of Stock</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => addToCart(item)} className="btn-add" disabled={!item.inStock} style={{ opacity: item.inStock ? 1 : 0.5 }}>
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </td>
                    <td>
                      <button onClick={() => toggleWishlist(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}