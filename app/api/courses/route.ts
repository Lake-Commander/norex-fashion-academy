// app/api/courses/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/CourseModel";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}