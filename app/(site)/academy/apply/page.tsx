"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, Upload, MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";

const SuccessModal = dynamic(() => import("@/components/ui/SuccessModal"), { ssr: false });

function ApplyFormContent({ onSuccess }: { onSuccess: (name: string) => void }) {
  const searchParams = useSearchParams();
  const preSelectedCourse = searchParams.get("course") || "";

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [status, setStatus] = useState("idle");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: preSelectedCourse,
    experienceLevel: "",
    message: "",
  });

  // Sync available selection tracks straight from live database collections
  useEffect(() => {
    async function fetchFormDropdowns() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } catch (err) {
        console.error("Form synchronization interrupted:", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchFormDropdowns();
  }, []);

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
    display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.4rem", textAlign: "left"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="apply-input-row">
        <div>
          <label style={labelStyle}>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full identity" required className="custom-input" />
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
        <label style={labelStyle}>Select Targeted Track Program</label>
        {loadingCourses ? (
          <div className="flex p-3 border border-zinc-200 bg-zinc-50 rounded-sm text-xs items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin text-[#C9A84C]" /> Synchronizing tracks...</div>
        ) : (
          <select name="course" value={form.course} onChange={handleChange} required className="custom-input" style={{ cursor: "pointer" }}>
            <option value="">Choose an instruction track...</option>
            {courses.map((c) => (
              <option key={c._id} value={c.slug}>{c.title} — [{c.duration}]</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label style={labelStyle}>Prior Sewing Experience Level</label>
        <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required className="custom-input" style={{ cursor: "pointer" }}>
          <option value="">Select your baseline profile...</option>
          <option value="no-experience">No Experience — Complete Beginner</option>
          <option value="some-experience">Some Experience — Self-Taught</option>
          <option value="intermediate">Intermediate — Formal Studio Background</option>
          <option value="professional">Professional — Active Apparel Venture</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Apprentice Objectives Narrative (optional)</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Share your long-term couture goals or brand launch timelines..." rows={4} className="custom-input" style={{ resize: "none" }} />
      </div>
      
      {status === "error" && <p className="text-xs font-mono uppercase text-red-600 font-bold">Enrollment submission transaction rejected.</p>}
      
      <button type="submit" disabled={status === "loading" || loadingCourses} className="btn-submit w-full mt-2">
        {status === "loading" ? "Processing application..." : "Commit Application Registry"}
      </button>
    </form>
  );
}

export default function ApplyPage() {
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  return (
    <>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} type="application" name={submittedName} />

      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <style>{`
          .apply-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
          @media(min-width: 1024px) { .apply-grid { grid-template-columns: 2fr 3fr; gap: 5rem; } }
          .apply-input-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
          @media(min-width: 640px) { .apply-input-row { grid-template-columns: 1fr 1fr; } }
          .custom-input { width: 100%; border: 1px solid #e4e4e7; padding: 0.875rem 1rem; font-size: 0.85rem; color: #1a1a1a; outline: none; transition: border-color 0.2s; border-radius: 1px; background: #FCFAF7; }
          .custom-input:focus { border-color: #C9A84C; background: white; }
          .btn-submit { display: flex; align-items: center; justify-content: center; background-color: #1a1a1a; color: white; padding: 1.1rem 2.5rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
          .btn-submit:hover:not(:disabled) { background-color: #C9A84C; transform: translateY(-2px); }
          .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
          .help-link { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #C9A84C; font-weight: 700; border-bottom: 1px solid #C9A84C; padding-bottom: 2px; text-decoration: none; transition: transform 0.2s; display: inline-block; }
          .help-link:hover { transform: translateX(4px); }
        `}</style>

        <div style={{ paddingTop: "9rem", paddingBottom: "4.5rem", backgroundColor: "#0C0C0C" }}>
          <div className="container-custom text-left">
            <span style={{ color: "#C9A84C" }} className="text-[10px] font-mono tracking-[0.3em] font-black uppercase block mb-1">NOREX ADMISSION PORTAL</span>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, color: "white", lineHeight: 1.1 }}>Apprentice Enrollment</h1>
            <p className="text-sm font-light text-zinc-400 max-w-md">Initialize your design career trajectory. Complete the verification metrics layout to lock your studio slot.</p>
          </div>
        </div>

        <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
          <div className="apply-grid">
            
            <div style={{ textAlign: "left" }} className="space-y-6">
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-tight text-zinc-900">The Onboarding Sequence</h2>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Submit File Credentials", desc: "File your training preference vectors using our centralized layout matrix." },
                  { step: "02", title: "Apprentice Review Loop", desc: "Atelier board directory audits prior experience lines within 48 hours." },
                  { step: "03", title: "Studio Goal Allocation Call", desc: "Brief diagnostic synchronization check to evaluate patterns tracking expectations." }
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-playfair), serif", color: "#e4e4e7" }} className="text-2xl font-bold font-mono leading-none shrink-0">{item.step}</span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-800">{item.title}</h3>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ backgroundColor: "#FCFAF7", border: "1px solid #e4e4e7", padding: "1.5rem" }}>
                <p className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider mb-1">Direct Consultant Core</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed mb-3">Require structural term clarification queries prior to registration?</p>
                <a href="https://wa.me/2348081258048" target="_blank" rel="noopener noreferrer" className="help-link">Connect via WhatsApp →</a>
              </div>
            </div>

            <div>
              <Suspense fallback={<div className="text-xs font-mono text-zinc-400 uppercase py-12">Compiling registry modules...</div>}>
                <ApplyFormContent onSuccess={(name) => { setSubmittedName(name); setShowModal(true); }} />
              </Suspense>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}