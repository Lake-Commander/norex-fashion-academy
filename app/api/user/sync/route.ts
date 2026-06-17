// app/api/user/sync/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // ⚡ Fix: Enforce strong type safety boundary right at the top of the execution thread
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthenticated session profile context." }, 
      { status: 401 }
    );
  }

  // Safe to read: Evaluates administrative clearance tiers
  if ((session.user as any).role === "admin" || !session.user.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access tier token signature." }, 
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const { cart, wishlist } = await request.json();

    // Resolves model straight from cached memory arrays instead of strict file imports
    const UserModel = mongoose.connection.model("User");

    await UserModel.updateOne(
      { email: session.user.email },
      { $set: { cart, wishlist } }
    );

    return NextResponse.json({ success: true, message: "Registry profiles synchronized." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}