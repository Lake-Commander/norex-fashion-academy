// app/(site)/dashboard/page.tsx
import DashboardClient from "@/components/dashboard/DashboardClient";

// ⚡ Explicitly commands the compiler to skip build-time pre-rendering for this route
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <DashboardClient />;
}