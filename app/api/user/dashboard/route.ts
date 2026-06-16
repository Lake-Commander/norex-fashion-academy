// app/api/user/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Fixed: Updated import route line
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Order from "@/lib/models/OrderModel";
import Payment from "@/lib/models/PaymentModel";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Access authorization handshake denied." }, { status: 401 });
    }

    await connectDB();
    const userEmail = session.user.email.toLowerCase();
    const userProfile = await mongoose.models.User.findOne({ email: userEmail }).lean();

    const [applications, orders, payments] = await Promise.all([
      Application.find({ email: userEmail }).sort({ createdAt: -1 }),
      Order.find({ customerEmail: userEmail }).sort({ createdAt: -1 }),
      Payment.find({ studentEmail: userEmail }).sort({ createdAt: -1 })
    ]);

    return NextResponse.json({
      success: true,
      profile: {
        name: userProfile?.name || session.user.name,
        email: userEmail,
        image: userProfile?.image || session.user.image,
        phone: userProfile?.phone || "",
        whatsapp: userProfile?.whatsapp || "",
        shippingAddress: userProfile?.shippingAddress || "",
        billingAddress: userProfile?.billingAddress || "",
        readHistory: userProfile?.readHistory || [],
        watchHistory: userProfile?.watchHistory || [],
        recentlyViewedProducts: userProfile?.recentlyViewedProducts || [],
        recentlyViewedCourses: userProfile?.recentlyViewedCourses || []
      },
      applications,
      orders,
      payments
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}