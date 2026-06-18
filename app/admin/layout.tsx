// app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/SidebarBadge";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 SERVER-SIDE ACCREDITATION CHECK
  const session = await getServerSession(authOptions);

  // 🚨 SECURITY GATE: If not logged in, or logged in as a student, kick them back to the main login portal
  if (!session || (session.user as any).role !== "admin") {
    redirect("/login?error=UnauthorizedAdminAccessAttempt");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}