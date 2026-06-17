// lib/email.ts
import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP environment parameters missing. Mail processing running in fallback mode.");
}

// Create atomic connection pooling transport instance
// lib/email.ts
const transporter = nodemailer.createTransport({
  pool: true, 
  host: process.env.SMTP_HOST || "mail.norexfashion.com",
  port: Number(process.env.SMTP_PORT) || 587, // ⚡ Updated: Changed from 465 to 587 submission standard
  secure: false,                              // ⚡ Updated: Set to false for explicit STARTTLS negotiation
  auth: {
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASS || "",
  },
  tls: {
    rejectUnauthorized: false // ⚡ Avoids self-signed certification handshake loops on local servers
  },
  timeout: 10000,
} as any);

interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  const mailOptions = {
    from: `"Norex Fashion House" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("SMTP Transport Layer Failure:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  }
}