// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"; // ✅ Fixed: Imported NextResponse to eliminate the compilation crash
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/UserModel"; 

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email address parameter input required." }, { status: 400 });
    }

    // Safe, verified lookup query block using the master model
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Return a safe neutral success response to prevent email harvesting discovery loops
      return NextResponse.json({ success: true, message: "If an account matches, a secure recovery code has been dispatched." });
    }

    // --- Your remaining password reset token generation & sendEmail pipeline logic continues here ---

    return NextResponse.json({ success: true, message: "Recovery code link dispatched." });

  } catch (error: any) {
    console.error("Forgot Password Engine Failure:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}