"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["pending", "approved", "enrolled", "rejected"];

export default function ApplicationActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(["/api/admin/applications/", id].join(""), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <style>{`
        .status-btn {
          padding: 0.6rem 1rem; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; border: 1px solid; font-family: inherit; transition: all 0.3s ease;
          border-radius: 2px;
        }
        .status-btn.active {
          background-color: #C9A84C; color: white; border-color: #C9A84C; cursor: default;
        }
        .status-btn:not(.active) {
          background-color: white; color: #6b7280; border-color: #e5e7eb; cursor: pointer;
        }
        .status-btn:not(.active):hover:not(:disabled) {
          border-color: #C9A84C; color: #C9A84C; transform: translateX(2px);
        }
      `}</style>
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, marginBottom: "0.5rem" }}>Update Status</p>
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => updateStatus(s)}
          disabled={loading || s === status}
          className={`status-btn ${s === status ? "active" : ""}`}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {s === status ? `✓ ${s}` : s}
        </button>
      ))}
    </div>
  );
}