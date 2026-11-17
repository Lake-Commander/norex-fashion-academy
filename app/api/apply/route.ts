import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import User from "@/lib/models/UserModel";
import ApplicationSettings from "@/lib/models/ApplicationSettingsModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const courseNames: Record<string, string> = {
  "fashion-design-fundamentals": "Fashion Design Fundamentals",
  "advanced-pattern-making": "Advanced Pattern Making & Draping",
  "fashion-business-entrepreneurship": "Fashion Business & Entrepreneurship",
  "luxury-bridal-design": "Luxury Bridal Design",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please create an account or sign in before applying." }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phone, course, experienceLevel, message, feeReference } = body;

    if (!fullName || !email || !phone || !course || !experienceLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const accountEmail = session.user.email.toLowerCase().trim();
    if (email.toLowerCase().trim() !== accountEmail) {
      return NextResponse.json({ error: "Use the email address on your account." }, { status: 400 });
    }

    const settings = await ApplicationSettings.findOne().lean();
    const feeEnabled = settings?.applicationFeeEnabled ?? true;
    const applicationFee = settings?.applicationFee ?? 5000;
    if (feeEnabled && !feeReference) {
      return NextResponse.json({ error: "Please pay the application fee before submitting." }, { status: 400 });
    }

    if (feeEnabled) {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(feeReference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      });
      const paystackData = await paystackRes.json();
      if (!paystackData.success || paystackData.data.status !== "success" || paystackData.data.amount !== applicationFee * 100) {
        return NextResponse.json({ error: "Application fee payment could not be verified." }, { status: 400 });
      }
    }

    const user = await User.findOne({ email: accountEmail });
    if (!user) return NextResponse.json({ error: "Your account could not be found." }, { status: 404 });
    const existing = await Application.findOne({ user: user._id, status: { $in: ["pending", "approved", "enrolled"] } });
    if (existing) return NextResponse.json({ error: "You already have an active academy application." }, { status: 409 });

    // 1. Commit and persist the record data into your MongoDB collections
    const application = await Application.create({
      fullName,
      email,
      phone,
      course,
      experienceLevel,
      message,
      user: user._id,
      applicationFee: feeEnabled ? applicationFee : 0,
      applicationFeeReference: feeEnabled ? feeReference : undefined,
      status: "pending",
    });

    // 2. 🛡️ Safe Notification Layer: Dispatch Admin alerts via Brevo HTTP API
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: { name: "Norex Academy Registry", email: "system@norexfashion.com" },
            to: [{ email: process.env.ADMIN_EMAIL! }],
            subject: `New Academy Application — ${fullName}`,
            htmlContent: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
                <div style="background: #1a1a1a; padding: 2rem; text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #C9A84C;">
                  <h1 style="color: white; margin: 0; font-size: 1.3rem; letter-spacing: 0.1em; text-transform: uppercase;">New Application Received</h1>
                </div>
                <div style="background: white; padding: 2rem; margin-bottom: 1rem; border: 1px solid #f0ebe3;">
                  <h2 style="color: #C9A84C; font-size: 1.1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #f0ebe3; padding-bottom: 1rem;">Applicant Details</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; width: 140px;">Full Name</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; font-weight: 600;">${fullName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${phone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Course</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #C9A84C; font-weight: 600;">${courseNames[course] || course}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Experience</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${experienceLevel}</td>
                    </tr>
                    ${message ? `
                    <tr>
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; line-height: 1.6;">${message}</td>
                    </tr>` : ""}
                  </table>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <a href="${process.env.NEXTAUTH_URL || ''}/admin/applications" style="display: inline-block; background: #C9A84C; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">
                    View in Dashboard →
                  </a>
                </div>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.error("Brevo application notification drop fallback triggered:", emailErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Application received successfully", id: application._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apply API core exception context crash:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}