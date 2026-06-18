// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/UserModel";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email input required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    await connectDB();

    const user = await UserModel.findOne({ email: cleanEmail });
    
    if (!user) {
      // Keep fake success for security, preventing account harvesting
      return NextResponse.json({ 
        success: true, 
        message: "If an account matches, a recovery code has been dispatched." 
      });
    }

    // 🔐 SECURE CRYPTO TOKENS: Generate a real web-safe hexadecimal token string
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Set token validity window to exactly 1 Hour from right now
    const expiryDate = new Date(Date.now() + 3600000); 

    // Update the user document inside MongoDB
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiryDate;
    await user.save();

    const resetLink = `https://www.norexfashion.com/reset-password?token=${resetToken}`;
    
    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>We received a request to reset your password for your Norex Fashion House account. Click the button below to complete the setup:</p>
      <p><a href="${resetLink}" style="background-color:#000;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block;border-radius:5px;">Reset My Password</a></p>
      <p>If you did not request this change, you can safely ignore this message. This security window will expire in 1 hour.</p>
    `;

    await sendEmail({
      to: cleanEmail,
      subject: "Reset Your Password - Norex Fashion House",
      html: emailHtml
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password recovery instructions successfully dispatched." 
    });

  } catch (error: any) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ success: false, error: "An internal processing error occurred." }, { status: 500 });
  }
}