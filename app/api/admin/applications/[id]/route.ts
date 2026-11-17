import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import User from "@/lib/models/UserModel";
import { sendEmail } from "@/lib/email";

// Tell Next.js NOT to evaluate this file during the build process
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectDB();
    
    const allowedStatuses = ["pending", "approved", "enrolled", "rejected"];
    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
    }

    const application = await Application.findById(id);
    if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });

    const changes: Record<string, unknown> = { status: body.status };
    if (body.status === "approved" && application.status !== "approved") {
      const studentId = application.studentId || `NRX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      changes.studentId = studentId;
      changes.acceptedAt = new Date();
      if (application.user) {
        await User.findByIdAndUpdate(application.user, { studentId });
      } else {
        await User.findOneAndUpdate({ email: application.email.toLowerCase() }, { studentId });
      }

      try {
        await sendEmail({
          to: application.email,
          subject: "Your Norex Academy application has been accepted",
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px"><h1 style="color:#C9A84C">Welcome to Norex Academy</h1><p>Hello ${application.fullName},</p><p>Your application has been accepted. Please sign in to your Norex dashboard to complete enrollment and view your student portal.</p><p><strong>Student ID:</strong> ${studentId}</p><p><a href="${process.env.NEXTAUTH_URL || ""}/dashboard">Open your student portal</a></p></div>`
        });
      } catch (emailError) {
        console.error("Acceptance email could not be sent:", emailError);
      }
    }

    const updated = await Application.findByIdAndUpdate(id, changes, { new: true });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}