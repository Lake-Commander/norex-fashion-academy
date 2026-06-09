import connectDB from "@/lib/mongodb";
import Payment from "@/lib/models/PaymentModel";
import Link from "next/link";

export default async function PaymentsPage() {
  await connectDB();
  const payments = await Payment.find().sort({ createdAt: -1 });

  const totalRevenue = payments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  return (
    <div>
      <style>{`
        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 0.75rem 1.5rem;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
          border-radius: 2px; border: 1px solid #C9A84C;
        }
        .btn-gold:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.3);
        }

        .stat-card {
          background-color: white; padding: 1.5rem; border: 1px solid #f0ebe3;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .stat-card:hover {
          border-color: #C9A84C; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .table-row {
          border-bottom: 1px solid #f9f9f9; transition: background-color 0.2s ease;
        }
        .table-row:hover {
          background-color: #faf9f7;
        }
      `}</style>

      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>Payments</h1>
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>{payments.length} total payments</p>
        </div>
        <Link href="/admin/payments/new" className="btn-gold">
          + Record Payment
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "#1a1a1a" },
          { label: "Confirmed", value: payments.filter((p) => p.status === "confirmed").length, color: "#16a34a" },
          { label: "Pending", value: payments.filter((p) => p.status === "pending").length, color: "#C9A84C" },
          { label: "Failed", value: payments.filter((p) => p.status === "failed").length, color: "#dc2626" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.5rem" }}>{stat.value}</p>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", borderRadius: "2px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAF7F4", borderBottom: "2px solid #f0ebe3" }}>
                {["Student", "Course", "Amount", "Method", "Reference", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id.toString()} className="table-row">
                  <td style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.15rem" }}>{payment.studentName}</p>
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{payment.email}</p>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{payment.course}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "#C9A84C", whiteSpace: "nowrap" }}>{formatCurrency(payment.amount)}</td>
                  <td style={{ padding: "1rem", fontSize: "0.72rem", color: "#6b7280", textTransform: "capitalize" }}>{payment.paymentMethod.replace("_", " ")}</td>
                  <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace" }}>{payment.reference}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "2px",
                      backgroundColor: payment.status === "confirmed" ? "#dcfce7" : payment.status === "pending" ? "#fef3c7" : "#fee2e2",
                      color: payment.status === "confirmed" ? "#166534" : payment.status === "pending" ? "#92400e" : "#991b1b",
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(payment.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "4rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                    No payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}