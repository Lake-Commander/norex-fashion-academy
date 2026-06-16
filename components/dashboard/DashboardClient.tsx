"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Loader2, GraduationCap, ShoppingBag, User, LogOut, 
  CreditCard, Settings, Eye, BookOpen, Film, Heart, CheckCircle, Save,
  ArrowRight, ShieldCheck, ClipboardList, Activity, MapPin, PhoneCall,
  Info, HelpCircle, Printer, CloudSun, TrendingUp, Check, BarChart2
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; // ✅ Fixed: Removed the invalid '=' syntax error
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

  // ✅ Fixed: Restored the completely missing handleUpdateProfileDetails core function logic
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
    <main className="min-h-screen bg-[#F3F4F7] text-zinc-800 text-left antialiased font-sans flex flex-col justify-between overflow-x-hidden pt-24">
      <Header />

      <style>{`
        .kapella-wrapper { max-w: 7xl; width: 100%; margin: 2rem auto 5rem auto; padding: 0 1.5rem; space-y: 1.5rem; }
        
        /* --- Kapella Top Horizontal Navigation Bar --- */
        .kapella-nav-bar { background: white; display: flex; flex-wrap: wrap; items-center; justify-content: space-around; border: 1px solid #e4e6fc; border-radius: 4px; padding: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .kapella-nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.85rem 1.5rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #5a5a5a; background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s ease; min-width: 110px; }
        .kapella-nav-item:hover { color: #C9A84C; }
        .kapella-nav-item.active { color: #C9A84C; border-bottom-color: #C9A84C; font-weight: 800; }
        
        /* --- Kapella Flat Feature Layout Blocks --- */
        .kapella-card { background: white; border: 1px solid #e4e6fc; padding: 1.75rem; border-radius: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.01); height: 100%; }
        .kapella-sub-text { font-size: 0.75rem; color: #9ca3af; font-weight: 400; line-height: 1.5; }
        
        /* --- Utility Forms System Controls --- */
        .k-input { width: 100%; border: 1px solid #e4e6fc; padding: 0.75rem 1rem; font-size: 0.85rem; color: #1a1a1a; background: #fff; outline: none; border-radius: 3px; transition: border 0.2s; }
        .k-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.05); }

        /* --- Custom CSS Charts Matrices --- */
        .chart-bar-line { width: 100%; height: 12px; background: #e4e6fc; border-radius: 6px; overflow: hidden; display: flex; }
        .donut-ring { width: 90px; height: 90px; border-radius: 50%; background: conic-gradient(#C9A84C 0% 45%, #1a1a1a 45% 75%, #e4e6fc 75% 100%); display: flex; items-center; justify-content: center; }
        .donut-hole { width: 64px; height: 64px; background: white; border-radius: 50%; }
        .telemetry-row-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem; background: #FCFAF7; border: 1px solid #e4e4e7; border-radius: 2px; font-family: monospace; font-size: 0.75rem; text-transform: uppercase; }
        .template-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 2px; border: 1px solid transparent; }
        .spec-table-row { display: flex; align-items: center; justify-content: space-between; py: 1rem; border-bottom: 1px solid #f4f4f5; }
        .spec-table-row:last-child { border-bottom: none; }
      `}</style>

      <div className="kapella-wrapper space-y-6">
        
        {/* Row 1: Horizontal Tab Bar matching layout.PNG top sub-header matrix */}
        <nav className="kapella-nav-bar">
          <button type="button" onClick={() => handleTabSwitch("overview")} className={`kapella-nav-item ${activeTab === "overview" ? "active" : ""}`}>
            <User size={16} /> <span>Dashboard</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("academy")} className={`kapella-nav-item ${activeTab === "academy" ? "active" : ""}`}>
            <GraduationCap size={16} /> <span>Academy Apps</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("commerce")} className={`kapella-nav-item ${activeTab === "commerce" ? "active" : ""}`}>
            <ShoppingBag size={16} /> <span>Shop Orders</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("telemetry")} className={`kapella-nav-item ${activeTab === "telemetry" ? "active" : ""}`}>
            <Eye size={16} /> <span>Metrics Logs</span>
          </button>
          <button type="button" onClick={() => handleTabSwitch("settings")} className={`kapella-nav-item ${activeTab === "settings" ? "active" : ""}`}>
            <Settings size={16} /> <span>Settings</span>
          </button>
          <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="kapella-nav-item text-red-500 hover:text-red-700">
            <LogOut size={16} /> <span>Sign Out</span>
          </button>
        </nav>

        {/* Row 2: Header Section mirroring layout.PNG layout titles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Hi, welcome back!</h2>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-0.5">Clearance Passport Identity Node: {profile.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleTabSwitch("settings")} className="px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 rounded-sm text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-sm"><HelpCircle size={13} /> Details Settings</button>
            <button type="button" onClick={() => window.print()} className="px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 rounded-sm text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-sm"><Printer size={13} /> Print Ledger</button>
          </div>
        </div>

        {/* ================= CONDITION A: MAIN OVERVIEW DESK INTERFACE ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Horizontal Grid Charts Layer mimicking layout.PNG charts structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Graphic Card 1: Sales Difference Horizontal Bar Indicators */}
              <div className="lg:col-span-4 kapella-card space-y-5">
                <div>
                  <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400">Applications Distribution</h3>
                  <p className="text-2xl font-black font-mono text-zinc-900 mt-1">{applications.length} Profiles</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wide"><span>Enrolled Students</span><span className="font-bold">45%</span></div>
                    <div className="chart-bar-line"><div className="bg-[#C9A84C] h-full" style={{ width: "45%" }} /></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wide"><span>Pending Review</span><span className="font-bold">35%</span></div>
                    <div className="chart-bar-line"><div className="bg-[#1a1a1a] h-full" style={{ width: "35%" }} /></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wide"><span>Rejected Logs</span><span className="font-bold">20%</span></div>
                    <div className="chart-bar-line"><div className="bg-zinc-200 h-full" style={{ width: "20%" }} /></div>
                  </div>
                </div>
                <p className="kapella-sub-text italic text-justify pt-1">"Visualizing institutional metric density variations for active fashion admissions folders."</p>
              </div>

              {/* Graphic Card 2: Center Donut Pie Chart Component layout block */}
              <div className="lg:col-span-4 kapella-card space-y-5">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400">Best Seller Channels</h3>
                <div className="flex items-center gap-6 py-2">
                  <div className="donut-ring"><div className="donut-hole" /></div>
                  <div className="space-y-1 text-xs font-mono uppercase">
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#C9A84C] rounded-sm" /> <span>Couture (45%)</span></div>
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#1a1a1a] rounded-sm" /> <span>Academy (30%)</span></div>
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-zinc-200 rounded-sm" /> <span>Ready-Wear (25%)</span></div>
                  </div>
                </div>
                <p className="kapella-sub-text italic text-justify">"Real-time operational density distribution ratio tracking across creative divisions."</p>
              </div>

              {/* Graphic Card 3: Celebration/Notification Banner matching green layout badge panel */}
              <div className="lg:col-span-4 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#2d2a2e] text-white rounded-sm flex flex-col justify-between border border-zinc-800 shadow-md relative overflow-hidden min-h-[260px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-2">
                  <div style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }} className="inline-flex items-center gap-1.5 px-3 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-bold">
                    <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                    <span>SYSTEM NOTIFICATION</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl uppercase tracking-tight text-white font-bold pt-1">Congratulations</h3>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed font-serif italic text-justify">
                  "Your user digital passport ledger references are structured cleanly. Active cart entries, custom wishlists, and portfolio files status arrays are synced."
                </p>
                <button type="button" onClick={() => handleTabSwitch("academy")} className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#C9A84C] text-left inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent">Launch Academy Program <ArrowRight size={12} /></button>
              </div>

            </div>

            {/* Bottom Row Statistics Grid Racks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="kapella-card bg-[#2563eb] border-blue-600 text-white p-5 space-y-4 shadow-sm">
                <div>
                  <p className="text-xl font-bold font-mono tracking-tight">{cart.length} / 10 Items</p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-blue-200 mt-1 font-bold">Active Cart Utilization</p>
                </div>
                <div className="w-full h-1.5 bg-blue-700/50 rounded-full overflow-hidden">
                  <div className="bg-white h-full transition-all" style={{ width: `${(cart.length / 10) * 100}%` }} />
                </div>
              </div>

              <div className="kapella-card p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 font-black uppercase tracking-wider block">Financial Audit Code</span>
                  <h4 style={{ fontFamily: "var(--font-playfair), serif", color: "#C9A84C" }} className="text-2xl font-bold font-mono mt-1">{formatPrice(payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0))}</h4>
                </div>
                <div style={{ height: "1px" }} className="bg-zinc-100 my-2" />
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Cleared Tuition Statements</span>
              </div>

              <div className="kapella-card p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 font-black uppercase tracking-wider block">Pinned Items Count</span>
                  <h4 className="text-2xl font-black font-mono text-zinc-900 mt-1">{wishlist.length} Pinned</h4>
                </div>
                <div style={{ height: "1px" }} className="bg-zinc-100 my-2" />
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Saved Studio Registry</span>
              </div>

              <div className="kapella-card p-5 flex items-center justify-between gap-4 bg-gradient-to-br from-zinc-50 to-zinc-100/50">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase text-zinc-900 truncate">Warri, Delta</h5>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase font-medium">Atelier Station Zone</p>
                  <p className="text-xl font-bold font-mono tracking-tighter text-zinc-800 pt-1">29°C <span className="text-xs text-zinc-400 font-light lowercase">cloudy</span></p>
                </div>
                <div className="p-3 bg-white border border-zinc-200 rounded-sm shadow-inner shrink-0">
                  <CloudSun size={24} className="text-[#C9A84C]" />
                </div>
              </div>
            </div>

            {/* Split Data Lists Matrices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 border-b pb-2 flex items-center gap-1.5"><Heart size={13} className="text-[#C9A84C] fill-current" /> My Saved Showroom Selections</h3>
                {wishlist.length === 0 ? (
                  <p className="text-xs font-mono uppercase text-zinc-400 text-center py-6">No pieces pinned.</p>
                ) : (
                  <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                    {wishlist.map((item: any) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs font-semibold">
                        <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[280px]">{item.name}</span>
                        <button type="button" onClick={() => toggleWishlist(item)} className="text-[10px] font-mono text-red-500 uppercase font-bold bg-transparent border-none cursor-pointer">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="kapella-card space-y-4">
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400 border-b pb-2 flex items-center gap-1.5"><ShoppingBag size={13} /> Unsaved Shopping Bag Items</h3>
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

        {/* ================= CONDITION B: ACADEMY SUBMISSIONS INTERFACES ================= */}
        {activeTab === "academy" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">REGISTRY ARCHIVE LINES</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Academy Portfolio Files</h2>
            </div>

            {applications.length === 0 ? (
              <p className="text-center py-12 border border-dashed border-zinc-200 font-mono text-xs uppercase text-zinc-400 rounded-sm">No active submission profiles maps to this identity node.</p>
            ) : (
              <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                <div className="p-4 bg-zinc-50/50 border-b border-zinc-200 grid grid-cols-12 text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                  <div className="col-span-8 text-left">Syllabus Program Course</div>
                  <div className="col-span-4 text-right">Review Status</div>
                </div>
                <div className="divide-y divide-zinc-100 p-4">
                  {applications.map((app: any) => (
                    <div key={app._id} className="grid grid-cols-12 py-3.5 items-center">
                      <div className="col-span-8 text-left">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{app.course}</h4>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5 font-bold uppercase">Target Ledger: #{app._id.toUpperCase()}</p>
                      </div>
                      <div className="col-span-4 text-right">
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

        {/* ================= CONDITION C: COMMERCE TRANSACTION INVOICES VIEWS ================= */}
        {activeTab === "commerce" && (
          <div className="kapella-card space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">RETAIL STORE ACQUISITION TRANSACTIONS</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Storefront Invoices Ledger</h2>
              </div>
              {orders.length === 0 ? (
                <p className="text-center py-10 border border-dashed border-zinc-200 font-mono text-xs uppercase text-zinc-400 rounded-sm">No historical retail orders processed.</p>
              ) : (
                <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
                  <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                    <span>Invoice Tracking Token</span>
                    <span>Price Value & Status</span>
                  </div>
                  <div className="divide-y divide-zinc-100 px-4">
                    {orders.map((o: any) => (
                      <div key={o._id} className="spec-table-row">
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Invoice #{o._id.substring(16).toUpperCase()}</h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase font-bold text-zinc-400">Dispatch Route: {o.paymentGateway || "WhatsApp Order Out"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black font-mono text-zinc-900">{formatPrice(o.totalAmount || o.price || 0)}</p>
                          <span className="text-[9px] font-mono uppercase font-black text-[#C9A84C] block mt-1">{o.paymentStatus || "Processing"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= CONDITION D: ADVANCED INTERACTION TELEMETRY MODULE VIEWS ================= */}
        {activeTab === "telemetry" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">SYSTEM INTERACTION PROFILING SECTIONS</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Browsing & Reading Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><BookOpen size={13} className="text-[#C9A84C]" /> Gazette Read Logs</h4>
                {profile.readHistory?.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-400 uppercase italic">No editorial historical signatures captured.</p>
                ) : (
                  <div className="space-y-2">
                    {profile.readHistory.map((articleId: string, i: number) => (
                      <div key={i} className="telemetry-row-item truncate"><Activity size={12} className="text-zinc-400" /> <span>Doc Ref Index: #{articleId.substring(18)}</span></div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><Film size={13} /> Cinema Film Watch Logs</h4>
                {profile.watchHistory?.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-400 uppercase italic">No video playback traces registered.</p>
                ) : (
                  <div className="space-y-2">
                    {profile.watchHistory.map((videoId: string, i: number) => (
                      <div key={i} className="telemetry-row-item truncate"><Film size={12} className="text-[#C9A84C]" /> <span>Stream Match Event: #{videoId.substring(0, 12)}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= CONDITION E: CUSTOM DETAILS SETTINGS FORM EDIT VIEWS ================= */}
        {activeTab === "settings" && (
          <div className="kapella-card space-y-6 animate-fade-in">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">PROFILE ATTRIBUTES EDITOR ENGINE</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Edit Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdateProfileDetails} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><User size={11} /> Legal Profile Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="k-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><PhoneCall size={11} /> Primary Voice Line</label>
                  <input type="text" placeholder="+234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="k-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><Sparkles size={11} /> WhatsApp Dispatch Route</label>
                  <input type="text" placeholder="+234..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="k-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><MapPin size={11} /> Shipping Coordinate Address</label>
                  <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="k-input font-light resize-none" placeholder="Provide full clear shipping landmarks tracks details..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-400 flex items-center gap-1"><ClipboardList size={11} /> Institutional Billing Address</label>
                  <textarea rows={3} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="k-input font-light resize-none" placeholder="Provide full card verification invoice details coordinates..." />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 animate-fade-in"><Check size={14} className="text-emerald-600" /> Account profile metadata mutations completed safely.</div>
              )}

              <button type="submit" disabled={updating} style={{ backgroundColor: updating ? "#e4e4e7" : "#1a1a1a" }} className="px-6 py-3.5 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center gap-2 rounded-sm transition-all border-none cursor-pointer shadow active:scale-[0.99]">
                {updating ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Save size={13} />}
                <span>Commit Profile Changes</span>
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