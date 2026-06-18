// lib/email.ts

interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromAddress = process.env.SMTP_FROM || "admin@norexfashion.com";

  if (!apiKey) {
    console.error("BREVO_API_KEY runtime environment variable is missing.");
    throw new Error("Mail utility engine unconfigured.");
  }

  try {
    // ⚡ VERCEL FIREWALL COMPLIANT: Standard secure HTTP Rest API request
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Norex Fashion House", email: fromAddress },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Brevo transmission challenge rejected.");
    }

    return { success: true, messageId: data.messageId };
  } catch (error: any) {
    console.error("Brevo API Delivery Layer Failure:", error);
    throw new Error(`Mail pipeline transaction dropped: ${error.message}`);
  }
}