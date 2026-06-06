"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ backgroundColor: "white", padding: "3rem", width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <img src="/tolani-logo.png" alt="Norex Fashion" style={{ height: "60px", width: "auto", margin: "0 auto 1.5rem", display: "block" }} />
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Sign in to manage your academy</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@norexfashion.com"
              required
              style={{ width: "100%", border: "1px solid #e5e7eb", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", border: "1px solid #e5e7eb", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
            />
          </div>
          {error && (
            <p style={{ fontSize: "0.85rem", color: "#dc2626", textAlign: "center", padding: "0.75rem", backgroundColor: "#fee2e2" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#722F37", color: "white", padding: "1rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginTop: "1.5rem" }}>
          Norex Fashion Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}