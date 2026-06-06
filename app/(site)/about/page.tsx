import Link from "next/link";

const values = [
  { number: "01", title: "Elegance", desc: "We believe fashion is an art form. Every piece we create reflects our commitment to timeless elegance and refined craftsmanship." },
  { number: "02", title: "Quality", desc: "From fabric selection to final stitch, we use only premium materials and techniques that stand the test of time." },
  { number: "03", title: "Empowerment", desc: "Through our academy, we empower the next generation of Nigerian fashion designers with world-class education." },
  { number: "04", title: "Authenticity", desc: "We celebrate African heritage and identity, fusing traditional aesthetics with contemporary global fashion trends." },
];

const team = [
  { name: "Norah", role: "Founder & Creative Director", bio: "With over 10 years in the fashion industry, Norah founded Norex Fashion to bridge the gap between luxury fashion and accessible education in Nigeria." },
  { name: "Norah 2", role: "Head of Academy", bio: "A graduate of the London College of Fashion, Norah brings international expertise to our curriculum, ensuring students receive world-class training." },
  { name: "Norah 3", role: "Lead Designer", bio: "Specializing in bridal and evening wear, O has dressed some of Nigeria's most prominent women for their most special occasions." },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "200+", label: "Designs Created" },
  { value: "150+", label: "Graduates" },
  { value: "5+", label: "Years of Excellence" },
];

export const metadata = {
  title: "About | Norex Fashion",
  description: "Learn about Norex Fashion - our story, values, and the team behind the brand.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{`
        .values-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media(min-width: 768px) { .values-grid { grid-template-columns: repeat(2, 1fr); } }
        
        .team-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 768px) { .team-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
        @media(min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .about-story-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media(min-width: 1024px) { .about-story-grid { grid-template-columns: 1fr 1fr; } }

        /* --- Hover Highlights & Animations --- */
        .stat-box { transition: all 0.3s ease; }
        .stat-box:hover { transform: translateY(-5px); }
        .stat-box:hover .stat-value { text-shadow: 0 4px 15px rgba(201, 168, 76, 0.3); }

        .value-card { transition: all 0.3s ease; }
        .value-card:hover { 
          transform: translateY(-5px); 
          background-color: rgba(201, 168, 76, 0.05); 
          box-shadow: inset 0 0 0 1px rgba(201, 168, 76, 0.2);
        }

        .team-card { transition: all 0.4s ease; padding: 2rem 1.5rem; border-top: 3px solid transparent; }
        .team-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 35px rgba(0,0,0,0.06); 
          border-top-color: #C9A84C !important;
          background-color: #fff;
        }

        /* --- Replaced inline JS with CSS hover --- */
        .experience-card { transition: transform 0.4s ease; }
        .experience-card:hover { transform: scale(1.02); }

        .btn-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; border: 2px solid #C9A84C;
          padding: 0.875rem 2.5rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-solid:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
        }

        .btn-outline-gold {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: transparent; color: #C9A84C; border: 2px solid #C9A84C;
          padding: 0.875rem 2.5rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-outline-gold:hover {
          background-color: #C9A84C; color: white;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.2);
        }
      `}</style>

      {/* Hero */}
      <div style={{ position: "relative", paddingTop: "10rem", paddingBottom: "7rem", backgroundColor: "#1a1a1a", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/academyimage.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a1a 60%, rgba(201, 168, 76, 0.25) 100%)" }} />
        <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1.5rem", display: "block" }}>Our Story</p>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, color: "white", lineHeight: 1.05, marginBottom: "1.5rem", maxWidth: "700px" }}>
            Fashion With Purpose,
            <br />
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Education</span> With Passion
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.9, maxWidth: "550px" }}>
            Norex Fashion was born from a simple belief - that every woman deserves to feel extraordinary, and every aspiring designer deserves world-class training.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ backgroundColor: "#FAF7F4", borderBottom: "1px solid #f0ebe3" }}>
        <div className="container-custom">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={stat.label} className="stat-box" style={{ textAlign: "center", padding: "2.5rem 1rem", borderRight: index < stats.length - 1 ? "1px solid #f0ebe3" : "none" }}>
                <p className="stat-value" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: "0.5rem", transition: "all 0.3s ease" }}>{stat.value}</p>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div style={{ paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "white" }}>
        <div className="container-custom">
          <div className="about-story-grid">
            <div>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem", display: "block" }}>Who We Are</p>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "2rem", lineHeight: 1.1 }}>
                A Warri Fashion House Like No Other
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  "Founded in 2016 in the heart of Warri, Norex Fashion began as a small atelier with a big dream - to create fashion that celebrates the modern African woman while nurturing the next generation of fashion talent.",
                  "Today, we operate two distinct verticals: a premium ready-to-wear collection that has dressed thousands of women across Nigeria, and a fashion academy that has trained over 150 aspiring designers.",
                  "Every piece we create and every student we teach carries our DNA - a relentless pursuit of excellence, creativity, and authentic African elegance.",
                ].map((text, i) => (
                  <p key={i} style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.9 }}>{text}</p>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", padding: "1rem" }}>
              {/* Removed JS handlers and added 'experience-card' class */}
              <div className="experience-card" style={{ backgroundColor: "#FAF7F4", aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f0ebe3" }}>
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "5rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: "0.5rem" }}>5+</p>
                  <p style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 }}>Years of Excellence</p>
                  <div style={{ width: "40px", height: "2px", backgroundColor: "#C9A84C", margin: "1.5rem auto" }} />
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }}>Building dreams, one stitch at a time</p>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "-0.5rem", right: "-0.5rem", width: "120px", height: "120px", backgroundColor: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px rgba(201, 168, 76, 0.3)" }}>
                <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "white", lineHeight: 1, textAlign: "center" }}>AC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ backgroundColor: "#1a1a1a", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>What Drives Us</p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "white" }}>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={value.title} className="value-card" style={{ padding: "3rem", borderRight: index % 2 === 0 ? "1px solid rgba(255,255,255,0.05)" : "none", borderBottom: index < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "3rem", fontWeight: 700, color: "rgba(201, 168, 76, 0.2)", lineHeight: 1, marginBottom: "1rem" }}>{value.number}</p>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 600, color: "white", marginBottom: "1rem" }}>{value.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ backgroundColor: "#FAF7F4", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>The People Behind The Brand</p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a" }}>Meet Our Team</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.name} className="team-card" style={{ borderTop: "3px solid #e5e7eb" }}>
                <div style={{ width: "64px", height: "64px", backgroundColor: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", borderRadius: "2px" }}>
                  <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "white" }}>{member.name[0]}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.35rem" }}>{member.name}</h3>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.25rem", fontWeight: 600 }}>{member.role}</p>
                <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.8 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: "white", borderTop: "1px solid #f0ebe3", paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1rem" }}>Join Us</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem" }}>Ready to Be Part of Our Story?</h2>
        <p style={{ fontSize: "0.95rem", color: "#555", maxWidth: "450px", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>Whether you are looking for your next statement piece or ready to launch your fashion career - we are here for you.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" className="btn-solid">Shop Collection</Link>
          <Link href="/academy/apply" className="btn-outline-gold">Apply to Academy</Link>
        </div>
      </div>
    </div>
  );
}