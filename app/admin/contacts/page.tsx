import connectDB from "@/lib/mongodb";
import Contact from "@/lib/models/ContactModel";

export default async function ContactsPage() {
  await connectDB();
  const contacts = await Contact.find().sort({ createdAt: -1 });

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

        .message-card {
          background-color: white; border: 1px solid #f0ebe3; padding: 1.5rem;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .message-card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 0.5rem 1.25rem;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
          border-radius: 2px;
        }
        .btn-gold:hover {
          background-color: #B49542; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(201, 168, 76, 0.3);
        }

        .btn-wa {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #25D366; color: white; padding: 0.5rem 1.25rem;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
          border-radius: 2px;
        }
        .btn-wa:hover {
          background-color: #20b558; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }
      `}</style>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.25rem" }}>Messages</h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>{contacts.length} total messages</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total", value: contacts.length, color: "#1a1a1a" },
          { label: "Unread", value: contacts.filter((c) => c.status === "unread").length, color: "#dc2626" },
          { label: "Read", value: contacts.filter((c) => c.status === "read").length, color: "#C9A84C" },
          { label: "Replied", value: contacts.filter((c) => c.status === "replied").length, color: "#16a34a" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.5rem" }}>{stat.value}</p>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Messages List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {contacts.map((contact) => (
          <div key={contact._id.toString()} className="message-card" style={{ borderLeft: contact.status === "unread" ? "4px solid #C9A84C" : "4px solid #f0ebe3" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.35rem" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>{contact.name}</p>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", borderRadius: "2px",
                    backgroundColor: contact.status === "unread" ? "#fee2e2" : contact.status === "read" ? "#fef3c7" : "#dcfce7",
                    color: contact.status === "unread" ? "#991b1b" : contact.status === "read" ? "#92400e" : "#166534",
                  }}>
                    {contact.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>📧 {contact.email}</p>
                  {contact.phone && <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>📱 {contact.phone}</p>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {new Date(contact.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
            <div style={{ backgroundColor: "#FAF7F4", padding: "1rem", marginBottom: "1rem", borderRadius: "2px" }}>
              <p style={{ fontSize: "0.8rem", color: "#C9A84C", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {contact.subject}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.7 }}>{contact.message}</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a href={["mailto:", contact.email, "?subject=Re: ", contact.subject].join("")} className="btn-gold">
                Reply via Email
              </a>
              <a href={["https://wa.me/", contact.phone?.replace(/\D/g, "")].join("")} target="_blank" rel="noopener noreferrer" className="btn-wa">
                WhatsApp
              </a>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div style={{ backgroundColor: "white", border: "1px solid #f0ebe3", padding: "4rem", textAlign: "center", borderRadius: "2px" }}>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}