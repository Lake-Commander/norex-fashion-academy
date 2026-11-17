import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationSettings from "@/lib/models/ApplicationSettingsModel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await ApplicationSettings.findOne().lean();
    return NextResponse.json({
      enabled: settings?.applicationFeeEnabled ?? true,
      amount: settings?.applicationFee ?? 5000,
    });
  } catch (error) {
    console.error("Application settings lookup failed:", error);
    return NextResponse.json({ error: "Application settings are unavailable." }, { status: 500 });
  }
}
