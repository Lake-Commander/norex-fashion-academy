// app/api/admin/runway/collections/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";

export async function GET() {
  try {
    await connectDB();
    const data = await RunwayCollection.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const newDoc = await RunwayCollection.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}