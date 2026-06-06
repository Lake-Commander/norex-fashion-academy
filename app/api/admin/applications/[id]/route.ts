import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";

// Tell Next.js NOT to evaluate this file during the build process
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectDB();
    
    const updated = await Application.findByIdAndUpdate(id, { status: body.status }, { new: true });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}