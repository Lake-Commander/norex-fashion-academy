// app/api/categories/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/lib/models/CategoryModel";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}