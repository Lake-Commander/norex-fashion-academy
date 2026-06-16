// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, stylePreference } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required registration parameters." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Guardrail: Enforce baseline duplicate account checking
    const userExists = await mongoose.connection.model("User").findOne({ email: cleanEmail });
    if (userExists) {
      return NextResponse.json({ success: false, error: "This email is already linked to an active passport." }, { status: 409 });
    }

    // Cryptographic hashing lock
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await mongoose.connection.model("User").create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: "student", // Enforces baseline public profile clearance tier
      stylePreference: stylePreference || "minimalist",
    });

    return NextResponse.json({ success: true, message: "Bespoke identity profile secured." }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}