import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Contact from "@/lib/models/ContactModel";
import Payment from "@/lib/models/PaymentModel";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectDB();

  const totalApplications = await Application.countDocuments();
  const pendingApplications = await Application.countDocuments({ status: "pending" });
  const approvedApplications = await Application.countDocuments({ status: "approved" });
  const enrolledStudents = await Application.countDocuments({ status: "enrolled" });
  const totalMessages = await Contact.countDocuments();
  const unreadMessages = await Contact.countDocuments({ status: "unread" });

  const totalPayments = await Payment.countDocuments();
  const confirmedPayments = await Payment.countDocuments({ status: "confirmed" });
  const pendingPayments = await Payment.countDocuments({ status: "pending" });

  const revenueResult = await Payment.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5);
  const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  return (
    <div>
      <style>{`
        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 0.75rem 1.5rem;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
          border-radius: 2px; border: 1px solid #C9A84C;
        }
        .btn-gold:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.3);
        }
        
        .stat-card {
          background-color: white; padding: 1.5rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px; height: 100%;
        }
        .stat-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .link-gold {
          font-size: 0.75rem; color: #C9A84C; text-decoration: none; font-weight: 600;
          transition: all 0.3s ease; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .link-gold:hover {
          color: #1a1a1a;
        }
        
        .list-row {
          display: flex; align-items: center; justify-content: space-between; 
          padding-bottom: 1rem; border-bottom: 1px solid #f9f9f9; transition: background-color 0.2s;
        }
        .list-row:hover {
          background-color: #faf9f7;
        }
      `}</style>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>Dashboard Overview</h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Welcome back, Admin</p>
      </div>

      {/* Revenue Banner */}
      <div style={{ backgroundColor: "#1a1a1a", padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderRadius: "2px" }}>
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Total Revenue</p>
          <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.5rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{formatCurrency(totalRevenue)}</p>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: "0.25rem" }}>{confirmedPayments}</p>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Confirmed</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: "0.25rem" }}>{pendingPayments}</p>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Pending</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: "0.25rem" }}>{totalPayments}</p>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Total</p>
          </div>
        </div>
        <Link href="/admin/payments" className="btn-gold">
          Manage Payments
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Applications", value: totalApplications, color: "#1a1a1a", href: "/admin/applications" },
          { label: "Pending Review", value: pendingApplications, color: "#C9A84C", href: "/admin/applications" },
          { label: "Approved", value: approvedApplications, color: "#16a34a", href: "/admin/applications" },
          { label: "Enrolled Students", value: enrolledStudents, color: "#2563eb", href: "/admin/students" },
          { label: "Total Messages", value: totalMessages, color: "#7c3aed", href: "/admin/contacts" },
          { label: "Unread Messages", value: unreadMessages, color: "#dc2626", href: "/admin/contacts" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="stat-card">
              <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.5rem" }}>{stat.value}</p>
              <p style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>

        {/* Recent Applications */}
        <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", padding: "1.5rem", borderRadius: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a" }}>Recent Applications</h2>
            <Link href="/admin/applications" className="link-gold">View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentApplications.map((app) => (
              <div key={app._id.toString()} className="list-row">
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.15rem" }}>{app.fullName}</p>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{app.course}</p>
                </div>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", borderRadius: "2px",
                  backgroundColor: app.status === "pending" ? "#fef3c7" : app.status === "approved" ? "#dcfce7" : app.status === "enrolled" ? "#dbeafe" : "#fee2e2",
                  color: app.status === "pending" ? "#92400e" : app.status === "approved" ? "#166534" : app.status === "enrolled" ? "#1e40af" : "#991b1b",
                }}>
                  {app.status}
                </span>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <p style={{ fontSize: "0.875rem", color: "#9ca3af", textAlign: "center", padding: "2rem 0" }}>No applications yet</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", padding: "1.5rem", borderRadius: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a" }}>Recent Payments</h2>
            <Link href="/admin/payments" className="link-gold">View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentPayments.map((payment) => (
              <div key={payment._id.toString()} className="list-row">
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.15rem" }}>{payment.studentName}</p>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{payment.course}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#C9A84C", marginBottom: "0.15rem" }}>{formatCurrency(payment.amount)}</p>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", borderRadius: "2px",
                    backgroundColor: payment.status === "confirmed" ? "#dcfce7" : payment.status === "pending" ? "#fef3c7" : "#fee2e2",
                    color: payment.status === "confirmed" ? "#166534" : payment.status === "pending" ? "#92400e" : "#991b1b",
                  }}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p style={{ fontSize: "0.875rem", color: "#9ca3af", textAlign: "center", padding: "2rem 0" }}>No payments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}