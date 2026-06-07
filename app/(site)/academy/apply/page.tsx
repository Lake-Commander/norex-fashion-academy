"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { courses } from "@/lib/data/courses";
import dynamic from "next/dynamic";
const SuccessModal = dynamic(() => import("@/components/ui/SuccessModal"), { ssr: false });

function ApplyForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const searchParams = useSearchParams();
  const preSelectedCourse = searchParams.get("course") || "";

  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    course: preSelectedCourse, // Auto-selects based on URL
    experienceLevel: "", 
    message: "",
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
        onSuccess(form.fullName.split(" ")[0]);
        setForm({ fullName: "", email: "", phone: "", course: "", experienceLevel: "", message: "" });
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="apply-input-row">
        <div>
          <label style={labelStyle}>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" required className="custom-input" />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className="custom-input" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Phone Number</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 808 125 8048" required className="custom-input" />
      </div>
      <div>
        <label style={labelStyle}>Select Course</label>
        <select name="course" value={form.course} onChange={handleChange} required className="custom-input" style={{ cursor: "pointer" }}>
          <option value="">Choose a course...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.slug}>{c.title} — {c.duration}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Experience Level</label>
        <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required className="custom-input" style={{ cursor: "pointer" }}>
          <option value="">Select your experience level...</option>
          <option value="no-experience">No Experience — Complete Beginner</option>
          <option value="some-experience">Some Experience — Self-Taught</option>
          <option value="intermediate">Intermediate — Some Formal Training</option>
          <option value="professional">Professional — Working in Fashion</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Tell Us About Yourself (optional)</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Share your background, goals, or why you want to join..." rows={5} className="custom-input" style={{ resize: "none" }} />
      </div>
      
      {status === "error" && (
        <p style={{ fontSize: "0.85rem", color: "#dc2626" }}>Something went wrong. Please try again.</p>
      )}
      
      <button type="submit" disabled={status === "loading"} className="btn-submit">
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

export default function ApplyPage() {
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSuccess = (name: string) => {
    setSubmittedName(name);
    setShowModal(true);
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

          /* --- Interactive Form Styles --- */
          .custom-input {
            width: 100%;
            border: 1px solid #e5e7eb;
            background-color: white;
            padding: 0.875rem 1rem;
            font-size: 0.9rem;
            color: #1a1a1a;
            outline: none;
            font-family: inherit;
            transition: all 0.3s ease;
            border-radius: 2px;
          }
          .custom-input:hover {
            border-color: #d1d5db;
          }
          .custom-input:focus {
            border-color: #C9A84C;
            box-shadow: 0 0 0 1px #C9A84C;
          }

          .btn-submit {
            display: inline-flex; align-items: center; justify-content: center;
            background-color: #C9A84C; color: white;
            padding: 1rem 2.5rem; font-size: 0.8rem; font-weight: 600;
            letter-spacing: 0.15em; text-transform: uppercase;
            border: none; cursor: pointer; font-family: inherit;
            transition: all 0.3s ease; border-radius: 2px;
          }
          .btn-submit:hover:not(:disabled) {
            background-color: #B49542;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
          }
          .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .help-link {
            font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
            color: #C9A84C; font-weight: 600; border-bottom: 1px solid #C9A84C;
            padding-bottom: 2px; text-decoration: none; transition: all 0.3s ease;
            display: inline-block;
          }
          .help-link:hover {
            color: #B49542; border-color: #B49542;
            transform: translateX(4px);
          }
        `}</style>

        {/* Header */}
        <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#1a1a1a" }}>
          <div className="container-custom">
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>Norex Fashion Academy</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "white", marginBottom: "1rem", lineHeight: 1.1 }}>
              Apply Now
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: "500px", lineHeight: 1.8 }}>
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
              <div style={{ backgroundColor: "#FAF7F4", border: "1px solid #f0ebe3", padding: "1.5rem", borderRadius: "2px" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "0.75rem" }}>Need Help?</p>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1rem" }}>Have questions before applying? Reach out to us directly.</p>
                <a href="https://wa.me/2348081258048" target="_blank" rel="noopener noreferrer" className="help-link">
                  Chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* Form wrapped in Suspense to prevent Vercel Build errors with useSearchParams */}
            <div>
              <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>Loading form...</div>}>
                <ApplyForm onSuccess={handleSuccess} />
              </Suspense>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}