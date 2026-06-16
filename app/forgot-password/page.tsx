"use client";

import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const { soundEnabled } = useShop();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        if (soundEnabled) sounds.playSuccess();
      } else {
        setError(json.error || "Failed sending recovery code.");
      }
    } catch {
      setError("SMTP Network failure occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 text-left flex flex-col justify-between pt-32">
      <Header />
      <div className="max-w-md w-full mx-auto bg-white border border-zinc-200 p-8 rounded-sm shadow-sm my-auto">
        {success ? (
          <div className="text-center space-y-3 py-6 animate-fade-in">
            <CheckCircle className="h-10 w-10 text-[#C9A84C] mx-auto animate-pulse" />
            <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase">Transmission Complete</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Check your mailbox folder references. If registered, an initialization reset key link has arrived.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-black uppercase text-zinc-900">Recover Access</h2>
              <p className="text-xs text-zinc-400 font-light">Input your verified registry account email below to authorize a structural password recovery handshake token link.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><Mail size={13} /> Account Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 text-xs font-mono focus:border-[#C9A84C] outline-none bg-zinc-50" placeholder="student@norexfashion.com" style={{ borderRadius: "2px" }} />
            </div>
            {error && <p className="text-xs text-red-600 font-mono font-bold uppercase">{error}</p>}
            <button type="submit" disabled={loading} style={{ borderRadius: "2px" }} className="w-full py-3.5 bg-zinc-900 hover:bg-[#C9A84C] text-white font-mono text-xs uppercase font-bold tracking-widest cursor-pointer border-none flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="tracking-widest">Transmit Recovery Keys</span> <ArrowRight size={14} /></>}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}