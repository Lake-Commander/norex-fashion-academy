import Link from "next/link";
import { getFeaturedCourses } from "@/lib/data/courses";
import { formatPrice } from "@/lib/utils";
import { Clock, Users, Award, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Academy | Norex Fashion",
  description: "World-class fashion design education in Warri, Nigeria.",
};

const perks = [
  { icon: Clock, title: "Flexible Schedule", desc: "Morning and evening classes available to fit your lifestyle." },
  { icon: Users, title: "Small Class Sizes", desc: "Personalized attention with a maximum of 15 students per class." },
  { icon: Award, title: "Certification", desc: "Receive an industry-recognized certificate upon completion." },
  { icon: BookOpen, title: "Expert Tutors", desc: "Learn from working fashion professionals with real industry experience." },
];

export default function AcademyPage() {
  const courses = getFeaturedCourses();
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{`
        /* Grid Layouts */
        .perks-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 640px) { .perks-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .perks-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .courses-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media(min-width: 768px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .academy-hero-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        @media(min-width: 1024px) { .academy-hero-grid { grid-template-columns: 1fr 1fr; } }

        /* --- Hover Highlights & Interactive Elements --- */
        
        /* Buttons */
        .btn-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; border: 1px solid #C9A84C;
          padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-solid:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
        }

        .btn-outline-white {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid rgba(255,255,255,0.3); color: white;
          padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-outline-white:hover {
          background-color: white; color: #1a1a1a;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }

        .btn-white-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: white; color: #C9A84C;
          padding: 0.875rem 3rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-white-solid:hover {
          background-color: #FAF7F4;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }

        .link-hover {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #C9A84C; font-weight: 600; border-bottom: 1px solid #C9A84C;
          padding-bottom: 2px; text-decoration: none; transition: all 0.3s ease;
        }
        .link-hover:hover {
          color: #B49542; border-color: #B49542;
          transform: translateX(4px);
        }

        /* Cards */
        .course-card {
          display: block; text-decoration: none; background: #FAF7F4;
          padding: 2rem; border: 1px solid #f0ebe3; transition: all 0.4s ease;
          border-radius: 2px;
        }
        .course-card:hover {
          border-color: #C9A84C; background: white;
          transform: translateY(-6px); box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }
        
        .perk-card {
          text-align: center; padding: 2rem 1.5rem; transition: transform 0.3s ease;
          cursor: default;
        }
        .perk-card:hover {
          transform: translateY(-5px);
        }
        .perk-icon-box {
          width: 56px; height: 56px; background-color: white; border: 1px solid #f0ebe3;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem; transition: all 0.3s ease; border-radius: 2px;
        }
        .perk-card:hover .perk-icon-box {
          background-color: #C9A84C; border-color: #C9A84C;
          box-shadow: 0 6px 15px rgba(201, 168, 76, 0.3);
        }
        .perk-icon {
          color: #C9A84C; transition: color 0.3s ease;
        }
        .perk-card:hover .perk-icon {
          color: white !important;
        }
      `}</style>

      {/* Hero Section */}
      <div style={{ position: "relative", paddingTop: "8rem", paddingBottom: "6rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/academyimage.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.4 }} />
        {/* Adjusted the gradient slightly to blend better with the gold palette */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a1a 0%, rgba(201, 168, 76, 0.15) 100%)", opacity: 0.85 }} />
        <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
          <div className="academy-hero-grid">
            <div>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "1.5rem", display: "block" }}>Norex Fashion Academy</p>
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, color: "white", lineHeight: 1.05, marginBottom: "1.5rem" }}>
                Learn the Art
                <br />
                <span style={{ color: "#C9A84C", fontStyle: "italic" }}>of Fashion</span>
                <br />
                Design
              </h1>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.9, marginBottom: "2.5rem", maxWidth: "480px" }}>
                From your first sketch to running your own label — we equip aspiring designers with real-world skills and industry knowledge.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/academy/apply" className="btn-solid">Apply Now</Link>
                <Link href="/academy/courses" className="btn-outline-white">View Courses</Link>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "center" }}>
              {[{ value: "150+", label: "Graduates" }, { value: "4", label: "Programs" }, { value: "5+", label: "Years Experience" }].map((stat) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: "3px solid #C9A84C", paddingLeft: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "3rem", fontWeight: 700, color: "white", lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perks Section */}
      <div style={{ backgroundColor: "#FAF7F4", borderBottom: "1px solid #f0ebe3", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "0.75rem" }}>Why Choose Us</p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a" }}>World-Class Fashion Education</h2>
          </div>
          <div className="perks-grid">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="perk-card">
                  <div className="perk-icon-box">
                    <Icon size={22} className="perk-icon" />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem" }}>{perk.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 }}>{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div style={{ backgroundColor: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "0.75rem" }}>Our Programs</p>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a" }}>Featured Courses</h2>
            </div>
            <Link href="/academy/courses" className="link-hover">
              View All Courses <ArrowRight size={14} />
            </Link>
          </div>
          <div className="courses-grid">
            {courses.map((course) => (
              <Link key={course.id} href={["/academy/courses/", course.slug].join("")} className="course-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C9A84C", border: "1px solid #C9A84C", padding: "0.25rem 0.75rem", borderRadius: "2px" }}>{course.level}</span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500 }}>
                    <Clock size={14} />
                    {course.duration}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.875rem", lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.7, marginBottom: "1.5rem" }}>{course.description.substring(0, 100)}...</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0ebe3", paddingTop: "1.25rem" }}>
                  <span style={{ fontWeight: 700, color: "#C9A84C", fontSize: "1.05rem" }}>{formatPrice(course.price)}</span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Learn more <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: "#1a1a1a", paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1rem", fontWeight: 600 }}>Start Today</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Ready to Begin Your Fashion Journey?</h2>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", marginBottom: "2.5rem", maxWidth: "450px", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>Apply today and take the first step toward your dream career in fashion design.</p>
        <Link href="/academy/apply" className="btn-white-solid">Apply Now</Link>
      </div>
    </div>
  );
}