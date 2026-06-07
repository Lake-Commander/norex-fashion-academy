"use client";

import React from "react";
import { motion } from "framer-motion";

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
        .testimonial-card {
          flex-shrink: 0; width: 320px; background: white;
          border: 1px solid #f0ebe3; padding: 2rem;
          transition: all 0.4s ease;
        }
        .testimonial-card:hover { border-color: #C9A84C; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
      `}</style>

      {/* Header */}
      <div className="container-custom" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "0.75rem" }}>
          What They Say
        </p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a" }}>
          Stories From Our Community
        </h2>
      </div>

      {/* Draggable Marquee */}
      <div className="cursor-grab active:cursor-grabbing">
        <motion.div 
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          drag="x"
          dragConstraints={{ left: -1000, right: 1000 }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ color: "#C9A84C", fontSize: "0.9rem" }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", borderTop: "1px solid #f0ebe3", paddingTop: "1.25rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{t.name[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a1a1a" }}>{t.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.05em", fontWeight: 600 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}