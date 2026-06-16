"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Loader2, GraduationCap, ShoppingBag, User, LogOut, 
  CreditCard, Settings, Eye, BookOpen, Film, Heart, CheckCircle, Save 
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";

type TabKeys = "overview" | "academy" | "commerce" | "telemetry" | "settings";

export default function EnhancedEcosystemDashboard() {
  const { data: session, status } = useSession();
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
        .dash-layout-container { max-w: 7xl; width: 100%; mx: auto; display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 8rem 1.5rem 6rem 1.5rem; }
        @media(min-width: 1024px) { .dash-layout-container { grid-template-columns: 280px 1fr; } }
        
        .panel-sidebar { background: white; border: 1px solid #e4e4e7; p: 1.5rem; border-radius: 1px; height: fit-content; }
        .panel-viewport { background: white; border: 1px solid #e4e4e7; p: 2rem; border-radius: 1px; min-height: 520px; }
        
        .tab-trigger-link { width: 100%; display: flex; align-items: center; gap: 0.75rem; p: 0.85rem 1rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: none; border: none; cursor: pointer; border-radius: 1px; transition: all 0.2s; text-align: left; color: #555; }
        .tab-trigger-link:hover { background-color: #fcfbf9; color: #111; }
        .tab-trigger-link.active { background-color: #1a1a1a; color: white; }
        
        .form-field-entry { width: 100%; border: 1px solid #e4e4e7; p: 0.75rem 1rem; font-size: 0.85rem; background: #FCFAF7; focus: border-color: #C9A84C; focus: background: white; outline: none; border-radius: 1px; }
        .data-table-row { display: flex; align-items: center; justify-content: space-between; py: 0.85rem; border-b: 1px solid #f4f4f5; }
        .data-table-row:last-child { border-b: none; }
      `}</style>

      <div className="dash-layout-container mx-auto">
        
        {/* Left Side: Modular Context Navigation Sidebar */}
        <aside className="panel-sidebar space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="h-12 w-11 bg-zinc-900 rounded-full flex items-center justify-center text-white font-mono font-bold uppercase overflow-hidden shrink-0">
              {profile.image ? <img src={profile.image} alt="" className="w-full h-full object-cover" /> : <span>{profile.name?.substring(0,2)}</span>}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black truncate text-zinc-900 uppercase tracking-wide">{profile.name}</h4>
              <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">{profile.email}</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            <button type="button" onClick={() => handleTabSwitch("overview")} className={`tab-trigger-link ${activeTab === "overview" ? "active" : ""}`}>
              <User size={13} /> <span>Overview Engine</span>
            </button>
            <button type="button" onClick={() => handleTabSwitch("academy")} className={`tab-trigger-link ${activeTab === "academy" ? "active" : ""}`}>
              <GraduationCap size={13} /> <span>Academy & Apps</span>
            </button>
            <button type="button" onClick={() => handleTabSwitch("commerce")} className={`tab-trigger-link ${activeTab === "commerce" ? "active" : ""}`}>
              <ShoppingBag size={13} /> <span>Orders & Invoices</span>
            </button>
            <button type="button" onClick={() => handleTabSwitch("telemetry")} className={`tab-trigger-link ${activeTab === "telemetry" ? "active" : ""}`}>
              <Eye size={13} /> <span>Browsing Metrics</span>
            </button>
            <button type="button" onClick={() => handleTabSwitch("settings")} className={`tab-trigger-link ${activeTab === "settings" ? "active" : ""}`}>
              <Settings size={13} /> <span>Edit Settings</span>
            </button>
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="tab-trigger-link text-red-500 hover:bg-red-50 hover:text-red-700 mt-6 border-t pt-4">
              <LogOut size={13} /> <span>Secure Exit</span>
            </button>
          </nav>
        </aside>

        {/* Right Side: Shared Polymorphic Viewport Panel */}
        <section className="panel-viewport shadow-sm">
          
          {/* TAB 1: MASTER OVERVIEW CONSOLE PANELS */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4">
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">REAL-TIME TELEMETRY MATRIX</span>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Account Overview</h2>
              </div>

              {/* Core System Tracking Metrics Block */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border bg-zinc-50/40 rounded-sm">
                  <p className="text-xl font-black font-mono text-zinc-900">{applications.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Applications</p>
                </div>
                <div className="p-4 border bg-zinc-50/40 rounded-sm">
                  <p className="text-xl font-black font-mono text-zinc-900">{orders.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Shop Invoices</p>
                </div>
                <div className="p-4 border bg-zinc-50/40 rounded-sm">
                  <p className="text-xl font-black font-mono text-zinc-900">{wishlist.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Saved Items</p>
                </div>
                <div className="p-4 border bg-zinc-50/40 rounded-sm">
                  <p className="text-xl font-black font-mono text-zinc-900">{cart.length}</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mt-1">Active Cart</p>
                </div>
              </div>

              {/* Shopping Cart & Wishlist Local Synchronizers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 bg-white rounded-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1"><Heart size={14} style={{ color: goldColor }} /> My Active Wishlist ({wishlist.length})</h3>
                  {wishlist.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase py-2">No selections pinned.</p>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto">
                      {wishlist.map((item: any) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs font-medium">
                          <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[180px]">{item.name}</span>
                          <button type="button" onClick={() => toggleWishlist(item)} className="text-[10px] font-mono text-red-500 uppercase font-bold bg-transparent border-none cursor-pointer">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border p-4 bg-white rounded-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1"><ShoppingBag size={14} /> Shopping Cart Backlog ({cart.length})</h3>
                  {cart.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase py-2">No elements pending checkout.</p>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto">
                      {cart.map((item: any) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                          <span className="uppercase text-zinc-900 truncate tracking-wide max-w-[180px] font-bold">{item.name} <strong className="text-[10px] text-zinc-400 font-mono">({item.orderQuantity}x)</strong></span>
                          <span className="font-mono text-zinc-500">{formatPrice(item.price * item.orderQuantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMY SUBMISSIONS & STATUS TRACKING REGISTERS */}
          {activeTab === "academy" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">INSTITUTIONAL MATRICULATION LINES</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Academy & Application History</h2>
              </div>

              {applications.length === 0 ? (
                <p className="text-center py-12 border border-dashed font-mono text-xs uppercase text-zinc-400">No submission records tied to this account blueprint node.</p>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {applications.map((app: any) => (
                    <div key={app._id} className="data-table-row">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{app.course}</h4>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Tracking Index Reference: {app._id.toUpperCase()}</p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm px-2.5 py-0.5 ${
                        app.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        app.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMERCE INVOICES & TUITION STATEMENT TRANSACTIONS */}
          {activeTab === "commerce" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="border-b pb-4">
                  <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">ACQUISITION DISPATCH TRACKER</span>
                  <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Storefront Invoices Ledger</h2>
                </div>
                {orders.length === 0 ? (
                  <p className="text-center py-8 border border-dashed font-mono text-xs uppercase text-zinc-400 mt-4">No historical retail entries processed.</p>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {orders.map((o: any) => (
                      <div key={o._id} className="data-table-row">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Order Key: #{o._id.substring(18).toUpperCase()}</h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Channel Gateway Pipeline: {o.paymentGateway || "WhatsApp Callout"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold font-mono text-zinc-900">{formatPrice(o.totalAmount || o.price || 0)}</p>
                          <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mt-0.5">{o.paymentStatus || "Processing"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Separate Academic Tuition Payments Log Subsection */}
              <div>
                <div className="border-b pb-2">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1"><CreditCard size={14} /> Academy Tuition Payment Records</h3>
                </div>
                {payments.length === 0 ? (
                  <p className="text-left text-[11px] font-mono text-zinc-400 uppercase py-4">No tuition invoices generated.</p>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {payments.map((p: any) => (
                      <div key={p._id} className="data-table-row">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{p.course || "Studio Training Tuition Block"}</h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Reference Bank/Teller: {p.bankName || "Manual Audit Wire"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black font-mono text-[#C9A84C]">{formatPrice(p.amount)}</p>
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border inline-block mt-1 ${
                            p.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED NAVIGATION TELEMETRY (WATCH/READ RECENTLY VISITED FOOTPRINTS) */}
          {activeTab === "telemetry" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4">
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">BEHAVIORAL FOOTPRINT HISTORY AUDIT</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Browsing & Reading Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                {/* Newsroom Gazette Read History Trace Tracker */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1"><BookOpen size={13} /> Gazette Read Logs</h3>
                  {profile.readHistory?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase">No editorial articles tracked yet.</p>
                  ) : (
                    <ul className="list-none p-0 m-0 space-y-2">
                      {profile.readHistory.map((articleId: string, i: number) => (
                        <li key={i} className="text-xs font-medium border p-2 bg-zinc-50/50 rounded-sm font-mono truncate uppercase">Doc Reference Index: #{articleId.substring(16)}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Fashion Film Cinema Watch Tracking History Array Block */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1"><Film size={13} /> Cinema Film Watch Logs</h3>
                  {profile.watchHistory?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase">No video playback tracks registered.</p>
                  ) : (
                    <ul className="list-none p-0 m-0 space-y-2">
                      {profile.watchHistory.map((videoId: string, i: number) => (
                        <li key={i} className="text-xs font-medium border p-2 bg-zinc-50/50 rounded-sm font-mono truncate uppercase">Stream Event Token: #{videoId}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recently Viewed Products Tracker Footprint Line */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1"><ShoppingBag size={13} /> Products Recently Checked</h3>
                  {profile.recentlyViewedProducts?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase">No design blueprints scanned recently.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {profile.recentlyViewedProducts.map((pId: string, i: number) => (
                        <div key={i} className="border p-2 text-[10px] bg-zinc-50 font-mono rounded-sm uppercase text-center font-bold text-zinc-500 truncate">ID-{pId.substring(18)}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recently Viewed Academy Training Syllabus Courses Tracker Footprint Line */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1"><GraduationCap size={13} /> Courses Recently Checked</h3>
                  {profile.recentlyViewedCourses?.length === 0 ? (
                    <p className="text-[11px] font-mono text-zinc-400 uppercase">No training portfolios scanned recently.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {profile.recentlyViewedCourses.map((cId: string, i: number) => (
                        <div key={i} className="border p-2 text-[10px] bg-zinc-50 font-mono rounded-sm uppercase text-center font-bold text-zinc-500 truncate">Syllabus-{cId.substring(20)}</div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: COMPREHENSIVE SETTINGS DETAILS MANAGEMENT FORM EDIT */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">DETAILS RECTOR PROTOCOL</span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 mt-0.5">Edit Profile Settings</h2>
              </div>

              <form onSubmit={handleUpdateProfileDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Legal Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-field-entry" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Primary Mobile Phone</label>
                    <input type="text" placeholder="+234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="form-field-entry" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">WhatsApp Workspace Lead Line</label>
                    <input type="text" placeholder="+234..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="form-field-entry" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Default Shipping Destination Address</label>
                    <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="form-field-entry font-light resize-none" placeholder="Enter full shipping coordinate tracks..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Institutional Billing Line Address</label>
                    <textarea rows={3} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="form-field-entry font-light resize-none" placeholder="Enter card processing or wiring address specifications..." />
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5"><CheckCircle size={14} /> Profile details saved successfully.</div>
                )}

                <button type="submit" disabled={updating} style={{ backgroundColor: updating ? "#f4f4f5" : "#1a1a1a" }} className="px-6 py-3.5 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center gap-2 rounded-sm shadow-md transition-all cursor-pointer">
                  {updating ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Save size={14} />}
                  <span>Commit Updated Settings</span>
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