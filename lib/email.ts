// lib/email.ts
import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP environment parameters missing. Running mail utilities in fallback mode.");
}

// Global Cached Transporter to preserve connection pooling across Next.js Hot Module reloads
let transporter: any;

const isPort465 = Number(process.env.SMTP_PORT) === 465;

const transportConfig = {
  pool: true, // 🔄 Reuses open network sockets to entirely prevent the EBUSY crash loop
  maxConnections: 5,
  maxMessages: 100,
  host: process.env.SMTP_HOST || "norexfashion.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: isPort465, // 🔒 True for Port 465 (Implicit SSL), False for Port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASS || "",
  },
  tls: {
    rejectUnauthorized: false, // 🛡️ Bypasses cross-origin certification validation errors
    ciphers: "SSLv3"           // Forces compatibility with standard cPanel mail exchangers
  },
  timeout: 10000,
};

if (process.env.NODE_ENV === "production") {
  transporter = nodemailer.createTransport(transportConfig as any);
} else {
  if (!(global as any).smtpTransporter) {
    (global as any).smtpTransporter = nodemailer.createTransport(transportConfig as any);
  }
  transporter = (global as any).smtpTransporter;
}

interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  const fromAddress = process.env.SMTP_FROM || "admin@norexfashion.com";

  const mailOptions = {
    from: `"Norex Fashion House" <${fromAddress}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Lytehosting SMTP Transport Failure:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  }
}