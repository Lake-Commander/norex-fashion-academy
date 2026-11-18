// app/api/user/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Fixed: Updated import route line
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Order from "@/lib/models/OrderModel";
import Payment from "@/lib/models/PaymentModel";
import Product from "@/lib/models/ProductModel";
import Course from "@/lib/models/CourseModel";
import mongoose from "mongoose";
import User from "@/lib/models/UserModel";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Access authorization handshake denied." }, { status: 401 });
    }

    await connectDB();
    const userEmail = session.user.email.toLowerCase();
    const userProfile = await User.findOne({ email: userEmail }).lean();

    const [applications, orders, payments] = await Promise.all([
      Application.find({ email: userEmail }).sort({ createdAt: -1 }),
      Order.find({ $or: [{ email: userEmail }, ...(userProfile?._id ? [{ user: userProfile._id }] : [])] }).sort({ createdAt: -1 }),
      Payment.find({ email: userEmail }).sort({ createdAt: -1 })
    ]);
    const wishlistIds = (userProfile?.wishlist || []).filter((id: string) => mongoose.Types.ObjectId.isValid(id));
    const wishlistProducts = wishlistIds.length
      ? await Product.find({ _id: { $in: wishlistIds } }).lean()
      : [];
    const courseSlugs = applications.map((application) => application.course);
    const enrolledCourses = courseSlugs.length
      ? await Course.find({ slug: { $in: courseSlugs } }).lean()
      : [];

    return NextResponse.json({
      success: true,
      profile: {
        name: userProfile?.name || session.user.name,
        email: userEmail,
        studentId: userProfile?.studentId || "",
        image: userProfile?.image || session.user.image,
        profilePhoto: userProfile?.profilePhoto || "",
        phone: userProfile?.phone || "",
        whatsapp: userProfile?.whatsapp || "",
        shippingAddress: userProfile?.shippingAddress || "",
        billingAddress: userProfile?.billingAddress || "",
        readHistory: userProfile?.readHistory || [],
        watchHistory: userProfile?.watchHistory || [],
        recentlyViewedProducts: userProfile?.recentlyViewedProducts || [],
        recentlyViewedCourses: userProfile?.recentlyViewedCourses || [],
        cart: userProfile?.cart || [],
        wishlist: wishlistProducts
      },
      applications,
      enrolledCourses,
      orders,
      payments
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}