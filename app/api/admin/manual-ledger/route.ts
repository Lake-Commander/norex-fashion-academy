import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/OrderModel";
import User from "@/lib/models/UserModel";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentEmail, courseTitle, amountCredited, customNote } = body;

    if (!studentEmail || !amountCredited || !courseTitle) {
      return NextResponse.json({ success: false, error: "Missing required manual fields" }, { status: 400 });
    }

    await connectDB();

    // 1. Verify if the target user student profile node exists
    const targetStudent = await User.findOne({ email: studentEmail.trim().toLowerCase() });

    // 2. Formulate a clean manual entry order tracking layout match
    const manualReceipt = await Order.create({
      email: studentEmail.trim().toLowerCase(),
      user: targetStudent ? targetStudent._id : null,
      items: [{
        name: `Academy Tuition: ${courseTitle}`,
        quantity: 1,
        size: "N/A",
        color: customNote || "Manual Entry Audit Node",
        gender: "N/A"
      }],
      totalAmount: Number(amountCredited),
      paymentGateway: "Manual Audit",
      paymentStatus: "Paid",
      paymentReference: `MAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderType: "Academy Tuition",
      shippingAddress: "Academy Studio Ledger Desk"
    });

    return NextResponse.json({ success: true, ledgerId: manualReceipt.orderId });
  } catch (error: any) {
    console.error("Manual accounting injection execution failure:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}