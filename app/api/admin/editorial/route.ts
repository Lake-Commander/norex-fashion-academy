// app/api/admin/editorial/route.ts
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

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newPublication = await Editorial.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newPublication }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}