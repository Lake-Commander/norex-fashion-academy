import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/OrderModel"; 
import User from "@/lib/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ success: false, error: "Missing tracking reference signature node." }, { status: 400 });
    }

    // 1. Double check transaction status securely with Paystack's API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.success || paystackData.data.status !== "success") {
      return NextResponse.json({ success: false, error: "Transaction verification declined by gateway." }, { status: 400 });
    }

    const transactionData = paystackData.data;
    
    // 2. Safely parse data properties from custom_fields array matrix
    const customFields = transactionData.metadata?.custom_fields || [];
    const rawCartItems = customFields.find((f: any) => f.variable_name === "cart_items")?.value || "[]";
    const shippingAddress = customFields.find((f: any) => f.variable_name === "shipping_address")?.value || "Atelier Delivery Pickup";
    const phoneLine = customFields.find((f: any) => f.variable_name === "phone_line")?.value || "N/A";

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(rawCartItems);
    } catch (parseErr) {
      console.error("Metadata JSON array reconstruction failed:", parseErr);
    }

    await connectDB();

    // 3. Resilient profile mapping lookup
    const customerEmail = transactionData.customer.email.toLowerCase().trim();
    const user = await User.findOne({ email: customerEmail });

    // 4. Standardize the payload format structural keys directly to your IOrder schema bounds
    const orderPayload = {
      email: customerEmail,
      user: user ? user._id : null,
      items: parsedItems.map((item: any) => ({
        product: item.id || item._id || null, 
        name: item.name || "Premium Atelier Garment",
        quantity: Number(item.orderQuantity || item.quantity || 1),
        size: String(item.selectedSize || item.size || "M"),
        color: String(item.selectedColor || item.color || "Default Matrix"),
        gender: String(item.selectedGender || item.gender || "Unisex")
      })),
      totalAmount: transactionData.amount / 100, // Normalize Kobo back to standard Naira
      shippingAddress: shippingAddress,
      phone: phoneLine,
      paymentGateway: "Paystack",
      paymentStatus: "Paid", // Automatically positions inside the user/admin active dashboard ledger arrays
      paymentReference: reference,
      orderType: "Storefront"
    };

    // Logging trace into server context terminal console to isolate drops
    console.log("Saving verified Paystack order layout straight to MongoDB:", orderPayload);

    const newOrder = await Order.create(orderPayload);

    return NextResponse.json({ success: true, orderId: newOrder.orderId });
  } catch (error: any) {
    console.error("❌ CRITICAL INTERCEPTED BACKEND ERROR ON SYNC:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}