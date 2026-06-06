import React from "react";

const testimonials = [
  { name: "Olwatimilehin Adegoju.", text: "Norex Fashion dressed me for my wedding and I felt like royalty. Every stitch was perfect.", role: "Bride" },
  { name: "Chioma N.", text: "The academy changed my life. I went from zero knowledge to running my own label in 6 months.", role: "Graduate" },
  { name: "Fatima A.", text: "The quality of their pieces is unmatched in Warri. I get compliments every time I wear Norex Fashion.", role: "Customer" },
  { name: "Blessing I.", text: "I applied to the fashion program and it was the best decision I ever made for my career.", role: "Student" },
  { name: "Kemi S.", text: "Their evening wear collection is breathtaking. The craftsmanship is at par with international brands.", role: "Customer" },
  { name: "Ngozi E.", text: "The tutors at Norex Fashion Academy are world class. They genuinely care about your growth.", role: "Graduate" },
  { name: "Tolu B.", text: "Ordered my bridal outfit and the attention to detail was incredible. Highly recommend.", role: "Bride" },
  { name: "Adaeze M.", text: "Best fashion investment I ever made. The course paid for itself within my first client.", role: "Graduate" },
];

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: "#FAF7F4", paddingTop: "5rem", paddingBottom: "5rem", overflow: "hidden" }}>
      <style>{`
        .marquee-wrapper {
          display: flex;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .testimonial-card {
          flex-shrink: 0;
          width: 320px;
          background: white;
          border: 1px solid #f0ebe3;
          padding: 2rem;
        }
      `}</style>

      {/* Header */}
      <div className="container-custom" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#722F37", fontWeight: 500, marginBottom: "0.75rem" }}>
          What They Say
        </p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a" }}>
          Stories From Our Community
        </h2>
      </div>

      {/* Marquee */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {/* Duplicate for seamless loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-card">
              {/* Stars */}
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ color: "#C9A84C", fontSize: "0.9rem" }}>★</span>
                ))}
              </div>
              {/* Quote */}
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", borderTop: "1px solid #f0ebe3", paddingTop: "1.25rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#722F37", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{t.name[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a1a" }}>{t.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.05em" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}