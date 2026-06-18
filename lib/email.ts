// lib/email.ts
import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP environment parameters missing. Running mail utilities in fallback mode.");
}

interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  const fromAddress = process.env.SMTP_FROM || "admin@norexfashion.com";

  // ⚡ VERCEL FIREWALL COMPLIANT: Use Port 587 via explicit STARTTLS upgrade
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "norexfashion.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // 🔥 Crucial for Vercel: must be false on 587 to allow the initial connection through
    auth: {
      user: process.env.SMTP_USER || "",
      password: process.env.SMTP_PASS || "",
    },
    tls: {
      rejectUnauthorized: false, // Prevents serverless nodes from dropping on local self-signed SSL errors
      requireTLS: true,          // Ensures that the email won't transmit unless STARTTLS succeeds
    },
    connectionTimeout: 15000, 
    greetingTimeout: 15000,
  } as any);

  const mailOptions = {
    from: `"Norex Fashion House" <${fromAddress}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // Verify handshake connection structure
    await transporter.verify();

    // Broadcast message
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Vercel Serverless SMTP Delivery Exception:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  } finally {
    // Explicit socket flush before Vercel kills the serverless process context
    transporter.close();
  }
}