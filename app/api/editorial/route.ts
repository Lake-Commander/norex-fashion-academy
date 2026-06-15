// app/api/editorial/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Editorial from "@/lib/models/EditorialModel";

export async function GET() {
  try {
    await connectDB();
    const publications = await Editorial.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, publications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}