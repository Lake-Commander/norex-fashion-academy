// app/api/admin/runway/looks/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RunwayLook from "@/lib/models/RunwayLook";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get("collectionId");
    
    const query = collectionId ? { collectionId } : {};
    const data = await RunwayLook.find(query).sort({ lookNumber: 1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newLook = await RunwayLook.create(body);
    return NextResponse.json({ success: true, data: newLook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}