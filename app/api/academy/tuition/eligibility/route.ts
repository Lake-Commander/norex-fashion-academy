import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ eligible: false, error: "Please sign in first." }, { status: 401 });
  const course = new URL(request.url).searchParams.get("course");
  if (!course) return NextResponse.json({ eligible: false, error: "Course is required." }, { status: 400 });
  await connectDB();
  const application = await Application.findOne({ email: session.user.email.toLowerCase(), course, status: { $in: ["approved", "enrolled"] } });
  return NextResponse.json({ eligible: Boolean(application), error: application ? undefined : "Your application must be accepted before tuition payment." });
}
