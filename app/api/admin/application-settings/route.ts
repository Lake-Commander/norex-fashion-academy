import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ApplicationSettings from "@/lib/models/ApplicationSettingsModel";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as { role?: string }).role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  await connectDB();
  const settings = await ApplicationSettings.findOne().lean();
  return NextResponse.json({
    enabled: settings?.applicationFeeEnabled ?? true,
    amount: settings?.applicationFee ?? 5000,
  });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const enabled = Boolean(body.enabled);
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount < 0 || !Number.isInteger(amount) || (enabled && amount === 0)) {
      return NextResponse.json({ error: "Enter a whole-number fee greater than zero when the fee is enabled." }, { status: 400 });
    }

    await connectDB();
    const settings = await ApplicationSettings.findOneAndUpdate(
      {},
      { applicationFeeEnabled: enabled, applicationFee: amount },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ success: true, enabled: settings.applicationFeeEnabled, amount: settings.applicationFee });
  } catch (error) {
    console.error("Application settings update failed:", error);
    return NextResponse.json({ error: "Application settings could not be saved." }, { status: 500 });
  }
}
