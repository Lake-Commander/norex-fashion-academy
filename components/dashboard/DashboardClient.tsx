"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Loader2, GraduationCap, ShoppingBag, User, LogOut, 
  Settings, Heart, Save, ArrowRight, ShieldCheck, ClipboardList, 
  MapPin, Check
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; 
import StyleOracle from "@/components/style-oracle";

type TabKeys = "overview" | "academy" | "commerce" | "settings";

export default function EnhancedEcosystemDashboard() {
  const sessionContext = useSession();
  const { data: session, status } = sessionContext || { data: null, status: "loading" };

  const router = useRouter();
  const { cart, wishlist, toggleWishlist } = useShop();

  const [activeTab, setActiveTab] = useState<TabKeys>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const loadDashboardEcosystem = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
        setName(json.profile.name || "");
        setPhone(json.profile.phone || "");
        setWhatsapp(json.profile.whatsapp || "");
        setShippingAddress(json.profile.shippingAddress || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") loadDashboardEcosystem();
  }, [status]);

  const handleTabSwitch = (tab: TabKeys) => {
    setActiveTab(tab);
    if (session && (window as any).soundEnabled !== false) sounds.playSweep();
  };

  const handleUpdateProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, whatsapp, shippingAddress })
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        if ((window as any).soundEnabled !== false) sounds.playSuccess();
        await loadDashboardEcosystem();
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      alert("Failed updating profile settings parameters.");
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Syncing Profile Ecosystem...</p>
      </div>
    );
  }

  const profile = data?.profile || {};
  const applications = data?.applications || [];
  const orders = data?.orders || [];

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-800 text-left antialiased font-sans flex flex-col justify-between overflow-x-hidden pt-24">
      <Header />

      <style>{`
        .kapella-wrapper { max-w: 7xl; width: 100%; margin: 1.5rem auto 4rem auto; padding: 0 1rem; }
        @media(min-width: 768px) { .kapella-wrapper { padding: 0 1.5rem; margin-top: 2rem; } }
        
        /* --- Mobile Responsive Horizontal Swipe Navigation --- */
        .kapella-nav-bar { 
          background: white; 
          display: flex; 
          overflow-x: auto; 
          white-space: nowrap; 
          border: 1px solid #e4e6fc; 
          border-radius: 4px; 
          padding: 0.25rem; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.01);
          -webkit-overflow-scrolling: touch;
        }
        .kapella-nav-bar::-webkit-scrollbar { display: none; }
        
        .kapella-nav-item { 
          display: inline-flex; 
          align-items: center; 
          gap: 0.5rem; 
          padding: 0.75rem 1.25rem; 
          font-size: 0.7rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
          color: #5a5a5a; 
          background: none; 
          border: none; 
          cursor: pointer; 
          border-bottom: 2px solid transparent; 
          transition: all 0.2s ease; 
          flex-shrink: 0;
        }
        .kapella-nav-item:hover { color: #C9A84C; }
        .kapella-nav-item.active { color: #C9A84C; border-bottom-color: #C9A84C; font-weight: 800; }
        
        /* --- Studio Cards --- */
        .kapella-card { background: white; border: 1px solid #e4e6fc; padding: 1.25rem; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.01); height: 100%; }
        @media(min-width: 768px) { .kapella-card { padding: 1.75rem; } }
        
        .k-input { width: 100%; border: 1px solid #e4e6fc; padding: 0.75rem 1rem; font-size: 0.85rem; color: #1a1a1a; background: #fff; outline: none; border-radius: 3px; transition: border 0.2s; }
        .k-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.05); }

        .template-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 2px; }
        .spec-table-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #f4f4f5; }
        .spec-table-row:last-child { border-bottom: none; }
      `}</style>

      <div className="kapella-wrapper space-y-6">
        
        {/* Navigation Tabs Layer */}
        <nav className="kapella-nav-bar">
          <button type="button" onClick={() => handleTabSwitch("overview")} className={`kapella-nav-item ${activeTab === "overview" ? "active" : ""}`}>
            <User size={14} /> <span>Overview</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("commerce")} className={`kapella-nav-item ${activeTab === "commerce" ? "active" : ""}`}>
            <ShoppingBag size={14} /> <span>Orders</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("academy")} className={`kapella-nav-item ${activeTab === "academy" ? "active" : ""}`}>
            <GraduationCap size={14} /> <span>Academy</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("settings")} className={`kapella-nav-item ${activeTab === "settings" ? "active" : ""}`}>
            <Settings size={14} /> <span>Settings</span>
          </button>
          <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="kapella-nav-item text-red-500 hover:text-red-700 ml-auto">
            <LogOut size={14} /> <span>Sign Out</span>
          </button>
        </nav>

        {/* Dynamic Welcome Heading */}
        <div className="px-1 py-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Welcome, {name || "Client"}</h2>
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-1">Registry Identity Passport: {profile.email}</p>
        </div>

        {/* ================= CONDITION A: OVERVIEW PANEL ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Account Profile Snapshot Summary */}
              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><ShieldCheck size={13} /> Account Summary</h3>
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between text-xs border-b pb-2">
                    <span className="text-zinc-400">Total Store Orders</span>
                    <span className="font-bold font-mono text-zinc-900">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b pb-2">
                    <span className="text-zinc-400">Academy Submissions</span>
                    <span className="font-bold font-mono text-zinc-900">{applications.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Items inside Wishlist</span>
                    <span className="font-bold font-mono text-zinc-900">{wishlist.length} saved</span>
                  </div>
                </div>
              </div>

              {/* Shopping Bag Summary Badge */}
              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><ShoppingBag size={13} /> Bag Utilization</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-black font-mono text-zinc-900">{cart.length} / 10 Pieces</p>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="bg-[#C9A84C] h-full transition-all" style={{ width: `${Math.min((cart.length / 10) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide pt-1">Current Value: <span className="font-bold text-zinc-900">{formatPrice(cart.reduce((acc, item) => acc + (item.price * item.orderQuantity), 0))}</span></p>
                </div>
              </div>

              {/* Dynamic Action Panel Block */}
              <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2d2a2e] text-white rounded-sm flex flex-col justify-between shadow-sm min-h-[160px]">
                <div className="space-y-1">
                  <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-bold">
                    <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                    <span>Profile Registered</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg uppercase tracking-tight text-white font-bold pt-1">Atelier Registry</h3>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed font-serif italic pt-2">
                  Your custom measurement metrics, active wishlists, and order invoice ledgers are securely synchronized.
                </p>
                <button type="button" onClick={() => handleTabSwitch("commerce")} className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#C9A84C] text-left inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent pt-3">Manage Orders <ArrowRight size={12} /></button>
              </div>

            </div>

            {/* Layout Grid: Wishlist Snapshot split pane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 border-b pb-2 flex items-center gap-1.5"><Heart size={13} className="text-[#C9A84C] fill-current" /> Pinned Showroom Selections</h3>
                {wishlist.length === 0 ? (
                  <p className="text-xs font-mono uppercase text-zinc-400 text-center py-6">No showroom pieces pinned.</p>
                ) : (
                  <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                    {wishlist.map((item: any) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs font-semibold">
                        <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[240px]">{item.name}</span>
                        <button type="button" onClick={() => toggleWishlist(item)} className="text-[10px] font-mono text-red-500 uppercase font-bold bg-transparent border-none cursor-pointer">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 border-b pb-2 flex items-center gap-1.5"><ShoppingBag size={13} /> Active Bag Breakdown</h3>
                {cart.length === 0 ? (
                  <p className="text-xs font-mono uppercase text-zinc-400 text-center py-6">Your shopping bag is clear.</p>
                ) : (
                  <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                    {cart.map((item: any) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="uppercase text-zinc-900 truncate tracking-wide font-bold">{item.name} <strong className="text-[10px] text-zinc-400 font-mono">({item.orderQuantity}x)</strong></span>
                        <span className="font-mono text-zinc-500 font-bold">{formatPrice(item.price * item.orderQuantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= CONDITION B: STOREFRONT COMMERCE INVOICES ================= */}
        {activeTab === "commerce" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">TRANSACTION HISTORY</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Storefront Invoices Ledger</h2>
            </div>
            {orders.length === 0 ? (
              <p className="text-center py-12 border border-dashed border-zinc-200 font-mono text-xs uppercase text-zinc-400 rounded-sm">No historical storefront orders processed.</p>
            ) : (
              <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                  <span>Tracking Token</span>
                  <span>Value & Status</span>
                </div>
                <div className="divide-y divide-zinc-100 px-4">
                  {orders.map((o: any) => (
                    <div key={o._id} className="spec-table-row">
                      <div className="text-left pr-2">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Order #{o._id.substring(16).toUpperCase()}</h4>
                        <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase font-medium">Channel: {o.paymentGateway || "WhatsApp Outbound Link"}</p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className="text-xs font-black font-mono text-zinc-900">{formatPrice(o.totalAmount || o.price || 0)}</p>
                        <span className="text-[9px] font-mono uppercase font-black text-[#C9A84C] block mt-0.5">{o.paymentStatus || "Processing"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= CONDITION C: ACADEMY FILES PORTFOLIO ================= */}
        {activeTab === "academy" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">ADMISSIONS WORKFLOW TRACKING</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Academy Application Profiles</h2>
            </div>

            {applications.length === 0 ? (
              <p className="text-center py-12 border border-dashed border-zinc-200 font-mono text-xs uppercase text-zinc-400 rounded-sm">No active academy profiles matched to this passport identifier.</p>
            ) : (
              <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                <div className="p-4 bg-zinc-50/50 border-b border-zinc-200 grid grid-cols-12 text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                  <div className="col-span-8 text-left">Registered Syllabus Target</div>
                  <div className="col-span-4 text-right">Review Status</div>
                </div>
                <div className="divide-y divide-zinc-100 p-4">
                  {applications.map((app: any) => (
                    <div key={app._id} className="grid grid-cols-12 py-3.5 items-center">
                      <div className="col-span-8 text-left pr-2">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{app.course}</h4>
                        <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase font-medium">Ledger Index: #{app._id.toUpperCase().substring(14)}</p>
                      </div>
                      <div className="col-span-4 text-right">
                        <span className={`template-badge border ${
                          app.status === "pending" ? "bg-amber-50 text-amber-800 border-amber-200" :
                          app.status === "approved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-zinc-50 text-zinc-800 border-zinc-200"
                        }`}>{app.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= CONDITION D: PROFILE ATTRIBUTES EDITOR ================= */}
        {activeTab === "settings" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">PROFILE ATTRIBUTES CONFIGURATION</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Edit Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdateProfileDetails} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><User size={11} /> Profile Identity Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="k-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><ShoppingBag size={11} /> Primary Voice Line</label>
                  <input type="text" placeholder="+234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="k-input font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><Sparkles size={11} /> WhatsApp Contact Routing</label>
                  {/* ✅ FIXED: Corrected setWorkspace to setWhatsapp */}
                  <input type="text" placeholder="+234..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="k-input font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><MapPin size={11} /> Shipping Destination Address</label>
                <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="k-input font-light resize-none" placeholder="Provide complete shipping addresses, landmarks, and structural delivery details..." />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 animate-fade-in"><Check size={14} className="text-emerald-600" /> Profile parameters updated successfully.</div>
              )}

              <button type="submit" disabled={updating} style={{ backgroundColor: updating ? "#e4e4e7" : "#1a1a1a" }} className="w-full md:w-auto px-6 py-3.5 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center justify-center gap-2 rounded-sm transition-all border-none cursor-pointer shadow active:scale-[0.99]">
                {updating ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <ClipboardList size={13} />}
                <span>Save Registry Changes</span>
              </button>
            </form>
          </div>
        )}

      </div>

      <StyleOracle />
      <Footer />
    </main>
  );
}