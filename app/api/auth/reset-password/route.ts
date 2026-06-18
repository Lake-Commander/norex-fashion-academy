// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs"; // or whatever hashing tool you use for passwords

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing required arguments." }, { status: 400 });
    }

    await connectDB();

    // 1. Find user with matching token and ensure token expiration date is still in the future ($gt: Greater Than Now)
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "Recovery window link has expired or token signature match fault." 
      }, { status: 400 });
    }

    // 2. Hash your incoming password securely before updating records
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Re-save profile updates and completely clear the token fields so they can't be reused
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Security configurations updated. Your new password shield is active." 
    });

  } catch (error: any) {
    console.error("RESET_PASSWORD_SYSTEM_FAILURE:", error);
    return NextResponse.json({ success: false, error: "Internal registry error." }, { status: 500 });
  }
}