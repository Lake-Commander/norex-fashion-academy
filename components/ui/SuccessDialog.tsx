"use client";

import { useEffect } from "react";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "application" | "contact";
  name: string;
}

export default function SuccessModal({ isOpen, onClose, type, name }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isApplication = type === "application";
  const goldColor = "#C9A84C";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(26, 26, 26, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FCFAF7",
          width: "100%",
          maxWidth: "460px",
          padding: "3.5rem 2rem 2.5rem",
          textAlign: "center",
          position: "relative",
          border: "1px solid #f0ebe3",
          borderRadius: "2px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)",
          animation: "modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(25px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes checkDraw {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
          }

          /* --- Luxury Interactive Transitions --- */
          .sm-btn-primary {
            display: block;
            background-color: #1a1a1a;
            color: white;
            padding: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .sm-btn-primary:hover {
            background-color: ${goldColor};
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(201, 168, 76, 0.25);
          }

          .sm-btn-whatsapp {
            display: block;
            background-color: #25D366;
            color: white;
            padding: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .sm-btn-whatsapp:hover {
            background-color: #20b558;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.25);
          }

          .sm-btn-outline {
            display: block;
            width: 100%;
            border: 1px solid #e5e7eb;
            background-color: transparent;
            color: #6b7280;
            padding: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            font-family: inherit;
            border-radius: 2px;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .sm-btn-outline:hover {
            border-color: #1a1a1a;
            color: #1a1a1a;
            background-color: #FAF7F4;
          }

          .sm-close-x {
            position: absolute; top: 1.25rem; right: 1.25rem;
            background: none; border: none; cursor: pointer;
            color: #a1a1aa; padding: 0.25rem;
            display: flex; align-items: center; justify-content: center;
            transition: color 0.2s ease;
          }
          .sm-close-x:hover {
            color: #1a1a1a;
          }
        `}</style>

        {/* Top Dismiss Trigger */}
        <button onClick={onClose} className="sm-close-x">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Minimal Luxury Animated Badge Circumference */}
        <div style={{ width: "90px", height: "90px", margin: "0 auto 2rem", animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <circle cx="60" cy="60" r="54" fill="rgba(201, 168, 76, 0.04)" stroke={goldColor} strokeWidth="3" />
            <polyline
              points="38,62 53,77 84,46"
              stroke={goldColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{ animation: "checkDraw 0.6s ease 0.2s both" }}
            />
          </svg>
        </div>

        {/* Dynamic Context Header Details */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "1.5rem",
            fontWeight: 700, color: "#1a1a1a",
            marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.02em"
          }}>
            {isApplication ? "Registry Verified" : "Message Forwarded"}
          </h2>
          <p style={{
            fontSize: "0.85rem", color: "#6b7280",
            lineHeight: 1.8, maxWidth: "340px", margin: "0 auto",
          }}>
            {isApplication
              ? `Thank you, ${name}. We have received your application file parameters and will follow up with an evaluation inside 48 hours.`
              : `Thank you, ${name}. We have received your message down at the atelier desk and will be in touch within 24 hours.`}
          </p>
        </div>

        <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "1.5rem" }} />

        {/* Interactive Actions Layout Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {isApplication ? (
            <>
              <Link href="/academy/courses" onClick={onClose} className="sm-btn-primary">
                Explore Courses
              </Link>
              <button onClick={onClose} className="sm-btn-outline">
                Dismiss Panel
              </button>
            </>
          ) : (
            <>
              <a href="https://wa.me/2349043371380" target="_blank" rel="noopener noreferrer" className="sm-btn-whatsapp">
                Chat on WhatsApp
              </a>
              <button onClick={onClose} className="sm-btn-outline">
                Dismiss Panel
              </button>
            </>
          )}
        </div>

        <p style={{ fontSize: "0.65rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginTop: "1.75rem", marginBottom: 0 }}>
          Live Automated Notification Dispatched
        </p>
      </div>
    </div>
  );
}