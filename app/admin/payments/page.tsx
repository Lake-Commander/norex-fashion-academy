"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Loader2, CreditCard, MessageCircle, Check, ShoppingBag, GraduationCap, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function MasterLedgerDashboard() {
  // Tabs Workspace Management State
  const [activeTab, setActiveTab] = useState<"storefront" | "academy">("storefront");
  
  // Storage Matrices
  const [orders, setOrders] = useState<any[]>([]);
  const [academyPayments, setAcademyPayments] = useState<any[]>([]);
  
  // Loading & Action State States
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<{ [key: string]: string }>({});

  // Sync Financial Databases Concurrently
  useEffect(() => {
    async function loadFinancialLedgers() {
      try {
        const [ordersRes, academyRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/admin/academy-payments")
        ]);

        const ordersData = await ordersRes.json();
        const academyData = await academyRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (academyData.success) setAcademyPayments(academyData.payments);
      } catch (err) {
        console.error("Ledger compilation transaction error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFinancialLedgers();
  }, []);

  // Inline Override and Manual Order Approvals
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const payload: any = { paymentStatus: newStatus };
      if (customPrice[id]) {
        payload.totalAmount = Number(customPrice[id]);
      }

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, paymentStatus: newStatus, totalAmount: payload.totalAmount || o.totalAmount } : o))
        );
        alert("Storefront ledger entry updated successfully.");
      }
    } catch (err) {
      alert("Failed updating dynamic order allocation state.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Dynamic Workspace Metrics Computations
  const getMetrics = () => {
    if (activeTab === "storefront") {
      const confirmedRevenue = orders.filter((o) => o.paymentStatus === "Completed").reduce((sum, o) => sum + o.totalAmount, 0);
      return [
        { label: "Boutique Revenue", value: formatPrice(confirmedRevenue), icon: TrendingUp, color: "#1a1a1a" },
        { label: "Orders Cleared", value: orders.filter((o) => o.paymentStatus === "Completed").length, icon: Check, color: "#16a34a" },
        { label: "WhatsApp Pending", value: orders.filter((o) => o.paymentStatus === "Pending" && o.paymentGateway === "WhatsApp").length, icon: MessageCircle, color: "#C9A84C" },
        { label: "Failed Drops", value: orders.filter((o) => o.paymentStatus === "Failed").length, icon: AlertCircle, color: "#dc2626" },
      ];
    } else {
      const confirmedTuition = academyPayments.filter((p) => p.status === "confirmed").reduce((sum, p) => sum + p.amount, 0);
      return [
        { label: "Academy Revenue", value: formatPrice(confirmedTuition), icon: DollarSign, color: "#1a1a1a" },
        { label: "Tuition Confirmed", value: academyPayments.filter((p) => p.status === "confirmed").length, icon: Check, color: "#16a34a" },
        { label: "Invoices Pending", value: academyPayments.filter((p) => p.status === "pending").length, icon: Loader2, color: "#C9A84C" },
        { label: "Rejected Transfers", value: academyPayments.filter((p) => p.status === "failed").length, icon: XIcon, color: "#dc2626" },
      ];
    }
  };

  const goldColor = "#C9A84C";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-zinc-800">
      
      {/* Master Workspace Head Node */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">FINANCIAL TRANSACTION COMMAND HUB</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Master Financial Ledgers</h1>
        </div>
        
        {/* Dynamic Control Room Workspace Switches */}
        <div className="inline-flex bg-zinc-100 p-1 rounded-sm border border-zinc-200">
          <button 
            onClick={() => setActiveTab("storefront")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer ${activeTab === "storefront" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Storefront Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab("academy")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer ${activeTab === "academy" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academy Tuition</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Compiling Master Financial Metrics...</p>
        </div>
      ) : (
        <>
          {/* Section Dynamic Metric Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics().map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-zinc-200 p-5 rounded-sm shadow-sm flex items-center justify-between hover:border-[#C9A84C] transition-all">
                  <div>
                    <h3 className="text-xl font-bold font-mono tracking-tight" style={{ color: stat.color }}>{stat.value}</h3>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-1">{stat.label}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded border border-zinc-100">
                    <IconComponent className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLE DISPLAY CONTEXT BLOCKS */}
          <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              
              {activeTab === "storefront" ? (
                /* --- STOREFRONT REGISTRY WORKSPACE CARD --- */
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
                      <th className="p-4">Reference ID</th>
                      <th className="p-4">Configured Items Basket</th>
                      <th className="p-4">Channel Origin</th>
                      <th className="p-4">Assessment Amount</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4 text-right">Ledger Overrides / Approvals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-xs text-zinc-900">{order.orderId}</td>
                        <td className="p-4 space-y-1">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="text-xs text-zinc-800 font-medium">
                              {item.name} <span className="text-zinc-400 font-mono text-[10px]">x{item.quantity}</span>
                              <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wide mt-0.5 font-bold">
                                Size {item.size || "M"} · Swatch {item.color || "Default"} · {item.gender || "Fit"}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase font-mono tracking-wider">
                            {order.paymentGateway === "WhatsApp" ? (
                              <><MessageCircle className="h-4 w-4 text-emerald-500 fill-current" /><span className="text-emerald-700">WhatsApp Lead</span></>
                            ) : (
                              <><CreditCard className="h-4 w-4 text-blue-500" /><span className="text-blue-700">{order.paymentGateway}</span></>
                            )}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-zinc-900">{formatPrice(order.totalAmount)}</td>
                        <td className="p-4">
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-sm border font-bold ${
                            order.paymentStatus === "Completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                            order.paymentStatus === "Failed" ? "bg-rose-50 border-rose-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {order.paymentStatus === "Pending" ? (
                            <div className="inline-flex items-center gap-2 justify-end">
                              <div className="relative flex items-center">
                                <span className="absolute left-2 text-xs font-mono text-zinc-400 font-bold">₦</span>
                                <input
                                  type="number"
                                  placeholder="Custom Price"
                                  value={customPrice[order._id] || ""}
                                  onChange={(e) => setCustomPrice({ ...customPrice, [order._id]: e.target.value })}
                                  className="w-28 border border-zinc-300 pl-5 pr-1.5 py-1 rounded-sm text-xs focus:outline-none focus:border-[#C9A84C]"
                                />
                              </div>
                              <button
                                disabled={updatingId !== null}
                                onClick={() => handleUpdateOrderStatus(order._id, "Completed")}
                                className="px-3 py-1.5 bg-zinc-900 hover:bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {updatingId === order._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                <span>Approve</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest italic font-bold">Registry Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} className="p-12 text-center text-zinc-400 text-xs font-mono uppercase">No boutique storefront transactions registered.</td></tr>
                    )}
                  </tbody>
                </table>
              ) : (
                /* --- ACADEMY TUITION INVOICES WORKSPACE --- */
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
                      <th className="p-4">Student Profile</th>
                      <th className="p-4">Course Assignment</th>
                      <th className="p-4">Amount Invoiced</th>
                      <th className="p-4">Method Channel</th>
                      <th className="p-4">System Reference Token</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Timestamp Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {academyPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-zinc-900 text-xs uppercase tracking-wide">{payment.studentName}</p>
                          <p className="text-[10px] font-mono text-zinc-400 lowercase mt-0.5">{payment.email}</p>
                        </td>
                        <td className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">{payment.course}</td>
                        <td className="p-4 font-mono font-bold text-[#C9A84C]">{formatPrice(payment.amount)}</td>
                        <td className="p-4 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">{payment.paymentMethod?.replace("_", " ")}</td>
                        <td className="p-4 text-xs font-mono text-zinc-500">{payment.reference}</td>
                        <td className="p-4">
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border font-bold ${
                            payment.status === "confirmed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                            payment.status === "pending" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-rose-50 border-rose-200 text-red-700"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-zinc-400 whitespace-nowrap">
                          {new Date(payment.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                    {academyPayments.length === 0 && (
                      <tr><td colSpan={7} className="p-12 text-center text-zinc-400 text-xs font-mono uppercase">No active academic training invoices filed.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Quick component abstraction icon alignment safety hook
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}