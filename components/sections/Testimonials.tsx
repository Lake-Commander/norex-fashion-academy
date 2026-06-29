"use client";

import React, { useState } from "react";
import Image from "next/image";

interface TestimonialItem {
  id: string;
  name: string;
  text: string;
  role: string;
  image?: string;
}

const testimonials: TestimonialItem[] = [
  { id: "t1", name: "Oluwatimilehin Adegoju", text: "Norex Fashion dressed me for my wedding and I felt like royalty. Every stitch was perfect.", role: "Bride", image: "oluwatimilehin.jpg" },
  { id: "t2", name: "Chioma N.", text: "The academy changed my life. I went from zero knowledge to running my own label in 6 months.", role: "Graduate" },
  { id: "t3", name: "Fatima A.", text: "The quality of their pieces is unmatched. I get compliments every time I wear Norex Fashion.", role: "Customer", image: "fatima.jpg" },
  { id: "t4", name: "Blessing I.", text: "I applied to the fashion program and it was the best decision I ever made for my career.", role: "Student" },
  { id: "t5", name: "Kemi S.", text: "Their evening wear collection is breathtaking. The craftsmanship is at par with international brands.", role: "Customer" },
  { id: "t6", name: "Ngozi E.", text: "The tutors at Norex Fashion Academy are world class. They genuinely care about your growth.", role: "Graduate", image: "ngozi.jpg" },
  { id: "t7", name: "Tolu B.", text: "Ordered my bridal outfit and the attention to detail was incredible. Highly recommend.", role: "Bride" },
  { id: "t8", name: "Adaeze M.", text: "Best fashion investment I ever made. The course paid for itself within my first client.", role: "Graduate" },
];

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: "#FAF7F4", paddingTop: "5rem", paddingBottom: "6rem", overflow: "hidden", width: "100%" }}>
      <style>{`
        /* --- Continuous CSS Infinite Marquee Engine --- */
        .marquee-container {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: loopMarquee 45s linear infinite;
        }

        /* Stops stuttering and pauses cleanly if hovered on non-touch screens */
        .marquee-wrapper:hover .marquee-container {
          animation-play-state: paused;
        }

        @keyframes loopMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* --- Reconceptualized Fluid Card Architecture --- */
        .testimonial-card {
          flex-shrink: 0;
          width: 290px;
          background: white;
          border: 1px solid #f0ebe3;
          padding: 1.75rem;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @media(min-width: 640px) {
          .testimonial-card { width: 340px; padding: 2.25rem; }
          .marquee-container { gap: 2rem; }
        }

        .testimonial-card:hover {
          border-color: #C9A84C;
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(201, 168, 76, 0.06);
        }
      `}</style>

      {/* Header Heading */}
      <div className="container-custom" style={{ textAlign: "center", marginBottom: "3.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 700, marginBottom: "0.75rem", display: "block" }}>
          What They Say
        </p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.75rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
          Stories From Our Community
        </h2>
      </div>

      {/* Marquee Track Stage Window */}
      <div className="marquee-wrapper" style={{ width: "100%", overflowX: "hidden", display: "flex", position: "relative" }}>
        {/* Double array map establishes absolute continuous alignment metrics */}
        <div className="marquee-container">
          {[...testimonials, ...testimonials].map((t, i) => {
            return (
              <div key={`${t.id}-${i}`} className="testimonial-card">
                <div style={{ textAlign: "left" }}>
                  {/* Rating Stars Frame */}
                  <div style={{ display: "flex", gap: "0.15rem", marginBottom: "1.25rem" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ color: "#C9A84C", fontSize: "0.85rem" }}>★</span>
                    ))}
                  </div>
                  
                  {/* Review Quote Body */}
                  <p style={{ fontSize: "0.88rem", color: "#4b5563", lineHeight: 1.75, marginBottom: "2rem", fontStyle: "italic", fontFamily: "var(--font-serif), Georgia, serif" }}>
                    "{t.text}"
                  </p>
                </div>

                {/* Author Information Unit */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", borderTop: "1px solid #f4f0eb", paddingTop: "1.25rem", marginTop: "auto" }}>
                  <AvatarStage item={t} />
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a1a1a", margin: "0 0 0.15rem 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.04em", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --- Isolated Profile Image Fallback Boundary Component --- */
function AvatarStage({ item }: { item: TestimonialItem }) {
  const [imageError, setImageError] = useState(false);

  // If there's an image string and no loading errors occurred, display image layout
  if (item.image && !imageError) {
    return (
      <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, border: "1px solid #FAF7F4" }}>
        <Image
          src={`/testimonials/${item.image}`}
          alt={item.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="40px"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback structural node layout for name initial lettering abbreviations
  return (
    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#FAF7F4", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#C9A84C", fontFamily: "monospace" }}>
        {item.name[0]?.toUpperCase()}
      </span>
    </div>
  );
}