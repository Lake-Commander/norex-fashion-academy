"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import dynamic from "next/dynamic";
const SuccessModal = dynamic(() => import("@/components/ui/SuccessModal"), { ssr: false });

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmittedName(form.name.split(" ")[0]);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setStatus("idle");
        setShowModal(true);
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

  const contactInfo = [
    { icon: MapPin, label: "Our Location", value: "Warri, Nigeria" },
    { icon: Phone, label: "Phone", value: "+234 808 125 8048" },
    { icon: Mail, label: "Email", value: "hello@norexfashion.com" },
    { icon: Clock, label: "Working Hours", value: "Mon - Sat: 9am - 6pm" },
  ];

  return (
    <>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="contact"
        name={submittedName}
      />

      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <style>{`
          .cform-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
          @media(min-width: 1024px) { .cform-grid { grid-template-columns: 2fr 3fr; } }
          
          .cinput-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
          @media(min-width: 640px) { .cinput-row { grid-template-columns: 1fr 1fr; } }

          /* --- Form Inputs --- */
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

          /* --- Buttons --- */
          .btn-submit {
            display: inline-flex; align-items: center; justify-content: center;
            background-color: #C9A84C; color: white;
            padding: 1rem 2.5rem; font-size: 0.8rem; font-weight: 600;
            letter-spacing: 0.15em; text-transform: uppercase;
            border: none; cursor: pointer; font-family: inherit;
            transition: all 0.3s ease; border-radius: 2px; align-self: flex-start;
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

          .btn-whatsapp-solid {
            display: inline-flex; align-items: center; gap: 0.75rem;
            background-color: #25D366; color: white;
            padding: 0.875rem 1.75rem; font-size: 0.8rem; font-weight: 600;
            letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
            transition: all 0.3s ease; border-radius: 2px;
          }
          .btn-whatsapp-solid:hover {
            background-color: #20b558;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          }

          /* --- Interactive Contact Cards --- */
          .contact-item {
            display: flex; align-items: flex-start; gap: 1.25rem;
            transition: transform 0.3s ease;
            cursor: default;
          }
          .contact-item:hover {
            transform: translateX(5px);
          }
          .contact-item .icon-box {
            width: 44px; height: 44px; background-color: #FAF7F4; border: 1px solid #f0ebe3;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            transition: all 0.3s ease; border-radius: 2px;
          }
          .contact-item:hover .icon-box {
            background-color: #C9A84C; border-color: #C9A84C;
            box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
          }
          .contact-item:hover .icon-box svg {
            color: white !important;
          }
        `}</style>

        {/* Header */}
        <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#FAF7F4", borderBottom: "1px solid #f0ebe3" }}>
          <div className="container-custom">
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>Get In Touch</p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Contact Us</h1>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>We would love to hear from you. Reach out for orders, academy inquiries, or any questions.</p>
          </div>
        </div>

        {/* Main */}
        <div className="container-custom" style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
          <div className="cform-grid">

            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "2.5rem" }}>Reach Us Directly</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="contact-item">
                      <div className="icon-box">
                        <Icon size={18} style={{ color: "#C9A84C", transition: "color 0.3s ease" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.25rem", fontWeight: 600 }}>{item.label}</p>
                        <p style={{ fontSize: "0.95rem", color: "#1a1a1a", fontWeight: 500 }}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "2rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.7 }}>Prefer to chat directly? Reach us on WhatsApp for faster responses.</p>
                <a href="https://wa.me/2348081258048" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-solid">
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="cinput-row">
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required className="custom-input" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className="custom-input" />
                  </div>
                </div>
                <div className="cinput-row">
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234 808 125 8048" className="custom-input" />
                  </div>
                  <div>
                    <label style={labelStyle}>Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" required className="custom-input" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more..." required rows={6} className="custom-input" style={{ resize: "none" }} />
                </div>
                
                {status === "error" && (
                  <p style={{ fontSize: "0.85rem", color: "#dc2626" }}>Something went wrong. Please try again.</p>
                )}
                
                <button type="submit" disabled={status === "loading"} className="btn-submit">
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}