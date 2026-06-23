"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
import PaystackCheckoutButton from "@/components/checkout/PaystackCheckoutButton";
import { MapPin, Phone, User, ShoppingBag, ShieldCheck, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal } = useShop();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Shipping Form Attributes Local States
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Hydrate base metadata directly from session payload if user profile is already populated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    } else if (session?.user) {
      setShippingDetails((prev) => ({
        ...prev,
        name: session.user.name || "",
      }));
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Syncing Secure Checkout Matrix...</p>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.4rem", textAlign: "left"
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left pt-24">
      <Header />
      
      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media(min-width: 1024px) { .checkout-grid { grid-template-columns: 7fr 5fr; gap: 4rem; } }

        .checkout-card { background: white; border: 1px solid #f0ebe3; padding: 2rem; border-radius: 2px; }
        .checkout-input { width: 100%; border: 1px solid #e5e7eb; padding: 0.875rem 1rem; font-size: 0.85rem; color: #1a1a1a; outline: none; transition: border-color 0.2s; border-radius: 2px; background: #FCFAF7; font-family: inherit; }
        .checkout-input:focus { border-color: #C9A84C; background: white; }
        
        .bag-item-row { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f4f4f5; }
        .bag-item-row:last-child { border-bottom: none; }
      `}</style>

      <div className="container-custom flex-1" style={{ width: "100%", maxWidth: "7xl", margin: "2rem auto 5rem auto", padding: "0 1.5rem" }}>
        <div className="checkout-grid">
          
          {/* Left Column: Delivery Parameters Ingestion */}
          <div className="space-y-6">
            <div className="checkout-card space-y-6">
              <div style={{ borderBottom: "1px solid #f0ebe3", paddingBottom: "1rem" }}>
                <span style={{ color: "#C9A84C" }} className="text-[9px] font-mono tracking-[0.25em] font-black uppercase block">SHIPPING REGISTRY</span>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase text-zinc-900 mt-0.5">Delivery Coordinates</h2>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label style={labelStyle}><User size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "text-top" }} /> Consignee Full Name</label>
                  <input name="name" value={shippingDetails.name} onChange={handleInputChange} placeholder="First Name Last Name" required className="checkout-input" />
                </div>

                <div>
                  <label style={labelStyle}><Phone size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "text-top" }} /> Primary Contact Line</label>
                  <input name="phone" type="tel" value={shippingDetails.phone} onChange={handleInputChange} placeholder="+234..." required className="checkout-input font-mono" />
                </div>

                <div>
                  <label style={labelStyle}><MapPin size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "text-top" }} /> Destination Address Landmark</label>
                  <textarea name="address" rows={3} value={shippingDetails.address} onChange={handleInputChange} placeholder="Provide full clear street address corridors and structural fashion house delivery points..." required className="checkout-input font-light resize-none" />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Ledger Context Breakdown */}
          <div className="space-y-6">
            <div className="checkout-card space-y-5">
              <div style={{ borderBottom: "1px solid #f0ebe3", paddingBottom: "1rem" }}>
                <span style={{ color: "#C9A84C" }} className="text-[9px] font-mono tracking-[0.25em] font-black uppercase block">SUMMARY ATELIER</span>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase text-zinc-900 mt-0.5">Order Review</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-mono text-zinc-400 uppercase">Your shopping bag is clean.</p>
                </div>
              ) : (
                <>
                  {/* Active Cart Line Mapping */}
                  <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id + item.selectedSize + item.selectedColor} className="bag-item-row">
                        <div style={{ position: "relative", width: "50px", height: "65px", flexShrink: 0, backgroundColor: "#FAF7F4", border: "1px solid #f0ebe3" }}>
                          <img src={item.images?.[0] || "/placeholder-garment.png"} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                          <h4 className="text-xs font-bold text-zinc-900 uppercase truncate tracking-wide">{item.name}</h4>
                          <p style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "2px" }} className="font-mono uppercase">
                            Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.orderQuantity}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p className="text-xs font-black font-mono text-zinc-900">{formatPrice(item.price * item.orderQuantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: "1px", backgroundColor: "#f0ebe3" }} />

                  {/* Financial Totals Calculations Frame */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-400 uppercase tracking-wider">Subtotal Value</span>
                      <span className="font-mono font-bold text-zinc-900">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-400 uppercase tracking-wider">Atelier Log Courier</span>
                      <span className="font-mono text-zinc-500 uppercase font-black text-[10px]">Free</span>
                    </div>
                    <div style={{ height: "1px", backgroundColor: "#f4f4f5", margin: "0.5rem 0" }} />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">Total Order Cost</span>
                      <span className="text-lg font-black font-mono text-[#C9A84C]">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  {/* Paystack Execution Trigger Shell Container */}
                  <div className="pt-4">
                    <PaystackCheckoutButton shippingDetails={shippingDetails} />
                  </div>

                  <div className="flex items-center gap-2 justify-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider pt-2">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Secure PCI-DSS Cryptographic Layers Enforced</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <StyleOracle />
      <Footer />
    </main>
  );
}