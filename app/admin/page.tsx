import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Contact from "@/lib/models/ContactModel";
import Payment from "@/lib/models/PaymentModel";
import Course from "@/lib/models/CourseModel";
import Editorial from "@/lib/models/EditorialModel";
import RunwayCollection from "@/lib/models/RunwayCollection";
import Order from "@/lib/models/OrderModel";
import Link from "next/link";
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Clock,
  UserCheck
} from "lucide-react";

export default async function AdminDashboard() {
  await connectDB();

  // Core Registry Metrics
  const totalApplications = await Application.countDocuments();
  const pendingApplications = await Application.countDocuments({ status: "pending" });
  const approvedApplications = await Application.countDocuments({ status: "approved" });
  const enrolledStudents = await Application.countDocuments({ status: "enrolled" });
  const totalMessages = await Contact.countDocuments();
  const unreadMessages = await Contact.countDocuments({ status: "unread" });

  // Payment & Financial Auditing Metrics
  const totalPayments = await Payment.countDocuments();
  const confirmedPayments = await Payment.countDocuments({ status: "confirmed" });
  const pendingPayments = await Payment.countDocuments({ status: "pending" });

  // Dynamic Workspace Extensions Metrics
  const totalCourses = await Course.countDocuments();
  const totalPublications = await Editorial.countDocuments();
  const totalCollections = await RunwayCollection.countDocuments();
  
  // Storefront WhatsApp Lead Backlog Metrics
  const pendingWhatsAppOrders = await Order.countDocuments({ 
    paymentStatus: "Pending", 
    paymentGateway: "WhatsApp" 
  });

  // Financial Revenue Aggregate Pipeline
  const revenueResult = await Payment.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Recent Data Feeds Queries
  const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5);
  const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);
  const recentPublications = await Editorial.find().sort({ createdAt: -1 }).limit(3);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const goldColor = "#C9A84C";

  return (
    <div className="space-y-8 text-left text-zinc-800">
      <style>{`
        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 0.75rem 1.5rem;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
          border-radius: 2px; border: 1px solid #C9A84C; cursor: pointer;
        }
        .btn-gold:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.3);
        }
        
        .stat-card {
          background-color: white; padding: 1.25rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px; display: flex;
          align-items: center; justify-content: space-between; height: 100%;
        }
        .stat-card:hover {
          border-color: #C9A84C; transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        
        .link-gold {
          font-size: 0.72rem; color: #C9A84C; text-decoration: none; font-weight: 700;
          transition: all 0.3s ease; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .link-gold:hover { color: #1a1a1a; }
        
        .list-row {
          display: flex; align-items: center; justify-content: space-between; 
          padding-bottom: 0.85rem; border-bottom: 1px solid #fcfbf9; transition: background-color 0.2s;
        }
        .list-row:hover { background-color: #faf9f7; }

        .dashboard-grid-3 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media(min-width: 1024px) { .dashboard-grid-3 { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* Header Masthead */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">ATELIER CORE DIRECTORY</span>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl font-bold uppercase text-zinc-900 mt-0.5">Dashboard Overview</h1>
      </div>

      {/* Financial Master Revenue Banner */}
      <div style={{ backgroundColor: "#1a1a1a", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", borderRadius: "2px" }}>
        <div className="space-y-1">
          <p className="text-[9px] font-mono letter-spacing: 0.25em text-zinc-500 uppercase tracking-widest font-bold">Total Confirmed Revenue Ledger</p>
          <p style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#C9A84C]">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="flex gap-6 sm:gap-10">
          <div className="text-center">
            <p className="text-xl font-bold text-white font-mono">{confirmedPayments}</p>
            <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase mt-0.5">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#C9A84C] font-mono">{pendingPayments}</p>
            <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase mt-0.5">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white font-mono">{totalPayments}</p>
            <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase mt-0.5">Invoices</p>
          </div>
        </div>
        <Link href="/admin/payments" className="btn-gold">
          Audit Master Ledgers
        </Link>
      </div>

      {/* Advanced Extended Metrics Matrices Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Pending Invoices", value: pendingPayments, color: "#C9A84C", href: "/admin/payments", icon: Clock },
          { label: "Pending Applications", value: pendingApplications, color: "#1a1a1a", href: "/admin/applications", icon: GraduationCap },
          { label: "Enrolled Students", value: enrolledStudents, color: "#16a34a", href: "/admin/students", icon: UserCheck },
          { label: "Unread Messages", value: unreadMessages, color: "#dc2626", href: "/admin/contacts", icon: MessageSquare },
          { label: "WhatsApp Leads", value: pendingWhatsAppOrders, color: "#2563eb", href: "/admin/payments", icon: ShoppingBag },
          { label: "Syllabus Courses", value: totalCourses, color: "#1a1a1a", href: "/admin/courses", icon: GraduationCap },
          { label: "Gazette Publications", value: totalPublications, color: "#1a1a1a", href: "/admin/editorial", icon: BookOpen },
          { label: "Runway Collections", value: totalCollections, color: "#1a1a1a", href: "/admin/runway", icon: Layers },
          { label: "Total Applications", value: totalApplications, color: "#7c3aed", href: "/admin/applications", icon: GraduationCap },
          { label: "Total Feedback", value: totalMessages, color: "#6b7280", href: "/admin/contacts", icon: MessageSquare },
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Link key={idx} href={stat.href} className="text-decoration-none block">
              <div className="stat-card">
                <div>
                  <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider mt-1 font-bold">{stat.label}</p>
                </div>
                <div className="p-2 bg-zinc-50 border border-zinc-100 rounded">
                  <IconComponent size={14} className="text-zinc-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3-Column Advanced Deep Data Feeds Layout */}
      <div className="dashboard-grid-3">

        {/* Column 1: Recent Applications */}
        <div className="bg-white border border-zinc-200 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="font-bold text-zinc-900 uppercase text-xs tracking-wide">Recent Applications</h3>
            <Link href="/admin/applications" className="link-gold">All →</Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app._id.toString()} className="list-row">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide truncate">{app.fullName}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">{app.course}</p>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                  app.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                  app.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <p className="text-[11px] font-mono uppercase text-zinc-400 text-center py-8">No applications registered.</p>
            )}
          </div>
        </div>

        {/* Column 2: Recent Payments */}
        <div className="bg-white border border-zinc-200 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="font-bold text-zinc-900 uppercase text-xs tracking-wide">Recent Payments</h3>
            <Link href="/admin/payments" className="link-gold">All →</Link>
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment._id.toString()} className="list-row">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide truncate">{payment.studentName}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">{payment.course}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#C9A84C] font-mono">{formatCurrency(payment.amount)}</p>
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border mt-0.5 inline-block ${
                    payment.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-[11px] font-mono uppercase text-zinc-400 text-center py-8">No payments indexed.</p>
            )}
          </div>
        </div>

        {/* Column 3: Recent Newsroom Gazette Logs */}
        <div className="bg-white border border-zinc-200 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="font-bold text-zinc-900 uppercase text-xs tracking-wide">Gazette Logs</h3>
            <Link href="/admin/editorial" className="link-gold">All →</Link>
          </div>
          <div className="space-y-3">
            {recentPublications.map((pub) => (
              <div key={pub._id.toString()} className="list-row">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide truncate">{pub.title}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono lowercase">Type: {pub.contentType}</p>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                  pub.featured ? "bg-amber-50 text-amber-700 border-[#C9A84C]" : "bg-zinc-50 text-zinc-500 border-zinc-200"
                }`}>
                  {pub.featured ? "Pinned" : "Standard"}
                </span>
              </div>
            ))}
            {recentPublications.length === 0 && (
              <p className="text-[11px] font-mono uppercase text-zinc-400 text-center py-8">Newsroom indexes clear.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}