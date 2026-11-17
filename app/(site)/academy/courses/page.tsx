"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Clock, ArrowRight, Loader2, Sliders } from "lucide-react";

export default function CoursesHub() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filter Configurations States
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [sortOrder, setSortOption] = useState<string>("default");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } catch (err) {
        console.error("Catalog track compilation failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Compute live multi-dimensional lookup vectors completely in memory
  const filteredCatalog = useMemo(() => {
    let result = [...courses];

    if (selectedLevel !== "All") {
      result = result.filter((c) => c.level === selectedLevel);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((c) =>
        [c.title, c.description, c.level]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }
    if (sortOrder === "low-to-high") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "high-to-low") result.sort((a, b) => b.price - a.price);

    return result;
  }, [courses, selectedLevel, sortOrder, searchQuery]);

  return (
    <div className="bg-white min-h-screen text-zinc-800">
      {/* Banner Head Frame */}
      <div style={{ paddingTop: "8.5rem", paddingBottom: "3.5rem", backgroundColor: "#FCFAF7", borderBottom: "1px solid #e4e4e7" }}>
        <div className="container-custom text-left">
          <div className="flex gap-2 items-center text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
            <Link href="/academy" className="hover:text-[#C9A84C] text-decoration-none text-current">Academy</Link><span>/</span><span className="text-[#C9A84C]">Courses</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl md:text-4xl font-bold uppercase text-zinc-900 tracking-tight">Explore Our Courses</h1>
          <p className="text-sm text-zinc-500 font-light mt-1 max-w-xl">Learn fashion design with practical courses for every skill level.</p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INTERACTIVE EDX SIDEBAR LOOKUP (3 Columns) */}
          <div className="lg:col-span-3 space-y-6 text-left bg-zinc-50/60 p-4 border border-zinc-200 rounded-sm">
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-2.5 mb-2">
              <Sliders className="h-4 w-4 text-[#C9A84C]" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-900">Find a Course</span>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
              className="w-full border border-zinc-300 bg-white p-2 text-xs focus:outline-none focus:border-[#C9A84C]"
            />

            {/* Level Sorting Block */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Skill level</h4>
              <div className="flex flex-col gap-1">
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-all font-semibold uppercase tracking-wide cursor-pointer ${
                      selectedLevel === level ? "bg-[#1a1a1a] text-white font-bold" : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {level === "All" ? "All Skill Levels" : `${level} Program`}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Sorting Block */}
            <div className="space-y-2 pt-4 border-t border-zinc-200">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Sort by price</h4>
              <select value={sortOrder} onChange={(e) => setSortOption(e.target.value)} className="w-full text-xs font-semibold bg-white border border-zinc-300 p-2 focus:outline-none focus:border-[#C9A84C]">
                <option value="default">Recommended</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* RIGHT DATA YIELD LIST ROW (9 Columns) */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-4">
              <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-400 uppercase">Courses</span>
              <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-900 uppercase font-bold">{filteredCatalog.length} {filteredCatalog.length === 1 ? "course" : "courses"}</span>
            </div>

            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-2"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /><span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Loading courses...</span></div>
            ) : filteredCatalog.length === 0 ? (
              <p className="text-zinc-400 font-mono text-xs uppercase text-center py-16 bg-zinc-50 border border-dashed border-zinc-200">No courses match your search or filters.</p>
            ) : (
              <div className="divide-y divide-zinc-200 border-b border-zinc-200">
                {filteredCatalog.map((course, idx) => (
                  <Link key={course._id} href={`/academy/courses/${course.slug}`} className="block py-6 transition-all hover:bg-zinc-50/50 hover:px-4 text-decoration-none group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      <div className="md:col-span-7 space-y-2 text-left">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-zinc-300">0{idx + 1}</span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border bg-white border-zinc-200 text-zinc-700">{course.level}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold text-zinc-900 uppercase group-hover:text-[#C9A84C] transition-colors">{course.title}</h3>
                        <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-xl">{course.description.substring(0, 140)}...</p>
                      </div>

                      <div className="md:col-span-2 text-left md:text-center font-mono text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5 justify-start md:justify-center">
                        <Clock size={14} className="text-[#C9A84C]" /> <span>{course.duration}</span>
                      </div>

                      <div className="md:col-span-2 text-left md:text-center font-mono font-bold text-[#C9A84C] text-sm">
                        {formatPrice(course.price)}
                      </div>

                      <div className="md:col-span-1 flex justify-end">
                        <div className="w-9 h-34 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-white transition-all transform group-hover:translateX(3px)"><ArrowRight size={14} /></div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}