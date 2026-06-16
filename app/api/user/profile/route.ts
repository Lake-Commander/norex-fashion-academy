// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Fixed: Updated import route line
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Authentication scope invalid." }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, phone, whatsapp, shippingAddress, billingAddress, actionType, telemetryData } = body;
    const userEmail = session.user.email.toLowerCase();

    if (actionType && telemetryData) {
      let updatePush = {};
      if (actionType === "track_read") updatePush = { readHistory: { $each: [telemetryData], $slice: -10 } };
      if (actionType === "track_video") updatePush = { watchHistory: { $each: [telemetryData], $slice: -10 } };
      if (actionType === "track_product") updatePush = { recentlyViewedProducts: { $each: [telemetryData], $slice: -6 } };
      if (actionType === "track_course") updatePush = { recentlyViewedCourses: { $each: [telemetryData], $slice: -6 } };

      await mongoose.models.User.updateOne({ email: userEmail }, { $push: updatePush });
      return NextResponse.json({ success: true, message: "Telemetry signal captured successfully." });
    }

    const updatedProfile = await mongoose.models.User.findOneAndUpdate(
      { email: userEmail },
      { $set: { name, phone, whatsapp, shippingAddress, billingAddress } },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Profile references saved.", profile: updatedProfile });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}