// app/api/user/sync/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose"; // ✅ Fixed: Removed the missing UserModel import entirely

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Guardrail: Block unauthenticated users or administrative environment nodes
  if (!session || (session.user as any).role === "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized access tier token signature." }, { status: 401 });
  }

  try {
    await connectDB();
    const { cart, wishlist } = await request.json();

    // ✅ The Fix: Resolves from Mongoose connection instead of hardcoded file imports
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