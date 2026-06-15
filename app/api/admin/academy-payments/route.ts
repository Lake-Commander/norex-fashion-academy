// app/api/admin/academy-payments/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/lib/models/PaymentModel";

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}