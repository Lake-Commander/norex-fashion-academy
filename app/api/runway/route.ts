// app/api/runway/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";
import RunwayLook from "@/lib/models/RunwayLook";

export async function GET() {
  try {
    await connectDB();
    const [collections, looks] = await Promise.all([
      RunwayCollection.find({}).sort({ createdAt: -1 }),
      RunwayLook.find({}).sort({ lookNumber: 1 })
    ]);
    return NextResponse.json({ success: true, collections, looks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}