import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/lib/models/ContactModel";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required parameter nodes." }, { status: 400 });
    }

    await connectDB();

    // Locates message via identifier string and patches tracking metrics fields
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Instructs Mongoose to return the mutated row artifact
    );

    if (!updatedContact) {
      return NextResponse.json({ success: false, error: "Target row log not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("Failed mutating status metrics database maps:", error);
    return NextResponse.json({ success: false, error: "Internal server exception." }, { status: 500 });
  }
}