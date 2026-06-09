import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Link from "next/link";

export default async function ApplicationsPage() {
  await connectDB();
  const applications = await Application.find().sort({ createdAt: -1 });

  return (
    <div>
      <style>{`
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
        
        .view-link {
          font-size: 0.75rem; color: #C9A84C; text-decoration: none; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.3s ease;
        }
        .view-link:hover {
          color: #1a1a1a;
        }
      `}</style>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>Applications</h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>{applications.length} total applications</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total", value: applications.length, color: "#1a1a1a" },
          { label: "Pending", value: applications.filter((a) => a.status === "pending").length, color: "#C9A84C" },
          { label: "Approved", value: applications.filter((a) => a.status === "approved").length, color: "#16a34a" },
          { label: "Enrolled", value: applications.filter((a) => a.status === "enrolled").length, color: "#2563eb" },
          { label: "Rejected", value: applications.filter((a) => a.status === "rejected").length, color: "#dc2626" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.5rem" }}>{stat.value}</p>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", borderRadius: "2px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAF7F4", borderBottom: "2px solid #f0ebe3" }}>
                {["Name", "Email", "Phone", "Course", "Experience", "Status", "Date", "Action"].map((h) => (
                  <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id.toString()} className="table-row">
                  <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>{app.fullName}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{app.email}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>{app.phone}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{app.course}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{app.experienceLevel}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "2px",
                      backgroundColor: app.status === "pending" ? "#fef3c7" : app.status === "approved" ? "#dcfce7" : app.status === "enrolled" ? "#dbeafe" : "#fee2e2",
                      color: app.status === "pending" ? "#92400e" : app.status === "approved" ? "#166534" : app.status === "enrolled" ? "#1e40af" : "#991b1b",
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(app.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <Link href={["/admin/applications/", app._id.toString()].join("")} className="view-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "4rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>No applications yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}