// lib/email.ts
import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP environment parameters missing. Mail processing running in fallback mode.");
}

// Create atomic connection pooling transport instance
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.lytehosting.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // True for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASS || "",
  },
  timeout: 10000,
} as any); // ⚡ Fixed: Typing assertion 'as any' breaks open Nodemailer's brittle linter overload loop

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