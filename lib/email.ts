// lib/email.ts
import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP environment parameters missing. Mail processing running in fallback mode.");
}

// Create atomic connection pooling transport instance
const transporter = nodemailer.createTransport({
  pool: true, // ⚡ ADDED: Reuses existing sockets to prevent EBUSY resource exhaustion errors
  host: process.env.SMTP_HOST || "mail.norexfashion.com", // Fallback updated to your direct domain mail server
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // True for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASS || "",
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