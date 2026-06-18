"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, RotateCcw } from "lucide-react";
import { SignOutButton } from "../SignOutButton";

export default function AdminSidebar() {
  // Mobile reactive layout drawer state parameters
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState({ pendingApplications: 0, unreadMessages: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);

  // Async Client-side dynamic notification matrix fetch pipeline
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/admin/notifications"); // Create a minimal API route for this to keep server sync operations light
        const data = await res.json();
        if (data.success) {
          setAlerts(data.data);
        }
      } catch (err) {
        console.error("Alert matrices telemetry drop:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const totalAlerts = alerts.pendingApplications + alerts.unreadMessages + alerts.pendingPayments;

  return (
    <>
      <style>{`
        /* --- Desktop Independent Roller Styles --- */
        .admin-sidebar {
          width: 260px;
          background-color: #1a1a1a;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          z-index: 100;
        }

        @media(min-width: 1024px) {
          .admin-sidebar {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto; /* 🔥 Independent Desktop Scroll Wheel */
          }
          /* Custom clean scrollbar track for the sidebar roller panel */
          .admin-sidebar::-webkit-scrollbar { width: 3px; }
          .admin-sidebar::-webkit-scrollbar-track { background: transparent; }
          .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
          .admin-sidebar::-webkit-scrollbar-thumb:hover { background: #C9A84C; }
          
          .mobile-hamburger-trigger { display: none !important; }
        }

        /* --- Mobile Foldable Hamburger Drawer Layout --- */
        @media(max-width: 1023px) {
          .admin-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            width: 280px;
            max-width: 85vw;
            height: 100vh;
            overflow-y: auto;
            transform: translateX(${isOpen ? "0" : "-100%"});
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 25px 0 50px rgba(0,0,0,0.3);
          }
          .sidebar-mobile-shade {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 90;
            display: ${isOpen ? "block" : "none"};
          }
          .mobile-hamburger-trigger {
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 80;
            width: 40px;
            height: 40px;
            background: #1a1a1a;
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        }

        /* --- Link and Typography Rules --- */
        .sidebar-link {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; 
          font-size: 0.8rem; color: rgba(255,255,255,0.6); text-decoration: none; 
          font-weight: 500; border-radius: 4px; transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.05); color: white; transform: translateX(4px);
        }
        .sidebar-link svg { opacity: 0.7; transition: opacity 0.2s ease; shrink-0; }
        .sidebar-link:hover svg { opacity: 1; color: #C9A84C; }
        
        .sidebar-group-title { 
          color: rgba(255,255,255,0.2); font-size: 0.6rem; text-transform: uppercase; 
          letter-spacing: 0.15em; padding: 0.75rem 1rem 0.25rem 1rem; font-weight: 700; 
        }
      `}</style>

      {/* Mobile Floating Toggle Menu Button */}
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="mobile-hamburger-trigger"
        aria-label="Toggle Control Center Navigation"
      >
        {isOpen ? <X size={18} style={{ color: "#C9A84C" }} /> : <Menu size={18} />}
      </button>

      {/* Dimmed Overlay click dismiss handler for responsive views */}
      <div className="sidebar-mobile-shade" onClick={() => setIsOpen(false)} />

      <aside className="admin-sidebar">
        {/* Header Masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <img src="/tolani-logo.png" alt="Norex Fashion" style={{ height: "40px", width: "auto", filter: "brightness(0) invert(1)" }} />
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "0.35rem", textAlign: "left" }}>Master Control CMS</p>
          </div>
          {/* Mobile Inner Close Cross */}
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }} className="lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Ecosystem Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 }} onClick={() => setIsOpen(false)}>
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
            {alerts.pendingApplications > 0 && (
              <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
                {alerts.pendingApplications}
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
            {alerts.pendingPayments > 0 && (
              <span style={{ marginLeft: "auto", backgroundColor: "#C9A84C", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
                {alerts.pendingPayments}
              </span>
            )}
          </Link>

          <Link href="/admin/contacts" className="sidebar-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Messages
            {alerts.unreadMessages > 0 && (
              <span style={{ marginLeft: "auto", backgroundColor: "#dc2626", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
                {alerts.unreadMessages}
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
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem", marginTop: "auto" }}>
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}