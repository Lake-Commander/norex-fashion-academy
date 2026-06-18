// lib/email.ts
import { NextResponse } from "next/server";

interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  try {
    const response = await fetch(process.env.MAIL_BRIDGE_URL || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.MAIL_BRIDGE_SECRET,
        to,
        subject,
        html
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Bridge delivery rejected.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Vercel Bridge Failure:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  }
}