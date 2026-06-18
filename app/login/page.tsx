"use client";

import { useState } from "react";
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const { soundEnabled } = useShop(); // Adaptable to useAppState fallback cleanly
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      if (soundEnabled) sounds.playPop();
      setErrorMessage("Please fill in all credentials.");
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    if (soundEnabled) sounds.playSweep();

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (response?.error) {
        setErrorMessage(response.error || "Handshake rejected. Verify authorization fields.");
        if (soundEnabled) sounds.playPop();
        setLoading(false);
      } else {
        if (soundEnabled) sounds.playSuccess();
        router.push("/dashboard");
        router.refresh(); // Forces Next.js to re-read updated live session tokens matrices
      }
    } catch (err) {
      setErrorMessage("Authentication pipeline interface timeout.");
      setLoading(false);
    }
  };

  return (
    //  FIX: Added top padding ('pt-20') to safely offset your fixed custom navigation banner height
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left pt-20">
      <Header />
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)] border-b border-zinc-200">
        
        {/* Left Side: Immersive Editorial Graphic Column */}
        <div className="hidden lg:block lg:col-span-7 relative bg-zinc-900 overflow-hidden">
          <img 
            src="/runway/look-05.png" 
            onError={(e)=>{e.currentTarget.src="/placeholder-garment.png"}}
            alt="NOREX Editorial Campaign" 
            className="absolute inset-0 w-full h-full object-cover grayscale select-none scale-[1.01] opacity-75" 
          />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-left text-white space-y-3 z-10">
            <span className="text-[10px] font-mono tracking-[0.35em] text-[#C9A84C] uppercase font-black">NOREX ATELIER ACCESS</span>
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl font-bold uppercase tracking-tight max-w-lg leading-tight">A Bespoke Identity for Creative Minds</h2>
            <p className="text-xs text-gray-300 font-mono tracking-wider max-w-md font-light">Access the exclusive digital wardrobe, retrieve customized studio measurements, and synchronize style matrices dynamically.</p>
          </div>
        </div>

        {/* Right Side: Editorial Form Panel */}
        <div className="lg:col-span-5 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-white relative">
          <div className="w-full max-w-sm space-y-7 text-left z-10">
            <div className="space-y-2.5">
              <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)", color: "#C9A84C" }} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-widest font-black font-mono">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>MEMBERS PORTAL</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">Sign In</h1>
              <p className="text-xs text-zinc-400 font-light">Enter your registry credentials to synchronize style profiles logs.</p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-[11px] font-mono rounded-sm tracking-wide flex items-center gap-1.5"><ShieldAlert size={14} /> <span>{errorMessage}</span></div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> <span>Identity Email</span></label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onFocus={handleInteract} placeholder="name@example.com" style={{ borderRadius: "2px" }} className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200 text-xs focus:outline-none focus:border-[#C9A84C] text-zinc-900 font-mono" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400">
                  <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> <span>Password</span></span>
                  <Link href="/forgot-password" onClick={handleInteract} className="hover:text-[#C9A84C] transition-colors text-[9px] font-bold text-zinc-400 text-decoration-none">Forgot?</Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={handleInteract} placeholder="••••••••" style={{ borderRadius: "2px" }} className="w-full pl-4 pr-12 py-3.5 bg-zinc-50/50 border border-zinc-200 text-xs focus:outline-none focus:border-[#C9A84C] text-zinc-900 font-mono" />
                  <button type="button" onClick={() => { handleInteract(); setShowPassword(!showPassword); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900 bg-transparent border-none cursor-pointer">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ borderRadius: "2px" }} className="w-full py-3.5 bg-zinc-900 text-white hover:bg-[#C9A84C] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 border-none active:scale-[0.99]">
                {loading ? <span>SYNCHRONIZING ATELIER...</span> : <><span className="font-mono tracking-widest">Enter House</span> <ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-zinc-200" /><span className="flex-shrink mx-4 text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Or Multi-Channel</span><div className="flex-grow border-t border-zinc-200" /></div>

              <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} style={{ borderRadius: "2px" }} className="w-full py-3 border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-8.16 3.28-13.39z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                <span>Authorize via Google ID</span>
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-400 space-y-2 font-mono">
              <p>First time? <Link href="/signup" onClick={handleInteract} className="text-zinc-900 font-bold hover:underline text-decoration-none">Create bespoke account</Link></p>
            </div>
          </div>
        </div>
      </section>
      <StyleOracle /><Footer />
    </main>
  );
}