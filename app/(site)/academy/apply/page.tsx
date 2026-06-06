"use client";
import { useState } from "react";
import { courses } from "@/lib/data/courses";
import dynamic from "next/dynamic";
const SuccessModal = dynamic(() => import("@/components/ui/SuccessModal"), { ssr: false });

export default function ApplyPage() {
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", course: "", experienceLevel: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmittedName(form.fullName.split(" ")[0]);
        setForm({ fullName: "", email: "", phone: "", course: "", experienceLevel: "", message: "" });
        setStatus("idle");
        setShowModal(true);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    padding: "0.875rem 1rem",
    fontSize: "0.9rem",
    color: "#1a1a1a",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "0.5rem",
  };

  return (
    <>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="application"
        name={submittedName}
      />

      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <style>{`
          .apply-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
          @media(min-width: 1024px) { .apply-grid { grid-template-columns: 2fr 3fr; } }
          .apply-input-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
          @media(min-width: 640px) { .apply-input-row { grid-template-columns: 1fr 1fr; } }
        `}</style>

        {/* Header */}
        <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#1a1a1a" }}>
          <div className="container-custom">
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 500, marginBottom: "1rem", display: "block" }}>Norex Fashion Academy</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "white", marginBottom: "1rem", lineHeight: 1.1 }}>
              Apply Now
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: "500px", lineHeight: 1.8 }}>
              Take the first step toward your fashion career. Fill out the form below and we will be in touch within 48 hours.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="container-custom" style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
          <div className="apply-grid">

            {/* Left Info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "2rem" }}>
                What to Expect
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
                {[
                  { step: "01", title: "Submit Application", desc: "Fill out the form with your details and course preference." },
                  { step: "02", title: "Review (48hrs)", desc: "Our team reviews your application and gets back to you within 48 hours." },
                  { step: "03", title: "Onboarding Call", desc: "We schedule a brief call to discuss your goals and course details." },
                  { step: "04", title: "Begin Your Journey", desc: "Pay your fees, receive your materials, and start your fashion career." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                    <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#f0ebe3", lineHeight: 1, flexShrink: 0 }}>{item.step}</span>
                    <div>
                      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.35rem" }}>{item.title}</h3>
                      <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ backgroundColor: "#FAF7F4", border: "1px solid #f0ebe3", padding: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#722F37", fontWeight: 600, marginBottom: "0.75rem" }}>Need Help?</p>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1rem" }}>Have questions before applying? Reach out to us directly.</p>
                <a href="https://wa.me/2348081258048" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#722F37", fontWeight: 600, borderBottom: "1px solid #722F37", paddingBottom: "2px", textDecoration: "none" }}>
                  Chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="apply-input-row">
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Select Course</label>
                  <select name="course" value={form.course} onChange={handleChange} required style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Choose a course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.slug}>{c.title} — {c.duration}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select your experience level...</option>
                    <option value="no-experience">No Experience — Complete Beginner</option>
                    <option value="some-experience">Some Experience — Self-Taught</option>
                    <option value="intermediate">Intermediate — Some Formal Training</option>
                    <option value="professional">Professional — Working in Fashion</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tell Us About Yourself (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Share your background, goals, or why you want to join..." rows={5} style={{ ...inputStyle, resize: "none" }} />
                </div>
                {status === "error" && (
                  <p style={{ fontSize: "0.85rem", color: "#dc2626" }}>Something went wrong. Please try again.</p>
                )}
                <button type="submit" disabled={status === "loading"} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#722F37", color: "white", padding: "1rem 2.5rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit", opacity: status === "loading" ? 0.7 : 1 }}>
                  {status === "loading" ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}