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
        .hero-stats {
          display: none;
        }
        @media(min-width: 768px) {
          .hero-stats {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-end;
            position: absolute;
            bottom: 3rem;
            right: 1.5rem;
          }
        }

        .word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          width: 100%;
          height: 1.15em;
          position: relative;
}

        .word-inner {
          display: inline-block;
          color: #C9A84C;
          font-style: italic;
          position: absolute;
          bottom: 0;
          left: 0;
          white-space: nowrap;
          animation: revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .word-inner.exit {
          animation: hideDown 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes revealUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        @keyframes hideDown {
          0% {
            transform: translateY(0%);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
      `}</style>

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.65,
        }}
      >
        <source src="/adornvideo.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        className="container-custom"
        style={{ position: "relative", zIndex: 10, paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div style={{ maxWidth: "700px" }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C", flexShrink: 0 }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 500 }}>
              Delta, Warri, Nigeria · Est. 2016
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "white",
              marginBottom: "1.5rem",
            }}
          >
            Where
            <br />
            Fashion
            <br />
            Meets{" "}
            <span className="word-mask">
              <span
                key={currentWord}
                className={`word-inner ${animating ? "exit" : ""}`}
              >
                {rotatingWords[currentWord]}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8,
            maxWidth: "480px",
            marginBottom: "2.5rem",
          }}>
            Discover premium ready-to-wear collections and world-class fashion education — all under one elegant roof.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <Link
              href="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                color: "#722F37",
                padding: "0.875rem 2rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Shop Collection
            </Link>
            <Link
              href="/academy"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.4)",
                paddingBottom: "2px",
                textDecoration: "none",
              }}
            >
              Explore Academy →
            </Link>
          </div>
        </div>

        {/* Stats - Desktop Only */}
        <div className="hero-stats">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "200+", label: "Designs" },
            { value: "150+", label: "Graduates" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "white", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Scroll</span>
          <div style={{ width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </section>
  );
}