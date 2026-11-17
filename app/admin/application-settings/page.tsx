"use client";

import { useEffect, useState } from "react";

export default function ApplicationSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [amount, setAmount] = useState("5000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/application-settings")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load settings.");
        return response.json();
      })
      .then((data) => {
        setEnabled(data.enabled);
        setAmount(String(data.amount));
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/application-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, amount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save settings.");
      setMessage("Application fee settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.35rem" }}>
        Application fee
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Choose whether applicants pay before submitting, and set the amount in Nigerian naira.
      </p>

      <form onSubmit={saveSettings} style={{ background: "white", border: "1px solid #f0ebe3", padding: "2rem" }}>
        {loading ? <p style={{ color: "#6b7280" }}>Loading settings...</p> : (
          <>
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} style={{ marginTop: "0.25rem" }} />
              <span>
                <strong style={{ display: "block", color: "#1a1a1a", marginBottom: "0.25rem" }}>Require an application fee</strong>
                <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Turn this off to let applicants submit without payment.</span>
              </span>
            </label>
            <label style={{ display: "block", color: "#1a1a1a", fontSize: "0.85rem", fontWeight: 600 }}>
              Fee amount (₦)
              <input
                type="number"
                min={enabled ? "1" : "0"}
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={!enabled}
                required
                style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.8rem", border: "1px solid #d4d4d8", background: enabled ? "white" : "#f4f4f5", color: "#1a1a1a" }}
              />
            </label>
            <button type="submit" disabled={saving} style={{ marginTop: "1.5rem", background: "#1a1a1a", color: "white", border: 0, padding: "0.85rem 1.5rem", cursor: saving ? "wait" : "pointer" }}>
              {saving ? "Saving..." : "Save settings"}
            </button>
            {message && <p style={{ marginTop: "1rem", color: message.includes("saved") ? "#166534" : "#b91c1c", fontSize: "0.85rem" }}>{message}</p>}
          </>
        )}
      </form>
    </div>
  );
}
