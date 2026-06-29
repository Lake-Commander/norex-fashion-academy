import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/lib/models/Reviews"; // Kept schema path import binding
import mongoose from "mongoose";

/**
 * GET /api/reviews
 * Fetches all user critiques populated with garment registry details.
 */
export async function GET() {
  try {
    await dbConnect();
    
    // We populate only the fields needed by the view layer (name, slug) to maximize query performance
    const allReviews = await Review.find({})
      .populate("productId", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: allReviews });
  } catch (error) {
    console.error("Critical failure reading review data nodes:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal database stream failure.",
    }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Creates a public product critique entry node.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic structural data runtime normalization validation check
    if (!body.productId || !body.rating || !body.comment) {
      return NextResponse.json({ success: false, error: "Missing payload node variables." }, { status: 400 });
    }

    const newReview = await Review.create(body);

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("Review creation engine failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown structural error.",
    }, { status: 500 });
  }
}

/**
 * DELETE /api/reviews?id=REVIEW_ID
 * Administrative route endpoint to drop a comment entry completely from collection pools.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Missing or malformed target document ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Locates and purges the document row straight out of your MongoDB collection space
    const deletedDocument = await Review.findByIdAndDelete(id);

    if (!deletedDocument) {
      return NextResponse.json(
        { success: false, error: "Target review entry could not be located in live indices." },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Customer critique record successfully unlinked and purged from production master ledgers." 
    });
  } catch (error) {
    console.error("Review administration destructive engine execution failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal network structural drop.",
    }, { status: 500 });
  }
}