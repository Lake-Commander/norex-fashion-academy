"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Clock, Users, Award, BookOpen, ArrowRight, Loader2, Star, CheckCircle } from "lucide-react";

export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedPrograms() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) {
          // Isolate courses configured as active featured spotlights
          setCourses(data.courses.filter((c: any) => c.featured).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed syncing program tracks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedPrograms();
  }, []);

  const goldColor = "#C9A84C";

  return (
    <div className="bg-white min-h-100vh text-zinc-800 font-sans">
      <style>{`
        .perks-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 640px) { .perks-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .perks-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .courses-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media(min-width: 768px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }

        .btn-luxury-gold { display: inline-flex; align-items: center; justify-content: center; background-color: #C9A84C; color: white; padding: 1rem 2.5rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; border-radius: 1px; }
        .btn-luxury-gold:hover { background-color: #1a1a1a; transform: translateY(-2px); }

        .btn-luxury-outline { display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid rgba(255,255,255,0.25); color: white; padding: 1rem 2.5rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; border-radius: 1px; }
        .btn-luxury-outline:hover { background-color: white; color: #1a1a1a; }

        .luxury-course-card { display: flex; flexDirection: column; background: white; border: 1px solid #e4e4e7; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); border-radius: 1px; text-decoration: none; overflow: hidden; }
        .luxury-course-card:hover { border-color: #C9A84C; transform: translateY(-6px); box-shadow: 0 20px 40px rgba(201,168,76,0.04); }
        .card-img-container { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; background: #FAF7F4; }
        .card-img { width: 100%; h-full; object-fit: cover; transition: transform 0.7s; }
        .luxury-course-card:hover .card-img { transform: scale(1.02); }
      `}</style>

      {/* Hero Banner Stage */}
      <div style={{ position: "relative", paddingTop: "9rem", paddingBottom: "7rem", backgroundColor: "#0C0C0C" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/academy-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        <div className="container-custom relative z-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span style={{ color: goldColor }} className="text-[10px] font-mono tracking-[0.3em] font-black uppercase block">NOREX ATELIER ACADEMY</span>
              <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4.25rem)", fontWeight: 700, color: "white", lineHeight: 1.05 }} className="uppercase tracking-tight">
                Architectural <br /><span style={{ color: goldColor, fontStyle: "italic" }} className="lowercase">of</span> Luxury Garments
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400 font-light max-w-xl font-serif italic">
                "From pattern grid formulas to running your own fashion brand — we pass down disciplined West African design secrets alongside top contemporary master artisans."
              </p>
              <div className="flex gap-4 pt-2">
                <Link href="/academy/apply" className="btn-luxury-gold">Submit Application</Link>
                <Link href="/academy/courses" className="btn-luxury-outline">Explore Programs</Link>
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-8 border-l border-zinc-800 pl-8 hidden lg:block">
              {[{ value: "180+", label: "Certified Artisans" }, { value: "04", label: "Specialist Sectors" }, { value: "100%", label: "Placement Tracking" }].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p style={{ fontFamily: "var(--font-playfair), serif", color: goldColor }} className="text-4xl font-bold font-mono">{stat.value}</p>
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perks Breakdown Matrix View */}
      <div style={{ backgroundColor: "#FCFAF7", borderBottom: "1px solid #f4f4f5", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "4rem" }} className="space-y-2">
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">THE ACADEMY SPECIFICATION</span>
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold uppercase text-zinc-900 tracking-tight">Rigorous Structural Training</h2>
          </div>
          <div className="perks-grid">
            {[
              { icon: Clock, title: "Dual Shift Term Schedules", desc: "Morning and formal evening shifts structured natively around active operational boutique production rows." },
              { icon: Users, title: "Disciplined Cohort Limits", desc: "Strictly limited to a maximum of 15 selected apprentices per studio hall group to secure individual bodice pattern auditing." },
              { icon: Award, title: "Couture Certifications", desc: "Receive formal institutional design credentials certified directly by our Warri atelier board directors upon lookbook submission." },
              { icon: BookOpen, title: "Professional Masters Tutors", desc: "Work side-by-side with active fashion directors currently executing high-volume commercial gala pieces." }
            ].map((perk, pIdx) => {
              const Icon = perk.icon;
              return (
                <div key={pIdx} className="bg-white p-6 border border-zinc-200 text-center space-y-4 hover:border-[#C9A84C] transition-all">
                  <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto text-[#C9A84C]"><Icon size={18} /></div>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-sm font-bold uppercase tracking-wide text-zinc-900">{perk.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-light">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Featured Courses Registry Tray */}
      <div style={{ paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="container-custom">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ textAlign: "left" }}>
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CURATED SYLLABUS SPOTLIGHT</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold uppercase tracking-tight text-zinc-900">Featured Programs</h2>
            </div>
            <Link href="/academy/courses" style={{ color: goldColor }} className="text-xs font-bold uppercase tracking-wider tracking-widest flex items-center gap-1.5 hover:text-zinc-900 transition-colors text-decoration-none">
              <span>View All Training Programs</span> <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <Link key={course._id} href={`/academy/courses/${course.slug}`} className="luxury-course-card">
                  <div className="card-img-container">
                    <img src={course.image} alt={course.title} className="card-img" />
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: "white", padding: "0.25rem 0.75rem", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: goldColor, border: "1px solid #f4f4f5" }}>
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4 bg-white">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 font-bold uppercase">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                        <span>Syllabus Verified</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold text-zinc-900 uppercase leading-snug">{course.title}</h3>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-2">{course.description}</p>
                    </div>

                    <div style={{ borderTop: "1px solid #f4f4f5" }} className="pt-4 flex justify-between items-center">
                      <span className="font-mono font-bold text-[#C9A84C] text-sm">{formatPrice(course.price)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 inline-flex items-center gap-1">Inspect Track <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}