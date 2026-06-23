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
    
    // 2. Safely parse out the custom item metrics arrays nested inside metadata custom fields
    const cartItems = JSON.parse(transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "cart_items")?.value || "[]");
    const shippingAddress = transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "shipping_address")?.value || "";
    const phoneLine = transactionData.metadata.custom_fields.find((f: any) => f.variable_name === "phone_line")?.value || "";

    await connectDB();

    // 3. Match user account via their customer profile identity Node email
    const user = await User.findOne({ email: transactionData.customer.email.toLowerCase() });

    // 4. Create the final order matching your strict schema fields
    const newOrder = await Order.create({
      email: transactionData.customer.email.toLowerCase(),
      user: user ? user._id : null,
      items: cartItems.map((item: any) => ({
        product: item.id,
        name: item.name,
        quantity: item.orderQuantity,
        size: item.selectedSize,
        color: item.selectedColor,
        gender: item.selectedGender
      })),
      totalAmount: transactionData.amount / 100, // Convert Kobo back to standard Naira
      shippingAddress: shippingAddress,
      phone: phoneLine,
      paymentGateway: "Paystack",
      paymentStatus: "Paid", // Automatically clears into user ledger array view
      paymentReference: reference,
      orderType: "Storefront"
    });

    return NextResponse.json({ success: true, orderId: newOrder.orderId });
  } catch (error: any) {
    console.error("Paystack backend server audit exception crash:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}