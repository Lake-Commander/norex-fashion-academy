import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/lib/models/Reviews"; // FIXED: Path matching singular filename exactly

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