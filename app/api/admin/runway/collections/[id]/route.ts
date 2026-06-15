// app/api/admin/runway/collections/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";
import RunwayLook from "@/lib/models/RunwayLook";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await RunwayCollection.findByIdAndDelete(id);
    await RunwayLook.deleteMany({ collectionId: id }); // Cascading deletion of looks
    return NextResponse.json({ success: true, message: "Collection records expunged." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}