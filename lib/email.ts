// lib/email.ts
interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  // Explicitly fetch right inside the call block
  const url = process.env.MAIL_BRIDGE_URL;
  const secret = process.env.MAIL_BRIDGE_SECRET;

  // 🚨 HARD ASSURANCE CHECK: Force compile errors if Vercel dashboard variables are empty
  if (!url || !secret) {
    throw new Error(
      `Vercel Environment Config Missing. URL Present: ${!!url}, Secret Present: ${!!secret}. Ensure MAIL_BRIDGE_URL and MAIL_BRIDGE_SECRET are completely set up in your Vercel project control panel.`
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, to, subject, html }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Bridge endpoint rejected pipeline execution.");
  }

  return { success: true };
}