"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { Loader2, CreditCard } from "lucide-react";

interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
}

export default function PaystackCheckoutButton({ shippingDetails }: { shippingDetails: ShippingDetails }) {
  const { cart, cartTotal, clearCart } = useShop();
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(false);

  const handlePaystackPayment = async () => {
    // 1. Guards
    if (!session?.user?.email) {
      alert("Please sign in to your digital profile passport before checking out.");
      return;
    }

    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      alert("Please complete your delivery coordinates entry fields before placing your order.");
      return;
    }

    setProcessing(true);

    try {
      // 2. FIX: Dynamically import Paystack Pop inside the browser execution layer
      // This shields the Next.js server-side prerender engine from top-level window errors.
      const { default: PaystackPop } = await import("@paystack/inline-js");

      const transactionReference = `NRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: session.user.email,
        amount: Math.round(cartTotal * 100), // Naira to Kobo
        currency: "NGN",
        ref: transactionReference,
        metadata: {
          custom_fields: [
            {
              display_name: "Cart Items",
              variable_name: "cart_items",
              value: JSON.stringify(
                cart.map((item) => ({
                  id: item.id,
                  name: item.name,
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor,
                  selectedGender: item.selectedGender,
                  orderQuantity: item.orderQuantity,
                }))
              ),
            },
            {
              display_name: "Shipping Address",
              variable_name: "shipping_address",
              value: shippingDetails.address,
            },
            {
              display_name: "Phone Line",
              variable_name: "phone_line",
              value: shippingDetails.phone,
            }
          ],
        },
            onSuccess: async (response: any) => {
      try {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference }),
        });
        
        const verificationData = await verifyRes.json();

        if (verificationData.success) {
          clearCart(); // Safely clears your local application cache boundaries
          // Hard redirect flushes window instances to ensure state parameters refresh perfectly
          window.location.href = "/dashboard?success=true";
        } else {
          console.error("Verification endpoint logged database issue:", verificationData.error);
          alert(`Payment captured securely, but database transaction sync timed out: ${verificationData.error || 'Server Drop'}`);
        }
      } catch (err) {
        console.error("Order logging map exception dropped:", err);
        alert("Network timeout tracking order data. Your fund allocation remains safe inside Paystack.");
      } finally {
        setProcessing(false);
      }
        },
        onCancel: () => {
          setProcessing(false);
          console.log("Atelier payment gateway dismissed by client thread.");
        },
      });
    } catch (error) {
      console.error("Paystack initialization overlay error:", error);
      setProcessing(false);
    }
  };

  return (
    <button
      type="button"
      disabled={processing || cart.length === 0}
      onClick={handlePaystackPayment}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "1.1rem 2rem",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        border: "none",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.3s ease",
        borderRadius: "2px"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C9A84C"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1a1a1a"}
    >
      {processing ? (
        <span className="flex items-center gap-2 mx-auto">
          <Loader2 className="animate-spin h-4 w-4 text-[#C9A84C]" /> 
          Securing Gateway Tunnel...
        </span>
      ) : (
        <>
          <span className="flex items-center gap-2">
            <CreditCard size={15} /> Confirm & Pay
          </span>
          <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
            {formatPrice(cartTotal)}
          </span>
        </>
      )}
    </button>
  );
}