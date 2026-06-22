import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/lib/models/ContactModel";

export const dynamic = "force-dynamic";

// 📬 1. POST INGESTION: Accepts new submissions from form view fields and logs into DB
export async function POST(req: NextRequest) {
  try {
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

    // Send admin notification via Brevo transactional SMTP API proxy handles
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
            sender: { name: "Norex House Protocol", email: "system@norexfashion.com" },
            to: [{ email: process.env.ADMIN_EMAIL! }],
            subject: `New Message — ${subject}`,
            htmlContent: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #FAF7F4;">
                <div style="background: #1a1a1a; padding: 2rem; text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #C9A84C;">
                  <h1 style="color: white; margin: 0; font-size: 1.3rem; letter-spacing: 0.1em; text-transform: uppercase;">New Message Received</h1>
                </div>
                <div style="background: white; padding: 2rem; border: 1px solid #f0ebe3;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; tracking: 0.1em; width: 120px;">From</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; font-weight: 600;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; tracking: 0.1em;">Email</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${email}</td>
                    </tr>
                    ${phone ? `
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; tracking: 0.1em;">Phone</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a;">${phone}</td>
                    </tr>` : ""}
                    <tr style="border-bottom: 1px solid #f0ebe3;">
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; tracking: 0.1em;">Subject</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #C9A84C; font-weight: 600;">${subject}</td>
                    </tr>
                    <tr>
                      <td style="padding: 0.75rem 0; font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; tracking: 0.1em; vertical-align: top;">Message</td>
                      <td style="padding: 0.75rem 0; font-size: 0.95rem; color: #1a1a1a; line-height: 1.7;">${message}</td>
                    </tr>
                  </table>
                </div>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.error("Brevo notification fallback triggered:", emailErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Message processed successfully", id: contact._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form endpoint crashed:", error);
    return NextResponse.json({ error: "Internal server exception drop" }, { status: 500 });
  }
}

// 👁️ 2. GET REGISTRIES: Fetches all entries from database collection logs ordered by newest mount parameters
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Failed fetching active ledger entries:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// 🛠️ 3. PUT MUTATIONS: Changes status strings (unread -> read -> replied) dynamically via unique IDs
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required parameter nodes." }, { status: 400 });
    }

    await connectDB();

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedContact) {
      return NextResponse.json({ success: false, error: "Target row log not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("Failed mutating status metrics database maps:", error);
    return NextResponse.json({ success: false, error: "Internal server exception." }, { status: 500 });
  }
}