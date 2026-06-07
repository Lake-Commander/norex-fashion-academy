import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { formatPrice } from "@/lib/utils";
import { Clock, CheckCircle, Users, Award } from "lucide-react";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const levelColor = course.level === "Beginner" ? "#16a34a" : "#C9A84C";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <style>{`
        /* Layout Grids */
        .cg { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        @media(min-width: 1024px) { .cg { grid-template-columns: 2fr 1fr; } }
        
        .curr-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media(min-width: 640px) { .curr-grid { grid-template-columns: 1fr 1fr; } }

        /* --- Hover Highlights & Animations --- */
        
        .breadcrumb-link {
          font-size: 0.72rem; color: rgba(255,255,255,0.5); letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none; transition: color 0.3s ease;
        }
        .breadcrumb-link:hover {
          color: #C9A84C;
        }

        .curr-item {
          display: flex; align-items: flex-start; gap: 0.875rem; padding: 1rem;
          background-color: #FAF7F4; border-left: 3px solid #e5e7eb;
          transition: all 0.3s ease; border-radius: 0 4px 4px 0;
        }
        .curr-item:hover {
          background-color: white; border-left-color: #C9A84C;
          transform: translateX(6px); box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .perk-card {
          padding: 1.5rem; border: 1px solid #f0ebe3; background-color: white;
          transition: all 0.4s ease; border-radius: 2px;
        }
        .perk-card:hover {
          border-color: #C9A84C; transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.04);
        }

        /* Buttons */
        .btn-gold-solid {
          display: flex; align-items: center; justify-content: center;
          background-color: #C9A84C; color: white; padding: 1rem 2rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; width: 100%;
          transition: all 0.3s ease; border-radius: 2px; border: 1px solid #C9A84C;
        }
        .btn-gold-solid:hover {
          background-color: #B49542; border-color: #B49542;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
        }

        .btn-white-solid {
          display: inline-flex; align-items: center; justify-content: center;
          background-color: white; color: #C9A84C; padding: 0.875rem 2.5rem;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-white-solid:hover {
          background-color: #FAF7F4;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }

        .btn-outline-white {
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.9);
          padding: 0.875rem 2.5rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border-radius: 2px;
        }
        .btn-outline-white:hover {
          background-color: white; color: #1a1a1a; border-color: white;
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2);
        }
      `}</style>

      {/* Hero Header */}
      <div style={{ paddingTop: "8rem", paddingBottom: "4rem", background: "linear-gradient(135deg, #1a1a1a 0%, #2d1f23 100%)" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link href="/academy" className="breadcrumb-link">Academy</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link href="/academy/courses" className="breadcrumb-link">Courses</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{course.title}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: levelColor, border: ["1px solid ", levelColor].join(""), padding: "0.3rem 0.875rem", borderRadius: "2px" }}>{course.level}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 500 }}>
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
          </div>
          
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: "1.5rem", maxWidth: "700px" }}>{course.title}</h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.9, maxWidth: "600px" }}>{course.description}</p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
        <div className="cg">
          {/* Main Content Area */}
          <div>
            <div style={{ marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "2rem" }}>What You Will Learn</h2>
              <div className="curr-grid">
                {course.curriculum.map((item) => (
                  <div key={item} className="curr-item">
                    <CheckCircle size={18} style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "2rem" }}>Why Choose This Course</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {[
                  { icon: Users, title: "Small Class Sizes", desc: "Max 15 students per class for personalized attention" },
                  { icon: Award, title: "Certification", desc: "Receive an industry-recognized certificate on completion" },
                  { icon: Clock, title: "Flexible Schedule", desc: "Morning and evening classes available" },
                  { icon: CheckCircle, title: "Expert Tutors", desc: "Learn from working fashion professionals" },
                ].map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <div key={perk.title} className="perk-card">
                      <Icon size={24} style={{ color: "#C9A84C", marginBottom: "1rem" }} />
                      <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>{perk.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6 }}>{perk.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div>
            <div style={{ border: "1px solid #f0ebe3", padding: "2.5rem 2rem", position: "sticky", top: "6rem", backgroundColor: "white", borderRadius: "2px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.5rem", fontWeight: 600 }}>Course Fee</p>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.5rem", fontWeight: 700, color: "#C9A84C", marginBottom: "0.5rem" }}>{formatPrice(course.price)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.85rem", marginBottom: "2rem", fontWeight: 500 }}>
                <Clock size={16} style={{ color: "#C9A84C" }} />
                <span>Duration: {course.duration}</span>
              </div>
              
              <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "2rem" }} />
              
              {/* Added the course query parameter here */}
              <Link href={`/academy/apply?course=${course.slug}`} className="btn-gold-solid" style={{ marginBottom: "1rem" }}>
                Apply for This Course
              </Link>
              <p style={{ fontSize: "0.72rem", color: "#9ca3af", textAlign: "center", marginBottom: "2rem", fontWeight: 500 }}>Applications reviewed within 48 hours</p>
              
              <div style={{ height: "1px", backgroundColor: "#f0ebe3", marginBottom: "2rem" }} />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["Small class sizes (max 15)", "Certificate upon completion", "Flexible morning and evening schedules", "Expert industry tutors"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C9A84C", flexShrink: 0, marginTop: "6px" }} />
                    <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "#1a1a1a", paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1rem", fontWeight: 600 }}>Ready to Start?</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Begin Your Fashion Journey Today</h2>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", marginBottom: "2.5rem", maxWidth: "450px", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>Join our community of aspiring designers and take the first step toward your dream career.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {/* And here as well */}
          <Link href={`/academy/apply?course=${course.slug}`} className="btn-white-solid">Apply Now</Link>
          <Link href="/academy/courses" className="btn-outline-white">View All Courses</Link>
        </div>
      </div>
    </div>
  );
}