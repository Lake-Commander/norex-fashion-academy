import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const courseNames: Record<string, string> = {
  "fashion-design-fundamentals": "Fashion Design Fundamentals",
  "advanced-pattern-making": "Advanced Pattern Making & Draping",
  "fashion-business-entrepreneurship": "Fashion Business & Entrepreneurship",
  "luxury-bridal-design": "Luxury Bridal Design",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, course, experienceLevel, message } = body;

    if (!fullName || !email || !phone || !course || !experienceLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const application = await Application.create({
      fullName,
      email,
      phone,
      course,
      experienceLevel,
      message,
      status: "pending",
    });

    // Send notification to admin
    await resend.emails.send({
      from: "Norex Fashion <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Academy Application — ${fullName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
          <div style="background: #722F37; padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <h1 style="color: white; margin: 0; font-size: 1.5rem; letter-spacing: 0.1em;">NEW APPLICATION RECEIVED</h1>
          </div>
          <div style="background: white; padding: 2rem; margin-bottom: 1rem;">
            <h2 style="color: #722F37; font-size: 1.1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #f0ebe3; padding-bottom: 1rem;">Applicant Details</h2>
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
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #722F37; font-weight: 600;">${courseNames[course] || course}</td>
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
            <a href="${process.env.NEXTAUTH_URL}/admin/applications" style="display: inline-block; background: #722F37; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">
              View in Dashboard →
            </a>
          </div>
          <p style="text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 1.5rem;">Norex Fashion Admin · Automated Notification</p>
        </div>
      `,
    });

    // Send confirmation to applicant
    await resend.emails.send({
      from: "Norex Fashion <onboarding@resend.dev>",
      to: email,
      subject: "We received your application — Norex Fashion Academy",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
          <div style="background: #722F37; padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <h1 style="color: white; margin: 0; font-size: 1.5rem; letter-spacing: 0.1em;">NOREX FASHION ACADEMY</h1>
          </div>
          <div style="background: white; padding: 2rem; margin-bottom: 1rem;">
            <h2 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 1rem;">Hi ${fullName},</h2>
            <p style="color: #4b5563; line-height: 1.8; margin-bottom: 1.5rem;">
              Thank you for applying to <strong style="color: #722F37;">Norex Fashion Academy</strong>. We have received your application for the <strong>${courseNames[course] || course}</strong> program.
            </p>
            <div style="background: #FAF7F4; border-left: 4px solid #722F37; padding: 1.25rem; margin-bottom: 1.5rem;">
              <p style="margin: 0; color: #4b5563; font-size: 0.95rem; line-height: 1.7;">
                Our team will review your application and get back to you within <strong>48 hours</strong>. If you have any questions in the meantime, feel free to reach out via WhatsApp or email.
              </p>
            </div>
            <p style="color: #4b5563; line-height: 1.8;">
              We are excited about the possibility of welcoming you to our community of passionate fashion designers.
            </p>
            <p style="color: #722F37; font-weight: 600; margin-top: 1.5rem;">With elegance,<br/>The Norex Fashion Team</p>
          </div>
          <div style="text-align: center; padding: 1rem;">
            <a href="https://wa.me/2348000000000" style="display: inline-block; background: #25D366; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">
              Chat on WhatsApp
            </a>
          </div>
          <p style="text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 1.5rem;">Norex Fashion · Warri, Nigeria · hello@norexfashion.com</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Application received successfully", id: application._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apply API error:", error);
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