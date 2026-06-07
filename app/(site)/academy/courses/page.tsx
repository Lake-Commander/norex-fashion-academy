import Link from "next/link";
import { courses } from "@/lib/data/courses";
import { formatPrice } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Courses | Norex Fashion Academy",
  description: "Browse all fashion design courses at Norex Fashion Academy.",
};

export default function CoursesPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{`
        .cg { display: grid; grid-template-columns: 1fr; gap: 0; }
        
        .cc { 
          display: block; 
          text-decoration: none; 
          border-bottom: 1px solid #f0ebe3; 
          padding: 2.5rem 0; 
          transition: all 0.3s ease; 
        }
        
        /* Course row hover highlight */
        .cc:hover { 
          padding-left: 1.5rem; 
          background-color: #faf9f7;
          border-color: #C9A84C;
        }

        .cc-inner { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 1.5rem; 
        }
        @media(min-width: 768px) {
          .cc-inner { grid-template-columns: 2fr 1fr 1fr auto; align-items: center; }
        }

        .course-arrow {
          display: flex; align-items: center; justify-content: center; 
          width: 44px; height: 44px; border: 1px solid #e5e7eb; 
          border-radius: 50%; color: #9ca3af; flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .cc:hover .course-arrow {
          background-color: #C9A84C;
          border-color: #C9A84C;
          color: white;
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(201, 168, 76, 0.3);
        }

        /* Call to Action Buttons */
        .btn-white-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: white; color: #C9A84C;
          padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-white-solid:hover {
          background-color: #FAF7F4;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }

        .btn-outline-white {
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.3); color: white;
          padding: 0.875rem 2rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-outline-white:hover {
          background-color: white; color: #1a1a1a;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }

        /* Link hover */
        .breadcrumb-link {
          font-size: 0.72rem; color: #9ca3af; letter-spacing: 0.1em; 
          text-transform: uppercase; text-decoration: none; transition: color 0.2s ease;
        }
        .breadcrumb-link:hover {
          color: #C9A84C;
        }
      `}</style>

      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#FAF7F4", borderBottom: "1px solid #f0ebe3" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <Link href="/academy" className="breadcrumb-link">Academy</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Courses</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", lineHeight: 1.1 }}>Our Courses</h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: "500px", lineHeight: 1.8 }}>Choose from our range of professionally designed fashion programs — from beginner to advanced.</p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.5rem", borderBottom: "2px solid #1a1a1a", marginBottom: "0" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 }}>Course</p>
          <div style={{ display: "none" }} className="hidden md:flex" />
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 }}>{courses.length} Programs</p>
        </div>
        <div className="cg">
          {courses.map((course, index) => {
            // Keep specific colors for levels, but use Gold for Advanced/Intermediate
            const levelColor = course.level === "Beginner" ? "#16a34a" : "#C9A84C";
            return (
              <Link key={course.id} href={["/academy/courses/", course.slug].join("")} className="cc">
                <div className="cc-inner">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                      <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "0.85rem", color: "#d1d5db", fontWeight: 700 }}>0{index + 1}</span>
                      <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: levelColor, border: ["1px solid ", levelColor].join(""), padding: "0.2rem 0.6rem", borderRadius: "2px" }}>{course.level}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem", lineHeight: 1.2 }}>{course.title}</h2>
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, maxWidth: "500px" }}>{course.description.substring(0, 120)}...</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#555", fontSize: "0.85rem", fontWeight: 500 }}>
                    <Clock size={16} style={{ color: "#C9A84C" }} />
                    <span>{course.duration}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#C9A84C" }}>{formatPrice(course.price)}</p>
                  <div className="course-arrow">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: "#1a1a1a", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container-custom" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          <div>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1rem", fontWeight: 600 }}>Not Sure Where to Start?</p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Talk to Our Team</h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "2rem", maxWidth: "600px" }}>We will help you find the right course based on your experience level and career goals.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/academy/apply" className="btn-white-solid">Apply Now</Link>
              <Link href="/contact" className="btn-outline-white">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}