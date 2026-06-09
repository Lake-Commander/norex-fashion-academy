import connectDB from "@/lib/mongodb";
import Application from "@/lib/models/ApplicationModel";
import Link from "next/link";

export default async function StudentsPage() {
  await connectDB();
  const students = await Application.find({ status: "enrolled" }).sort({ createdAt: -1 });
  const approved = await Application.find({ status: "approved" }).sort({ createdAt: -1 });

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
        
        .action-link {
          font-size: 0.75rem; color: #C9A84C; text-decoration: none; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.3s ease;
        }
        .action-link:hover {
          color: #1a1a1a;
        }
      `}</style>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>Students</h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>{students.length} enrolled students</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Enrolled", value: students.length, color: "#2563eb" },
          { label: "Approved", value: approved.length, color: "#16a34a" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.5rem" }}>{stat.value}</p>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Enrolled Students */}
      <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", marginBottom: "2rem", borderRadius: "2px" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a" }}>Enrolled Students</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAF7F4", borderBottom: "2px solid #f0ebe3" }}>
                {["Name", "Email", "Phone", "Course", "Experience", "Enrolled Date"].map((h) => (
                  <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id.toString()} className="table-row">
                  <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a" }}>{student.fullName}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{student.email}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>{student.phone}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{student.course}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{student.experienceLevel}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(student.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                    No enrolled students yet.{" "}
                    <Link href="/admin/applications" className="action-link" style={{ textTransform: "none", letterSpacing: "normal" }}>
                      Approve applications →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved - Pending Enrollment */}
      {approved.length > 0 && (
        <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", borderRadius: "2px" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ebe3" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a" }}>Approved — Pending Enrollment</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FAF7F4", borderBottom: "2px solid #f0ebe3" }}>
                  {["Name", "Email", "Course", "Approved Date", "Action"].map((h) => (
                    <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approved.map((student) => (
                  <tr key={student._id.toString()} className="table-row">
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a" }}>{student.fullName}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{student.email}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>{student.course}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {new Date(student.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <Link href={["/admin/applications/", student._id.toString()].join("")} className="action-link">
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}