import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/UserModel";
import Course from "@/lib/models/CourseModel";
import Order from "@/lib/models/OrderModel";
import Application from "@/lib/models/ApplicationModel";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const { reference } = await request.json();
    if (!reference) return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });

    const verifiedResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const verified = await verifiedResponse.json();
    if (!verifiedResponse.ok || !verified.success || verified.data.status !== "success") {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    }

    const slug = verified.data.metadata?.course_slug;
    await connectDB();
    const [user, course] = await Promise.all([
      User.findOne({ email: session.user.email.toLowerCase() }),
      Course.findOne({ slug }),
    ]);
    if (!user || !course) return NextResponse.json({ error: "Student or course record not found." }, { status: 404 });
    if (verified.data.amount !== Math.round(course.price * 100)) {
      return NextResponse.json({ error: "The payment amount does not match this course." }, { status: 400 });
    }

    const existing = await Order.findOne({ paymentReference: reference });
    if (!existing) {
      await Order.create({
        email: user.email,
        user: user._id,
        items: [{ name: course.title, quantity: 1, size: "N/A", color: "N/A", gender: "N/A" }],
        totalAmount: course.price,
        paymentGateway: "Paystack",
        paymentStatus: "Paid",
        paymentReference: reference,
        orderType: "Academy Tuition",
      });
    }
    await Application.updateOne({ user: user._id, course: course.slug, status: "approved" }, { $set: { status: "enrolled" } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Academy tuition verification failed:", error);
    return NextResponse.json({ error: "Academy payment could not be completed." }, { status: 500 });
  }
}
