import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/CourseModel";
import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Dynamic Client Hydration Node: Safely bridges server-side layouts to user profile tracking arrays
import CourseTelemetryTracker from "@/components/academy/CourseTelemetryTracker"; 

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const course = await Course.findOne({ slug }).lean();
  if (!course) return { title: "Course Not Found" };
  return { title: `${course.title} | Norex Fashion Academy`, description: course.description };
}

export default async function DynamicCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  
  const courseDoc = await Course.findOne({ slug }).lean();
  if (!courseDoc) notFound();

  const course = JSON.parse(JSON.stringify(courseDoc));
  const levelColor = course.level === "Beginner" ? "#16a34a" : "#C9A84C";

  return (
    <div className="bg-white min-h-screen text-zinc-800 font-sans">
      {/*  Fire background context telemetry payload safely from inside Server Component rendering streams */}
      <CourseTelemetryTracker id={course._id} />

      <style>{`
        .course-detail-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }
        @media(min-width: 1024px) { .course-detail-grid { grid-template-columns: 2fr 1fr; gap: 4.5rem; } }
        .syllabus-item-card { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; background-color: #FCFAF7; border-left: 3px solid #e4e4e7; transition: all 0.3s ease; border-radius: 1px; }
        .syllabus-item-card:hover { background-color: white; border-left-color: #C9A84C; transform: translateX(4px); box-shadow: 0 10px 25px rgba(201,168,76,0.03); }
        .btn-apply-gold { display: flex; align-items: center; justify-content: center; background-color: #1a1a1a; color: white; padding: 1.1rem 2rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; width: 100%; transition: all 0.3s; border-radius: 1px; }
        .btn-apply-gold:hover { background-color: #C9A84C; transform: translateY(-2px); }
      `}</style>

      {/*  Premium Dynamic Banner with Responsive Cloudinary Background Image */}
      <div style={{ position: "relative", paddingTop: "10rem", paddingBottom: "5.5rem", width: "100%", overflow: "hidden" }}>
        {course.image ? (
          <Image 
            src={course.image} 
            alt={`${course.title} Banner`}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #121212 0%, #211A1D 100%)" }} />
        )}
        
        {/* Dark Vignette Mask Overlay to maintain strict WCAG text legibility rules */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(18,18,18,0.85) 0%, rgba(20,20,20,0.7) 100%)", zIndex: 10 }} />

        <div className="container-custom text-left" style={{ position: "relative", zIndex: 20 }}>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
            <Link href="/academy" className="hover:text-white text-decoration-none text-current">Academy</Link><ChevronRight size={10} />
            <Link href="/academy/courses" className="hover:text-white text-decoration-none text-current">Programs</Link><ChevronRight size={10} />
            <span className="text-[#C9A84C]">{course.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span style={{ color: levelColor, borderColor: levelColor }} className="text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1 border rounded-sm bg-black/60">{course.level} Course</span>
            <span className="text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1"><Clock size={14} /> Duration: {course.duration}</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 700, lineHeight: 1.1 }} className="text-white uppercase tracking-tight max-w-4xl">{course.title}</h1>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="course-detail-grid">
          <div style={{ textAlign: "left" }} className="space-y-12">
            <div className="space-y-4">
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Syllabus Overview</h2>
              <p className="text-sm font-light leading-relaxed text-zinc-500 font-serif italic">{course.description}</p>
            </div>

            <div className="space-y-4">
              <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold uppercase tracking-wide text-zinc-800">Curriculum Milestones Blueprint</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.curriculum?.map((item: string, idx: number) => (
                  <div key={idx} className="syllabus-item-card">
                    <CheckCircle size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-700 leading-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ position: "sticky", top: "7rem", backgroundColor: "#FCFAF7", border: "1px solid #e4e4e7", padding: "2rem" }} className="text-left rounded-sm shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-zinc-400 block">Tuition Allocation</span>
                <p style={{ fontFamily: "var(--font-playfair), serif", color: "#C9A84C" }} className="text-3xl font-bold font-mono">{formatPrice(course.price)}</p>
              </div>

              <div style={{ height: "1px" }} className="bg-zinc-200" />
              <Link href={`/academy/apply?course=${course.slug}`} className="btn-apply-gold text-decoration-none">Initialize Enrollment</Link>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest text-center block font-bold">Apprentice processing logs review takes 48 hours</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}