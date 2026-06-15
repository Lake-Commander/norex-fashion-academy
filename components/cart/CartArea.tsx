"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus } from "lucide-react";

export default function CartArea() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useShop();
  const [shipping, setShipping] = useState(0);

  return (
    <>
      <style>{`
        .cart-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media(min-width: 1024px) { .cart-grid { grid-template-columns: 2fr 1fr; } }
        
        .cart-table { width: 100%; border-collapse: collapse; text-align: left; }
        .cart-table th { padding: 1rem; border-bottom: 1px solid #f0ebe3; color: #9ca3af; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .cart-table td { padding: 1.5rem 1rem; border-bottom: 1px solid #f0ebe3; vertical-align: middle; }
        
        .qty-btn { background: none; border: 1px solid #e5e7eb; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1a1a1a; transition: all 0.2s; }
        .qty-btn:hover { border-color: #C9A84C; color: #C9A84C; }
        .qty-input { width: 40px; height: 32px; text-align: center; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; border-left: none; border-right: none; font-size: 0.9rem; outline: none; background: white; }
        
        .checkout-box { border: 1px solid #f0ebe3; padding: 2rem; background: #FAF7F4; border-radius: 2px; position: sticky; top: 6rem; text-align: left; }
        .btn-gold { display: flex; align-items: center; justify-content: center; background-color: #1a1a1a; color: white; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none; cursor: pointer; width: 100%; transition: all 0.3s; text-decoration: none; }
        .btn-gold:hover { background-color: #C9A84C; }
        .btn-outline { background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 0.75rem 1.5rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; }
        .btn-outline:hover { background: #1a1a1a; color: white; }
      `}</style>

      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#1a1a1a" }}>
        <div className="container-custom" style={{ textAlign: "left" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Shopping Cart</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link> <span style={{ margin: "0 0.5rem" }}>/</span> <span style={{ color: "#C9A84C" }}>Cart</span>
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", color: "#1a1a1a", marginBottom: "1.5rem" }}>Your cart is empty</h2>
            <Link href="/shop" className="btn-outline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <div style={{ overflowX: "auto" }}>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th colSpan={2}>Product Details</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => {
                    // Extract item attributes safely with layout defaults
                    const itemSize = item.selectedSize || "M";
                    const itemColor = item.selectedColor || "Default Matrix";
                    const itemGender = item.selectedGender || "Standard";

                    return (
                      <tr key={`${item.id}-${idx}`}>
                        <td style={{ width: "80px" }}>
                          <Link href={`/shop/${item.slug}`}>
                            <div style={{ position: "relative", width: "70px", height: "90px", backgroundColor: "#FAF7F4", border: "1px solid #e5e7eb" }}>
                              <Image src={item.images?.[0] || "/placeholder.png"} alt={item.name} fill style={{ objectFit: "cover" }} />
                            </div>
                          </Link>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <Link href={`/shop/${item.slug}`} style={{ color: "#1a1a1a", textDecoration: "none", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase" }}>
                            {item.name}
                          </Link>
                          {/* Rendering Chosen Parameters Subtitles */}
                          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem" }} className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                            <span>Size: <span className="text-zinc-700">{itemSize}</span></span>
                            <span>Color: <span className="text-zinc-700">{itemColor}</span></span>
                            <span>Fit: <span className="text-zinc-700">{itemGender}</span></span>
                          </div>
                        </td>
                        <td style={{ color: "#6b7280", fontSize: "0.9rem", fontFamily: "monospace" }}>{formatPrice(item.price)}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, itemSize, itemColor, itemGender, item.orderQuantity - 1)}>
                              <Minus size={14} />
                            </button>
                            <input type="text" value={item.orderQuantity} readOnly className="qty-input" />
                            <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, itemSize, itemColor, itemGender, item.orderQuantity + 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: "#C9A84C", fontFamily: "monospace" }}>{formatPrice(item.price * item.orderQuantity)}</td>
                        <td>
                          <button type="button" onClick={() => removeFromCart(item.id, itemSize, itemColor, itemGender)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                <Link href="/shop" className="btn-outline">← Continue Shopping</Link>
                <button type="button" onClick={clearCart} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline", textTransform: "uppercase" }}>Clear Bag</button>
              </div>
            </div>

            {/* Order Summary Checkout Widget */}
            <div>
              <div className="checkout-box">
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.35rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem", marginBottom: "1.5rem" }} className="font-bold uppercase">Order Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem", color: "#4b5563" }}>
                  <span>Bag Subtotal</span>
                  <span style={{ fontWeight: 700, color: "#1a1a1a", fontFamily: "monospace" }}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{ marginBottom: "2rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem", color: "#1a1a1a", textTransform: "uppercase" }} className="font-mono text-zinc-400">Logistics Allocation</p>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#4b5563", marginBottom: "0.5rem", cursor: "pointer" }}>
                    <input type="radio" name="shipping" onChange={() => setShipping(5000)} /> Flat Rate Delivery: {formatPrice(5000)}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#4b5563", cursor: "pointer" }}>
                    <input type="radio" name="shipping" onChange={() => setShipping(0)} /> Free In-Store Pickup (Warri)
                  </label>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: "1rem", marginBottom: "2rem", fontSize: "1.1rem" }}>
                  <span style={{ fontWeight: 700, color: "#1a1a1a" }}>Total</span>
                  <span style={{ fontWeight: 700, color: "#C9A84C", fontFamily: "monospace" }}>{formatPrice(cartTotal + shipping)}</span>
                </div>
                <Link href="/checkout" className="btn-gold">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}