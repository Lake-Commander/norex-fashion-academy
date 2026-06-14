import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/ProductModel";

// GET: Returns full catalog list sorted by newest entry
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Writes newly configured garment records to database
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    // Automatically generate a cleanURL slug from garment name string
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = await Product.create({
      ...data,
      slug
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}