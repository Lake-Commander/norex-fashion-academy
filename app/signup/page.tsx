"use client";

import { useState } from "react";
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const { soundEnabled } = useShop();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stylePreference, setStylePreference] = useState("minimalist");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      if (soundEnabled) sounds.playPop();
      setErrorMessage("Please fill in all registry fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    if (soundEnabled) sounds.playSweep();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, stylePreference }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        if (soundEnabled) sounds.playSuccess();
        setTimeout(() => router.push("/login"), 1800);
      } else {
        setErrorMessage(data.error || "Profile ledger configuration failure.");
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage("Network cluster exception drop.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)] border-b border-zinc-200">
        
        {/* Left Side Campaign Feature Box */}
        <div className="hidden lg:block lg:col-span-7 relative bg-zinc-900 overflow-hidden">
          <img src="/runway/look-07.png" onError={(e)=>{e.currentTarget.src="/placeholder-garment.png"}} alt="NOREX Campaign" className="absolute inset-0 w-full h-full object-cover grayscale select-none scale-[1.01] opacity-75" />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-left text-white space-y-3 z-10">
            <span className="text-[10px] font-mono tracking-[0.35em] text-[#C9A84C] uppercase font-black">NOREX BESPOKE REGISTRY</span>
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl font-bold uppercase tracking-tight max-w-lg leading-tight">Crafted Beyond Trends, Tailored For You</h2>
            <p className="text-xs text-gray-300 font-mono tracking-wider max-w-md font-light">Create a personalized style card. Retain measurements for quick checkout, early access to new seasonal collections, and studio academy tracking lines.</p>
          </div>
        </div>

        {/* Right Side Input Forms Panel */}
        <div className="lg:col-span-5 flex items-center justify-center p-8 sm:p-12 bg-white relative">
          <div className="w-full max-w-sm space-y-6 text-left z-10">
            
            {success ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 justify-center items-center"><CheckCircle2 className="h-10 w-10 animate-bounce" /></div>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-black uppercase text-zinc-900">Registry Created</h2>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">Bespoke profile configured successfully. Redirecting to access portal...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
                  <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: "#C9A84C" }} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-widest font-black font-mono"><Sparkles className="h-3 w-3 animate-pulse" /> <span>BESPOKE REGISTER</span></div>
                  <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">Create Profile</h1>
                  <p className="text-xs text-zinc-400 font-light">Register credentials for the House.</p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-[11px] font-mono rounded-sm flex items-center gap-1.5"><ShieldAlert size={14} /> <span>{errorMessage}</span></div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> <span>Full Name</span></label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} onFocus={handleInteract} placeholder="First Name Last Name" style={{ borderRadius: "2px" }} className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 text-xs focus:outline-none focus:border-[#C9A84C] text-zinc-900 font-mono" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> <span>Email Address</span></label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onFocus={handleInteract} placeholder="name@example.com" style={{ borderRadius: "2px" }} className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 text-xs focus:outline-none focus:border-[#C9A84C] text-zinc-900 font-mono" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> <span>Password</span></label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={handleInteract} placeholder="••••••••" style={{ borderRadius: "2px" }} className="w-full pl-4 pr-12 py-3 bg-zinc-50/50 border border-zinc-200 text-xs focus:outline-none focus:border-[#C9A84C] text-zinc-900 font-mono" />
                      <button type="button" onClick={() => { handleInteract(); setShowPassword(!showPassword); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900 bg-transparent border-none cursor-pointer">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 block">Style Profile Preference</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "minimalist", name: "Minimal" },
                        { id: "avantgarde", name: "Avant" },
                        { id: "brutalist", name: "Brutalist" }
                      ].map((item) => (
                        <button key={item.id} type="button" onClick={() => { handleInteract(); setStylePreference(item.id); }} style={{ borderRadius: "2px" }} className={`py-2 px-2.5 text-[10px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${stylePreference === item.id ? "border-zinc-900 bg-zinc-50 text-zinc-900 font-black" : "border-zinc-200 bg-transparent text-zinc-400 hover:border-zinc-400"}`}>{item.name}</button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ borderRadius: "2px" }} className="w-full py-3.5 bg-zinc-900 text-white hover:bg-[#C9A84C] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 border-none active:scale-[0.99] shadow-sm">
                    {loading ? <span>CREATING BESPOKE ENVELOPE...</span> : <><span className="font-mono tracking-widest">Submit Registration</span> <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>

                <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-400 font-mono">
                  <p>Already registered? <Link href="/login" onClick={handleInteract} className="text-zinc-900 font-bold hover:underline text-decoration-none">Sign in here</Link></p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <StyleOracle /><Footer />
    </main>
  );
}