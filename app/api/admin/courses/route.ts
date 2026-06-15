// app/api/admin/courses/route.ts
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

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Automatically evaluate clean URL slugs from course title strings
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCourse = await Course.create({ ...body, slug });
    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}