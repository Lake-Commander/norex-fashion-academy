"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CreditCard, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AcademyTuitionButton({ course }: { course: { slug: string; title: string; price: number } }) {
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(false);

  const payTuition = async () => {
    if (!session?.user?.email) {
      window.location.href = `/login?callbackUrl=/academy/courses/${course.slug}`;
      return;
    }
    setProcessing(true);
    try {
      const eligibilityResponse = await fetch(`/api/academy/tuition/eligibility?course=${encodeURIComponent(course.slug)}`);
      const eligibility = await eligibilityResponse.json();
      if (!eligibilityResponse.ok || !eligibility.eligible) throw new Error(eligibility.error || "Your application is not yet accepted.");
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: session.user.email,
        amount: Math.round(course.price * 100),
        currency: "NGN",
        ref: `NRX-TUITION-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        metadata: { custom_fields: [], course_slug: course.slug, course_title: course.title, course_amount: course.price },
        onSuccess: async (payment: { reference: string }) => {
          const response = await fetch("/api/academy/tuition/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: payment.reference }),
          });
          const result = await response.json();
          if (!response.ok || !result.success) throw new Error(result.error || "Payment could not be saved.");
          window.location.href = "/dashboard?tab=academy&payment=success";
        },
        onCancel: () => setProcessing(false),
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Payment could not be completed.");
      setProcessing(false);
    }
  };

  return (
    <button type="button" onClick={payTuition} disabled={processing} className="btn-apply-gold">
      {processing ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
      {processing ? "Processing payment..." : `Pay course tuition · ${formatPrice(course.price)}`}
    </button>
  );
}
