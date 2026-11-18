import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/OrderModel";
import User from "@/lib/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ success: false, error: "Missing tracking reference." }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ success: false, error: "Paystack secret key is not configured." }, { status: 500 });
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json({ success: false, error: "Transaction verification declined by gateway." }, { status: 400 });
    }

    const transactionData = paystackData.data;
    const customFields = transactionData.metadata?.custom_fields || [];
    const rawCartItems = customFields.find((field: any) => field.variable_name === "cart_items")?.value || "[]";
    const shippingAddress = customFields.find((field: any) => field.variable_name === "shipping_address")?.value || "Atelier Delivery Pickup";
    const phoneLine = customFields.find((field: any) => field.variable_name === "phone_line")?.value || "N/A";

    let parsedItems: any[] = [];
    try {
      parsedItems = JSON.parse(rawCartItems);
      if (!Array.isArray(parsedItems)) parsedItems = [];
    } catch {
      parsedItems = [];
    }

    await connectDB();
    const customerEmail = transactionData.customer?.email?.toLowerCase().trim();
    if (!customerEmail) {
      return NextResponse.json({ success: false, error: "The verified transaction has no customer email." }, { status: 400 });
    }

    const user = await User.findOne({ email: customerEmail });
    const orderPayload = {
      email: customerEmail,
      user: user ? user._id : null,
      items: parsedItems.map((item: any) => {
        const productId = item.id || item._id;
        return {
          product: mongoose.Types.ObjectId.isValid(productId) ? productId : null,
          name: item.name || "Premium Atelier Garment",
          quantity: Math.max(1, Number(item.orderQuantity || item.quantity || 1)),
          size: String(item.selectedSize || item.size || "M"),
          color: String(item.selectedColor || item.color || "Default Matrix"),
          gender: String(item.selectedGender || item.gender || "Unisex"),
        };
      }),
      totalAmount: transactionData.amount / 100,
      shippingAddress,
      phone: phoneLine,
      paymentGateway: "Paystack" as const,
      paymentStatus: "Paid" as const,
      paymentReference: reference,
      orderType: "Storefront" as const,
    };

    const order = await Order.findOneAndUpdate(
      { paymentReference: reference },
      { $set: orderPayload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (user) {
      await User.updateOne({ _id: user._id }, { $set: { cart: [] } });
    }

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error: any) {
    console.error("Checkout verification failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
