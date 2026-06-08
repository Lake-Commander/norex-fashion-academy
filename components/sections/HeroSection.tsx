"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const rotatingWords = ["Artistry", "Elegance", "Culture", "Identity"];

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        setAnimating(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
      }}
    >
      <style>{`
        .hero-stats { display: none; }
        @media(min-width: 768px) {
          .hero-stats {
            display: flex; flex-direction: column; gap: 1.5rem;
            align-items: flex-end; position: absolute;
            bottom: 3rem; right: 1.5rem;
          }
        }

        .word-mask { display: inline-block; overflow: hidden; vertical-align: bottom; width: 100%; height: 1.15em; position: relative; }
        .word-inner {
          display: inline-block; color: #C9A84C; font-style: italic;
          position: absolute; bottom: 0; left: 0; white-space: nowrap;
          animation: revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .word-inner.exit { animation: hideDown 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

        @keyframes revealUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0%); opacity: 1; }
        }
        @keyframes hideDown {
          0% { transform: translateY(0%); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }

        /* --- Hover Animations --- */
        .btn-gold-hover {
          background-color: white; color: #1a1a1a;
          padding: 0.875rem 2rem; fontSize: 0.78rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border: 1px solid white;
        }
        .btn-gold-hover:hover {
          background-color: #C9A84C; color: white; border-color: #C9A84C;
          transform: translateY(-3px); box-shadow: 0 10px 25px rgba(201, 168, 76, 0.3);
        }

        .explore-link {
          font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase;
          font-weight: 500; color: white; display: flex; alignItems: center; gap: 0.5rem;
          padding-bottom: 2px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .explore-link:hover { color: #C9A84C; border-color: #C9A84C; }
      `}</style>

      {/* Video Background */}
      <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}>
        <source src="/adornvideo.mp4" type="video/mp4" />
      </video>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />

      <div className="container-custom" style={{ position: "relative", zIndex: 10, paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600 }}>
              Delta, Warri, Nigeria · Est. 2016
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "white", marginBottom: "1.5rem" }}>
            Where <br /> Fashion <br /> Meets{" "}
            <span className="word-mask">
              <span key={currentWord} className={`word-inner ${animating ? "exit" : ""}`}>
                {rotatingWords[currentWord]}
              </span>
            </span>
          </h1>

          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, maxWidth: "480px", marginBottom: "2.5rem" }}>
            Discover premium ready-to-wear collections and world-class fashion education — all under one elegant roof.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
            <Link href="/shop" className="btn-gold-hover">Shop Collection</Link>
            <Link href="/academy" className="explore-link">Explore Academy →</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "200+", label: "Designs" },
            { value: "150+", label: "Graduates" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}