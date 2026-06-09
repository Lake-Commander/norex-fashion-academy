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
      <style>{`
        .login-input {
          width: 100%; padding: 0.875rem 1rem; border: 1px solid #e5e7eb; border-radius: 2px;
          font-size: 0.9rem; color: #1a1a1a; outline: none; transition: all 0.3s ease; font-family: inherit;
        }
        .login-input:focus {
          border-color: #C9A84C; box-shadow: 0 0 0 1px #C9A84C;
        }
        
        .login-btn {
          background-color: #C9A84C; color: white; padding: 1rem; font-size: 0.8rem;
          font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none;
          cursor: pointer; transition: all 0.3s ease; border-radius: 2px; font-family: inherit;
        }
        .login-btn:hover:not(:disabled) {
          background-color: #B49542; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
        }
        .login-btn:disabled {
          opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none;
        }
      `}</style>

      <div style={{ backgroundColor: "white", padding: "3rem", width: "100%", maxWidth: "420px", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
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
              className="login-input"
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
              className="login-input"
            />
          </div>
          {error && (
            <p style={{ fontSize: "0.85rem", color: "#dc2626", textAlign: "center", padding: "0.75rem", backgroundColor: "#fee2e2", margin: "0", borderRadius: "2px" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
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