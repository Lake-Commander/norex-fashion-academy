// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: "Email parameter required." }, { status: 400 });

    const cleanEmail = email.toLowerCase().trim();
    const user = await mongoose.connection.model("User").findOne({ email: cleanEmail });

    // Security Guardrail: Return a deceptive success true loop to avoid account enumeration scanning tricks
    if (!user) {
      return NextResponse.json({ success: true, message: "If account exists, recovery dispatch completes shortly." });
    }

    // Generate hexadecimal cryptographic validation token string
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // Token active window parameters limited strictly to 1 Hour

    await mongoose.connection.model("User").updateOne(
      { email: cleanEmail },
      { $set: { resetPasswordToken: resetToken, resetPasswordExpires: tokenExpiry } }
    );

    const recoveryUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: serif; padding: 2rem; color: #1a1a1a; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7;">
        <h2 style="text-transform: uppercase; letter-spacing: 0.1em; color: #C9A84C;">Norex Access Recovery</h2>
        <p style="font-size: 14px; line-height: 1.6;">You requested a password reset for your Norex Fashion House profile passport.</p>
        <p style="font-size: 14px; line-height: 1.6;">Click the button below to establish new verification access keys. This linkage expires in 60 minutes.</p>
        <div style="margin: 2rem 0; text-align: center;">
          <a href="${recoveryUrl}" style="background-color: #1a1a1a; color: white; padding: 1rem 2rem; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">Reset Keys</a>
        </div>
        <p style="font-size: 11px; color: #9ca3af; font-family: monospace;">If this session request wasn't initialized by you, ignore this auto-dispatch safely.</p>
      </div>
    `;

    await sendEmail({ to: cleanEmail, subject: "Secure Identity Password Recovery Link", html: emailHtml });
    return NextResponse.json({ success: true, message: "Recovery link transmitted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}