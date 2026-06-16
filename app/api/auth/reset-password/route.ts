// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Validation keys missing out of structural data block." }, { status: 400 });
    }

    // Evaluate token signatures alongside expiration parameters
    const user = await mongoose.connection.model("User").findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Recovery window link has expired or tokens signatures match fault." }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(12);
    const newHashedPassword = await bcrypt.hash(password, salt);

    // Update active security credentials lines and flush token slots clean
    await mongoose.connection.model("User").updateOne(
      { _id: user._id },
      { 
        $set: { password: newHashedPassword }, 
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } 
      }
    );

    return NextResponse.json({ success: true, message: "Access keys mutated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}