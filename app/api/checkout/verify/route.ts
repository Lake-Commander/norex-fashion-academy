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

    // 2. Extract safe contextual metadata bundled in step 2
    const transactionData = paystackData.data;
    const cartItems = JSON.parse(transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "cart_items")?.value || "[]");
    const shippingAddress = transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "shipping_address")?.value || "";
    const phoneLine = transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "phone_line")?.value || "";

    await connectDB();

    // 3. Find the profile and map the completed order payload to MongoDB logs
    const user = await User.findOne({ email: transactionData.customer.email });

    const newOrder = await Order.create({
      user: user ? user._id : null,
      email: transactionData.customer.email,
      items: cartItems,
      totalAmount: transactionData.amount / 100, // Normalize Kobo back to Naira
      shippingAddress: shippingAddress,
      phone: phoneLine,
      paymentGateway: "Paystack",
      paymentStatus: "Paid",
      paymentReference: reference,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (error: any) {
    console.error("Paystack server side audit crash:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}