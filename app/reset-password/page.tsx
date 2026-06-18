"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Save, Loader2, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ResetFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Missing context token reference key signatures.");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🔥 FIX: Mapped local 'password' state variable to the 'newPassword' key expected by the backend API destructuring
        body: JSON.stringify({ token, newPassword: password }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(json.error || "Token expired or authentication key fault.");
      }
    } catch {
      setError("Server validation mutation timeout exception.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-zinc-200 p-8 rounded-sm shadow-sm my-auto">
      {success ? (
        <div className="text-center space-y-3 py-6 animate-fade-in">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase">Profile Mutated</h3>
          <p className="text-xs text-zinc-400">Your custom authentication keys are updated. Routing straight back to entry gates...</p>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1 text-left">
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-black uppercase text-zinc-900">Define New Keys</h2>
            <p className="text-xs text-zinc-400 font-light">Input your secondary crypt-locking password parameters below to re-seal your global user dashboard registry data.</p>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><Lock size={13} /> New Password Shield</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 text-xs font-mono focus:border-[#C9A84C] outline-none bg-zinc-50" placeholder="••••••••" style={{ borderRadius: "2px" }} />
          </div>
          {error && <p className="text-xs text-red-600 font-mono font-bold uppercase text-left">{error}</p>}
          <button type="submit" disabled={loading} style={{ borderRadius: "2px" }} className="w-full py-3.5 bg-zinc-900 hover:bg-[#C9A84C] text-white font-mono text-xs uppercase font-bold tracking-widest cursor-pointer border-none flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save size={14} /> <span className="tracking-widest">Commit New Shield</span></>}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 text-left flex flex-col justify-between pt-32">
      <Header />
      <Suspense fallback={
        <div className="flex justify-center items-center py-24 mx-auto">
          <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        </div>
      }>
        <ResetFormContent />
      </Suspense>
      <Footer />
    </main>
  );
}