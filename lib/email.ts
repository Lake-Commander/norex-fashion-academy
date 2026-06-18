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

  // ⚡ SERVERLESS OPTIMIZED: Create a clean, dedicated single-use instance per function invocation
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "norexfashion.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465, 
    auth: {
      user: process.env.SMTP_USER || "",
      password: process.env.SMTP_PASS || "",
    },
    tls: {
      rejectUnauthorized: false, 
      ciphers: "SSLv3"           
    },
    connectionTimeout: 10000, // Terminate frozen handshakes early
    greetingTimeout: 10000,
  } as any);

  const mailOptions = {
    from: `"Norex Fashion House" <${fromAddress}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // 1. Verify the handshake block works inside this specific serverless instance execution path
    await transporter.verify();

    // 2. Dispatch the payload
    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Vercel Serverless SMTP Transport Failure:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  } finally {
    // ⚡ CRITICAL FOR VERCEL: Force clean closure of the socket container before the serverless container sleeps
    transporter.close();
  }
}