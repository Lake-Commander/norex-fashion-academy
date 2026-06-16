"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Loader2, GraduationCap, ShoppingBag, User, LogOut, 
  CreditCard, Settings, Eye, BookOpen, Film, Heart, CheckCircle, Save,
  ArrowRight, ShieldCheck, ClipboardList, Activity, MapPin, PhoneCall
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";

type TabKeys = "overview" | "academy" | "commerce" | "telemetry" | "settings";

export default function EnhancedEcosystemDashboard() {
  // ⚡ Defensive Safeguard: Fallback to a safe object structure if useSession evaluates to undefined
  const sessionContext = useSession();
  const { data: session, status } = sessionContext || { data: null, status: "loading" };

  const router = useRouter();
  const { cart, wishlist, toggleWishlist } = useShop();

  const [activeTab, setActiveTab] = useState<TabKeys>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Edit Settings Form Local States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
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
        setBillingAddress(json.profile.billingAddress || "");
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
        body: JSON.stringify({ name, phone, whatsapp, shippingAddress, billingAddress })
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        if ((window as any).soundEnabled !== false) sounds.playSuccess();
        await loadDashboardEcosystem();
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      alert("Failed updating setting credentials profile parameters.");
    } finally {
      setUpdating(false);
    }
  };

  const goldColor = "#C9A84C";

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Syncing Ecosystem Nodes...</p>
      </div>
    );
  }

  const profile = data?.profile || {};
  const applications = data?.applications || [];
  const orders = data?.orders || [];
  const payments = data?.payments || [];

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 text-left antialiased font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      <style>{`
        .dash-layout-container { max-w: 7xl; width: 100%; mx: auto; display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 9rem 1.5rem 6rem 1.5rem; }
        @media(min-width: 1024px) { .dash-layout-container { grid-template-columns: 300px 1fr; } }
        
        .panel-sidebar { background: white; border: 1px solid #e4e4e7; border-top: 3px solid #C9A84C; p: 1.75rem; border-radius: 2px; height: fit-content; }
        .panel-viewport { background: white; border: 1px solid #e4e4e7; p: 2.25rem; border-radius: 2px; min-height: 580px; }
        
        .tab-trigger-link { width: 100%; display: flex; align-items: center; justify-content: space-between; p: 0.9rem 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; background: none; border: none; cursor: pointer; border-radius: 2px; transition: all 0.2s ease; text-align: left; color: #555; border-left: 2px solid transparent; }
        .tab-trigger-link:hover { background-color: #fcfbf9; color: #C9A84C; border-left-color: #f0ebe3; }
        .tab-trigger-link.active { background-color: #1a1a1a; color: white; border-left-color: #C9A84C; }
        
        .form-field-entry { width: 100%; border: 1px solid #e4e4e7; p: 0.85rem 1rem; font-size: 0.85rem; background: #FCFAF7; transition: all 0.2s; border-radius: 2px; outline: none; }
        .form-field-entry:focus { border-color: #C9A84C; background: white; box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.08); }
        
        .template-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 2px; border: 1px solid transparent; }
        .spec-table-row { display: flex; align-items: center; justify-content: space-between; py: 1rem; border-bottom: 1px solid #f4f4f5; }
        .spec-table-row:last-child { border-bottom: none; }

        .metric-mini-card { background: #FCFAF7; border: 1px solid #e4e4e7; padding: 1.25rem; border-radius: 2px; transition: all 0.3s ease; }
        .metric-mini-card:hover { border-color: #C9A84C; background: white; transform: translateY(-1px); }

        .telemetry-row-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem; background: #FCFAF7; border: 1px solid #e4e4e7; border-radius: 2px; font-family: monospace; font-size: 0.75rem; text-transform: uppercase; }
      `}</style>

      <div className="dash-layout-container mx-auto">
        
        {/* Left Side Navigation Engine */}
        <aside className="panel-sidebar space-y-6 shadow-sm">
          <div className="text-center space-y-3 border-b pb-5">
            <div className="h-16 w-16 bg-zinc-900 border-2 border-[#C9A84C] rounded-full mx-auto flex items-center justify-center text-white font-mono text-xl font-bold uppercase overflow-hidden shadow-sm">
              {profile.image ? <img src={profile.image} alt="" className="w-full h-full object-cover" /> : <span>{profile.name?.substring(0,2)}</span>}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide truncate">{profile.name}</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 lowercase border border-zinc-100 bg-zinc-50 px-2 py-0.5 rounded-sm">
                <ShieldCheck size={11} className="text-[#C9A84C]" /> User Profile
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <button type="button" onClick={() => handleTabSwitch("overview")} className={`tab-trigger-link ${activeTab === "overview" ? "active" : ""}`}>
              <span className="flex items-center gap-2.5"><User size={14} /> Account Overview</span>
              <ArrowRight size={12} className="opacity-40" />
            </button>
            <button type="button" onClick={() => handleTabSwitch("academy")} className={`tab-trigger-link ${activeTab === "academy" ? "active" : ""}`}>
              <span className="flex items-center gap-2.5"><GraduationCap size={14} /> Academy & Apps</span>
              <ArrowRight size={12} className="opacity-40" />
            </button>
            <button type="button" onClick={() => handleTabSwitch("commerce")} className={`tab-trigger-link ${activeTab === "commerce" ? "active" : ""}`}>
              <span className="flex items-center gap-2.5"><ShoppingBag size={14} /> Orders & Invoices</span>
              <ArrowRight size={12} className="opacity-40" />
            </button>
            <button type="button" onClick={() => handleTabSwitch("telemetry")} className={`tab-trigger-link ${activeTab === "telemetry" ? "active" : ""}`}>
              <span className="flex items-center gap-2.5"><Eye size={14} /> Browsing Metrics</span>
              <ArrowRight size={12} className="opacity-40" />
            </button>
            <button type="button" onClick={() => handleTabSwitch("settings")} className={`tab-trigger-link ${activeTab === "settings" ? "active" : ""}`}>
              <span className="flex items-center gap-2.5"><Settings size={14} /> Edit Settings</span>
              <ArrowRight size={12} className="opacity-40" />
            </button>
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="tab-trigger-link text-red-500 hover:bg-red-50 hover:text-red-700 mt-6 border-t pt-4">
              <span className="flex items-center gap-2.5"><LogOut size={14} /> Secure Exit</span>
            </button>
          </nav>
        </aside>

        {/* Right Side Viewport Frame */}
        <section className="panel-viewport shadow-sm">
          
          {/* TAB 1: ACCESSIBLE OVERVIEW MATRIX */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">REAL-TIME PORTAL ACTIVITY</span>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Ecosystem Overview</h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase hidden sm:block">ID Reference: {profile.email}</span>
              </div>

              {/* Grid Statistics Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="metric-mini-card">
                  <p className="text-2xl font-black font-mono tracking-tight text-zinc-900">{applications.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Applications</p>
                </div>
                <div className="metric-mini-card">
                  <p className="text-2xl font-black font-mono tracking-tight text-zinc-900">{orders.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Shop Orders</p>
                </div>
                <div className="metric-mini-card">
                  <p className="text-2xl font-black font-mono tracking-tight text-zinc-900">{wishlist.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Saved Items</p>
                </div>
                <div className="metric-mini-card">
                  <p className="text-2xl font-black font-mono tracking-tight text-[#C9A84C]">{cart.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Active Cart</p>
                </div>
              </div>

              {/* Layout Block Splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Wishlist Box */}
                <div className="border border-zinc-200 p-5 rounded-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Heart size={14} className="text-[#C9A84C] fill-current" /> My Pinned Wishlist ({wishlist.length})
                    </h3>
                    <button type="button" onClick={() => handleTabSwitch("telemetry")} className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase tracking-wider hover:text-zinc-900">View Footprints</button>
                  </div>
                  {wishlist.length === 0 ? (
                    <p className="text-xs font-mono uppercase text-zinc-400 py-4 text-center">No catalog selections pinned.</p>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                      {wishlist.map((item: any) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                          <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[200px]">{item.name}</span>
                          <button type="button" onClick={() => toggleWishlist(item)} className="text-[10px] font-mono text-red-500 uppercase font-bold hover:text-red-700 bg-transparent border-none cursor-pointer">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Cart Box */}
                <div className="border border-zinc-200 p-5 rounded-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-zinc-800" /> Active Shopping Cart ({cart.length})
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Unsaved Draft</span>
                  </div>
                  {cart.length === 0 ? (
                    <p className="text-xs font-mono uppercase text-zinc-400 py-4 text-center">Your basket is clear.</p>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                      {cart.map((item: any) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                          <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[200px] font-bold">
                            {item.name} <span className="text-[10px] text-zinc-400 font-mono font-medium">({item.orderQuantity}x)</span>
                          </span>
                          <span className="font-mono text-zinc-500 font-bold">{formatPrice(item.price * item.orderQuantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: ACADEMY PORTFOLIO MANIFESTS */}
          {activeTab === "academy" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">REGISTRY ARCHIVE LINES</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Academy Portfolio Files</h2>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-200 rounded-sm font-mono text-xs uppercase text-zinc-400">
                  No institutional submission files match this digital ledger signature.
                </div>
              ) : (
                <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                  <div className="p-4 bg-zinc-50 border-b border-zinc-200 grid grid-cols-12 text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-7 sm:col-span-8 text-left">Syllabus Program Course</div>
                    <div className="col-span-5 sm:col-span-4 text-right">Matriculation Status</div>
                  </div>
                  <div className="divide-y divide-zinc-100 p-4">
                    {applications.map((app: any) => (
                      <div key={app._id} className="grid grid-cols-12 py-3.5 items-center">
                        <div className="col-span-7 sm:col-span-8 text-left">
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{app.course}</h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5 font-bold uppercase">Index Target Node: #{app._id.substring(16).toUpperCase()}</p>
                        </div>
                        <div className="col-span-5 sm:col-span-4 text-right">
                          <span className={`template-badge ${
                            app.status === "pending" ? "bg-amber-50 text-amber-800 border-amber-200" :
                            app.status === "approved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}>{app.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MASTER INVOICES & STATEMENTS LEDGER */}
          {activeTab === "commerce" && (
            <div className="space-y-10 animate-fade-in">
              {/* Box 1: Retail Store Invoices */}
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">ACQUISITION TRANSACTIONS REGISTER</span>
                  <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Storefront Invoices Ledger</h2>
                </div>
                {orders.length === 0 ? (
                  <p className="text-center py-12 border border-dashed border-zinc-200 font-mono text-xs uppercase text-zinc-400">No storefront retail invoice records logs indexed.</p>
                ) : (
                  <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                    <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                      <span>Invoice Key Descriptor</span>
                      <span>Total Value & Status</span>
                    </div>
                    <div className="divide-y divide-zinc-100 px-4">
                      {orders.map((o: any) => (
                        <div key={o._id} className="spec-table-row">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Invoice #{o._id.substring(16).toUpperCase()}</h4>
                            <p className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase font-medium">Pipeline: {o.paymentGateway || "WhatsApp Order Call"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black font-mono text-zinc-900">{formatPrice(o.totalAmount || o.price || 0)}</p>
                            <span className="text-[9px] font-mono uppercase font-black text-[#C9A84C] block mt-0.5">{o.paymentStatus || "Processing"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Box 2: Tuition Statements */}
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2">
                  <CreditCard size={15} className="text-[#C9A84C]" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400">Academy Tuition Financial Invoices</h3>
                </div>
                {payments.length === 0 ? (
                  <p className="text-left text-xs font-mono text-zinc-400 uppercase py-2">No institutional program receipts cleared.</p>
                ) : (
                  <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                    <div className="divide-y divide-zinc-100 px-4">
                      {payments.map((p: any) => (
                        <div key={p._id} className="spec-table-row">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{p.course || "Studio Training Tuition Block"}</h4>
                            <p className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase font-bold">Route: {p.bankName || "Manual Wire Transfer"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black font-mono text-[#C9A84C]">{formatPrice(p.amount)}</p>
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-widest border px-2 py-0.5 rounded-sm mt-1 inline-block ${
                              p.status === "confirmed" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}>{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED NAVIGATION FOOTPRINTS */}
          {activeTab === "telemetry" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">INTERACTION SIGNAL HISTORIES</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Browsing & Reading Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Section A: Gazette History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><BookOpen size={13} className="text-[#C9A84C]" /> Gazette Read Logs</h4>
                  {profile.readHistory?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase italic">No editorial tracks captured.</p>
                  ) : (
                    <div className="space-y-2">
                      {profile.readHistory.map((articleId: string, i: number) => (
                        <div key={i} className="telemetry-row-item truncate">
                          <Activity size={12} className="text-zinc-400" /> <span>Doc Ref Code: #{articleId.substring(18)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section B: Video Playback */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><Film size={13} /> Cinema Film Watch Logs</h4>
                  {profile.watchHistory?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase italic">No streaming tracking signatures logged.</p>
                  ) : (
                    <div className="space-y-2">
                      {profile.watchHistory.map((videoId: string, i: number) => (
                        <div key={i} className="telemetry-row-item truncate">
                          <Film size={12} className="text-[#C9A84C]" /> <span>Stream Capture: #{videoId.substring(0, 12)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section C: Checked Garments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><ShoppingBag size={13} /> Products Recently Checked</h4>
                  {profile.recentlyViewedProducts?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase italic">No showroom vectors scanned.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {profile.recentlyViewedProducts.map((pId: string, i: number) => (
                        <div key={i} className="p-2 border border-zinc-200 font-mono text-[10px] rounded-sm uppercase tracking-tight text-center font-bold bg-zinc-50 text-zinc-500 truncate">
                          ID-{pId.substring(18)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section D: Checked Programs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><GraduationCap size={13} /> Courses Recently Checked</h4>
                  {profile.recentlyViewedCourses?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase italic">No academic courses profiles scanned.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {profile.recentlyViewedCourses.map((cId: string, i: number) => (
                        <div key={i} className="p-2 border border-zinc-200 font-mono text-[10px] rounded-sm uppercase tracking-tight text-center font-bold bg-zinc-50 text-zinc-500 truncate">
                          Syllabus-{cId.substring(20)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: REHUB TEMPLATE FORM MANAGEMENT */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">PROFILE MODIFICATION MODULE</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Edit Profile Settings</h2>
              </div>

              <form onSubmit={handleUpdateProfileDetails} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><User size={11} /> Legal Account Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-field-entry" />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><PhoneCall size={11} /> Primary Voice Phone</label>
                    <input type="text" placeholder="+234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="form-field-entry" />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><Sparkles size={11} /> WhatsApp Broadcast Line</label>
                    <input type="text" placeholder="+234..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="form-field-entry" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><MapPin size={11} /> Default Shipping Destination Coordinates</label>
                    <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="form-field-entry font-light resize-none" placeholder="Provide full shipping tracks and landmarks..." />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><ClipboardList size={11} /> Institutional Billing Address</label>
                    <textarea rows={3} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="form-field-entry font-light resize-none" placeholder="Provide matching card or invoice wiring specifications..." />
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle size={14} className="text-emerald-600" /> Account profile settings saved successfully.
                  </div>
                )}

                <button type="submit" disabled={updating} style={{ backgroundColor: updating ? "#f4f4f5" : "#1a1a1a" }} className="px-6 py-3.5 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center gap-2 rounded-sm shadow-sm transition-all cursor-pointer border-none active:scale-[0.99]">
                  {updating ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Save size={14} />}
                  <span>Commit Updated Profile</span>
                </button>
              </form>
            </div>
          )}

        </section>
      </div>

      <StyleOracle />
      <Footer />
    </main>
  );
}