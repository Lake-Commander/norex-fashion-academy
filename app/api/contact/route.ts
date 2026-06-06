import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/lib/models/ContactModel";
import { Resend } from "resend";

// Tell Next.js NOT to evaluate this file during the build process
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Initialize Resend INSIDE the function so it doesn't break the Vercel build
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "unread",
    });

    // Notify admin
    await resend.emails.send({
      from: "Norex Fashion <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Message — ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
          <div style="background: #C9A84C; padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <h1 style="color: white; margin: 0; font-size: 1.5rem; letter-spacing: 0.1em;">NEW MESSAGE RECEIVED</h1>
          </div>
          <div style="background: white; padding: 2rem; margin-bottom: 1rem;">
            <h2 style="color: #C9A84C; font-size: 1.1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #f0ebe3; padding-bottom: 1rem;">Message Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f0ebe3;">
                <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">From</td>
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ebe3;">
                <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${email}</td>
              </tr>
              ${phone ? `
              <tr style="border-bottom: 1px solid #f0ebe3;">
                <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td>
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${phone}</td>
              </tr>` : ""}
              <tr style="border-bottom: 1px solid #f0ebe3;">
                <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #C9A84C; font-weight: 600;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
                <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; line-height: 1.7;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; padding: 1rem; display: flex; gap: 1rem; justify-content: center;">
            <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: #C9A84C; color: white; padding: 0.875rem 1.5rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; margin-right: 1rem;">
              Reply via Email
            </a>
            <a href="${process.env.NEXTAUTH_URL}/admin/contacts" style="display: inline-block; background: #1a1a1a; color: white; padding: 0.875rem 1.5rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">
              View in Dashboard
            </a>
          </div>
          <p style="text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 1.5rem;">Norex Fashion Admin · Automated Notification</p>
        </div>
      `,
    });

    // Confirm to sender
    await resend.emails.send({
      from: "Norex Fashion <onboarding@resend.dev>",
      to: email,
      subject: "We got your message — Norex Fashion",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
          <div style="background: #C9A84C; padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <h1 style="color: white; margin: 0; font-size: 1.5rem; letter-spacing: 0.1em;">NOREX FASHION</h1>
          </div>
          <div style="background: white; padding: 2rem; margin-bottom: 1rem;">
            <h2 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 1rem;">Hi ${name},</h2>
            <p style="color: #4b5563; line-height: 1.8; margin-bottom: 1.5rem;">
              Thank you for reaching out to <strong style="color: #C9A84C;">Norex Fashion</strong>. We have received your message and will get back to you within <strong>24 hours</strong>.
            </p>
            <div style="background: #FAF7F4; border-left: 4px solid #C9A84C; padding: 1.25rem; margin-bottom: 1.5rem;">
              <p style="margin: 0 0 0.5rem; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Your message</p>
              <p style="margin: 0; color: #4b5563; font-size: 0.95rem; line-height: 1.7;">${message}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.8;">For urgent inquiries, please reach us directly on WhatsApp.</p>
            <p style="color: #C9A84C; font-weight: 600; margin-top: 1.5rem;">With elegance,<br/>The Norex Fashion Team</p>
          </div>
          <div style="text-align: center; padding: 1rem;">
            <a href="https://wa.me/2349043371380" style="display: inline-block; background: #25D366; color: white; padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">
              Chat on WhatsApp
            </a>
          </div>
          <p style="text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 1.5rem;">Norex Fashion · Warri, Nigeria · hello@norexfashion.com</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Message received successfully", id: contact._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}