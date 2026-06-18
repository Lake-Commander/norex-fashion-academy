import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Missing identity address target." }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY variable configuration missing from host node.");
      return NextResponse.json({ success: false, error: "Server sync environment fault." }, { status: 500 });
    }

    // Optional: Specify a valid list ID integer from your Brevo panel setup (e.g., [2])
    // If you don't define specific listIds, Brevo drops subscribers directly into your general contact register.
    const BREVO_LIST_IDS = [2]; 

    const brevoPayload = {
      email: email,
      updateEnabled: true, // Gracefully updates the listing metrics if the profile already exists
      listIds: BREVO_LIST_IDS
    };

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(brevoPayload)
    });

    // Brevo returns 201 Created or 204 Updated on a successful sync pass
    if (response.status === 201 || response.status === 204) {
      return NextResponse.json({ success: true });
    }

    const errorDetails = await response.json();
    
    // If user is already on the exact target list, treat gracefully or output context
    if (errorDetails.code === "duplicate_parameter") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: errorDetails.message || "Brevo pipeline rejection." }, { status: response.status });

  } catch (error) {
    console.error("NEWSLETTER_ROUTE_CRASH:", error);
    return NextResponse.json({ success: false, error: "Internal transmission tunnel failure." }, { status: 500 });
  }
}