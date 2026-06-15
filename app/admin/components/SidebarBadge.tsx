import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Contact from "@/lib/models/ContactModel";
import Order from "@/lib/models/OrderModel";
import Link from "next/link";
import { SignOutButton } from "../SignOutButton";

async function getNotifications() {
  await connectDB();
  const pendingApplications = await Application.countDocuments({ status: "pending" });
  const unreadMessages = await Contact.countDocuments({ status: "unread" });
  const pendingPayments = await Order.countDocuments({ paymentStatus: "Pending", paymentGateway: "WhatsApp" });
  
  return { pendingApplications, unreadMessages, pendingPayments };
}

export default async function AdminSidebar() {
  const { pendingApplications, unreadMessages, pendingPayments } = await getNotifications();
  const totalAlerts = pendingApplications + unreadMessages + pendingPayments;

  return (
    <aside style={{ width: "260px", backgroundColor: "#1a1a1a", padding: "2rem 1rem", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
      <style>{`
        .sidebar-link {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; 
          font-size: 0.8rem; color: rgba(255,255,255,0.6); text-decoration: none; 
          font-weight: 500; border-radius: 4px; transition: all 0.2s ease;
        }
        .sidebar-link { text-decoration: none; }
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.05); color: white; transform: translateX(4px);
        }
        .sidebar-link svg { opacity: 0.7; transition: opacity 0.2s ease; shrink-0; }
        .sidebar-link:hover svg { opacity: 1; color: #C9A84C; }
        .sidebar-group-title { color: rgba(255,255,255,0.2); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; padding: 0.75rem 1rem 0.25rem 1rem; font-weight: 700; }
      `}</style>

      {/* Header Masthead */}
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <img src="/tolani-logo.png" alt="Norex Fashion" style={{ height: "45px", width: "auto", filter: "brightness(0) invert(1)" }} />
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "0.35rem" }}>Master Control CMS</p>
      </div>

      {/* Navigation Ecosystem Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 }}>
        <div className="sidebar-group-title">Registries</div>

        <Link href="/admin" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Overview
          {totalAlerts > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {totalAlerts}
            </span>
          )}
        </Link>

        <Link href="/admin/applications" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Applications
          {pendingApplications > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {pendingApplications}
            </span>
          )}
        </Link>

        <Link href="/admin/students" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Students
        </Link>

        <Link href="/admin/payments" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Payments
          {pendingPayments > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {pendingPayments}
            </span>
          )}
        </Link>

        <Link href="/admin/contacts" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
          {unreadMessages > 0 && (
            <span style={{ marginLeft: "auto", backgroundColor: "#dc2626", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* Storefront Catalog */}
        <div className="sidebar-group-title" style={{ marginTop: "0.75rem" }}>Storefront Catalog</div>
        <Link href="/admin/products" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          All Products
        </Link>
        <Link href="/admin/products/upload" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Upload Product
        </Link>

        {/* Academy Program CMS Section Links */}
        <div className="sidebar-group-title" style={{ marginTop: "0.75rem" }}>Academy Management</div>
        <Link href="/admin/courses" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          All Courses
        </Link>
        <Link href="/admin/courses/upload" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Create New Course
        </Link>

        {/* Narrative CMS */}
        <div className="sidebar-group-title" style={{ marginTop: "0.75rem" }}>Narrative CMS</div>
        <Link href="/admin/editorial" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          All Publications
        </Link>
        <Link href="/admin/editorial/upload" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Publish Entry
        </Link>
        <Link href="/admin/runway" className="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          Runway & Films
        </Link>
      </nav>

      {/* Footer System Session Trigger */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
        <SignOutButton />
      </div>
    </aside>
  );
}