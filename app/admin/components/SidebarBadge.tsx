import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Contact from "@/lib/models/ContactModel";
import Link from "next/link";
import { SignOutButton } from "../SignOutButton";

async function getNotifications() {
  await connectDB();
  const pendingApplications = await Application.countDocuments({ status: "pending" });
  const unreadMessages = await Contact.countDocuments({ status: "unread" });
  return { pendingApplications, unreadMessages };
}

export default async function AdminSidebar() {
  const { pendingApplications, unreadMessages } = await getNotifications();

  return (
    <aside style={{ width: "260px", backgroundColor: "#1a1a1a", padding: "2rem 1rem", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
      <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <img src="/tolani-logo.png" alt="Norex Fashion" style={{ height: "50px", width: "auto", filter: "brightness(0) invert(1)" }} />
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>Admin Dashboard</p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>

        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Overview
          {(pendingApplications + unreadMessages) > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#722F37", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {pendingApplications + unreadMessages}
            </span>
          )}
        </Link>

        <Link href="/admin/applications" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Applications
          {pendingApplications > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {pendingApplications}
            </span>
          )}
        </Link>

        <Link href="/admin/students" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Students
        </Link>

        <Link href="/admin/payments" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Payments
        </Link>

        <Link href="/admin/contacts" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
          {unreadMessages > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#dc2626", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {unreadMessages}
            </span>
          )}
        </Link>

      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
        <SignOutButton />
      </div>
    </aside>
  );
}
