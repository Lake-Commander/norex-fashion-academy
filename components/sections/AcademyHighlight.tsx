import Link from "next/link";
import { getFeaturedCourses } from "@/lib/data/courses";
import { formatPrice } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AcademyHighlight() {
  const courses = getFeaturedCourses().slice(0, 3);

  return (
    <section style={{ backgroundColor: "#1a1a1a", paddingTop: "5rem", paddingBottom: "5rem" }}>
      <style>{`
        .courses-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media(min-width: 768px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media(min-width: 1024px) {
          .courses-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .course-card {
          display: block;
          text-decoration: none;
          background-color: #2a2a2a;
          padding: 2rem;
          transition: background-color 0.3s;
        }
        .course-card:hover { background-color: #333; }
      `}</style>

      <div className="container-custom">

        {/* Header */}
        <ScrollReveal direction="up">
          <div style={{ maxWidth: "600px", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 500, marginBottom: "1rem", display: "block" }}>
              Noxex Fashion Academy
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Learn the Art of Fashion Design
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              From your first sketch to running your own label — we equip aspiring designers with real-world skills and industry knowledge.
            </p>
          </div>
        </ScrollReveal>

        {/* Courses Grid */}
        <ScrollReveal direction="up" delay={200}>
          <div className="courses-grid">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={["/academy/courses/", course.slug].join("")}
                className="course-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C9A84C", border: "1px solid #C9A84C", padding: "0.25rem 0.75rem" }}>
                    {course.level}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                    {course.duration}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.2rem", fontWeight: 600, color: "white", marginBottom: "1rem", lineHeight: 1.3 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {course.description.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem" }}>
                  <span style={{ fontWeight: 600, color: "white", fontSize: "0.95rem" }}>
                    {formatPrice(course.price)}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                    Learn more → 
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal direction="up" delay={400}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/academy/apply" className="btn-white">
              Apply Now
            </Link>
            <Link
              href="/academy/courses"
              style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px", textDecoration: "none" }}
            >
              View All Courses →
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}