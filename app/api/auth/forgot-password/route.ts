// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/UserModel";
import { sendEmail } from "@/lib/email"; // Make sure this path points to your Brevo helper

export async function POST(request: Request) {
  console.log("=== FORGOT PASSWORD ENGINE TRIGGERED ===");
  
  try {
    // 1. Check incoming payload data
    const body = await request.json();
    console.log("Captured Request Body Payload:", body);

    const { email } = body;
    if (!email) {
      console.log("❌ CRITICAL: Request halted. Email parameter missing.");
      return NextResponse.json({ success: false, error: "Email input required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log("Normalized Target Email:", cleanEmail);

    // 2. Database Connection Check
    console.log("Attempting database handshake connection...");
    await connectDB();
    console.log("✅ Database handshake connection established successfully.");

    // 3. User Lookup Verification Check
    console.log(`Searching for database record matching: ${cleanEmail}`);
    const user = await UserModel.findOne({ email: cleanEmail });
    
    if (!user) {
      // 🚨 SILENT EXIT PITFALL: If you test with an email that isn't in your DB, it exits here with a 200!
      console.log(`⚠️ WARNING: No account found for ${cleanEmail}. Returning fake success response for user privacy.`);
      return NextResponse.json({ 
        success: true, 
        message: "If an account matches, a recovery code has been dispatched." 
      });
    }

    console.log("✅ Match verified. User object retrieved:", { id: user._id, name: user.name });

    // 4. Token Generation & Delivery Simulation
    const resetToken = "test_token_" + Math.random().toString(36).substring(2, 15);
    const resetLink = `https://www.norexfashion.com/reset-password?token=${resetToken}`;
    
    const emailHtml = `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.name},</p>
      <p>Click the link below to securely reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    console.log("Invoking outbound Brevo REST API dispatch utility...");
    const mailResult = await sendEmail({
      to: cleanEmail,
      subject: "Reset Your Password - Norex Fashion House",
      html: emailHtml
    });

    console.log("🎉 Brevo API Response Object Received:", mailResult);

    return NextResponse.json({ 
      success: true, 
      message: "Password recovery instructions successfully dispatched." 
    });

  } catch (error: any) {
    console.error("💥 SYSTEM EXCEPTION CRASH:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}