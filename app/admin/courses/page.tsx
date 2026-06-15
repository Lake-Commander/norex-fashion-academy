"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, Loader2, BookOpen, Clock, Layers } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { sounds } from "@/lib/sound-utils";

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  price: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  curriculum: string[];
  featured: boolean;
}

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch course metrics on layout initialization mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/admin/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed querying academy syllabus registries:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Toggles whether the course gets highlighted on the main Academy page spotlight
  const handleToggleFeatured = async (id: string, currentFeaturedState: boolean) => {
    setProcessingId(`${id}-featured`);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeaturedState })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c._id === id ? { ...c, featured: !currentFeaturedState } : c))
        );
        sounds.playClick();
      }
    } catch (err: any) {
      alert(`CMS Update Interrupted: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Permanently drops a program track out of MongoDB storage clusters
  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Are you absolutely certain you want to permanently erase "${title}" from the academy curriculum?`)) return;

    setProcessingId(`${id}-delete`);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        sounds.playSweep();
      }
    } catch (err) {
      alert("Failed expunging program record from collections.");
    } finally {
      setProcessingId(null);
    }
  };

  const goldColor = "#C9A84C";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-zinc-800">
      
      {/* Dynamic Header Block Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">ACADEMY PROGRAM COHORTS</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Curriculum Registry</h1>
        </div>
        
        <Link 
          href="/admin/courses/upload"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-md hover:bg-[#C9A84C] text-decoration-none"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
          <p className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Synchronizing Academy Class Nodes...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-200 bg-zinc-50/50 rounded-sm space-y-3">
          <BookOpen className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700">No Tracks Configured</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">Your academic index database is empty. Map your first dynamic learning program to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
                  <th className="p-4">Instruction Program</th>
                  <th className="p-4">Tuition Allocation</th>
                  <th className="p-4">Duration Term</th>
                  <th className="p-4">Skill Tier Level</th>
                  <th className="p-4">Syllabus Chapters</th>
                  <th className="p-4 text-center">Spotlight Placement</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {courses.map((course) => {
                  const tierColor = course.level === "Beginner" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50/50 border-amber-200";
                  return (
                    <tr key={course._id} className="hover:bg-zinc-50/50 transition-colors">
                      
                      {/* Image Thumbnail & Title Column Block */}
                      <td className="p-4 flex items-center gap-4 min-w-[280px]">
                        <div className="h-12 w-16 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shrink-0 relative">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-zinc-900 truncate uppercase text-xs tracking-wide">{course.title}</h4>
                          <span className="text-[9px] font-mono text-zinc-400 lowercase truncate block mt-0.5">/academy/courses/{course.slug}</span>
                        </div>
                      </td>

                      {/* Tuition Fee Column */}
                      <td className="p-4 font-mono font-bold text-zinc-700 min-w-[125px]">
                        {formatPrice(course.price)}
                      </td>

                      {/* Duration Column */}
                      <td className="p-4 text-xs font-medium text-zinc-600 font-mono inline-flex items-center gap-1.5 pt-6">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{course.duration}</span>
                      </td>

                      {/* Skill Tier Badge Column */}
                      <td className="p-4">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold ${tierColor}`}>
                          {course.level}
                        </span>
                      </td>

                      {/* Curriculum Milestones Counter Summary */}
                      <td className="p-4 text-xs font-mono text-zinc-400 font-bold min-w-[100px]">
                        <span className="text-zinc-700">{course.curriculum?.length || 0}</span> Modules
                      </td>

                      {/* Spotlight Toggle Button Frame */}
                      <td className="p-4 text-center min-w-[130px]">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(course._id, course.featured)}
                            disabled={processingId !== null}
                            className={`p-2 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                              course.featured 
                                ? "bg-amber-50 border-[#C9A84C] text-[#C9A84C]" 
                                : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                            }`}
                            title="Toggle spotlight visibility banner on Academy Home"
                          >
                            {processingId === `${course._id}-featured` ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Star className={`h-3.5 w-3.5 ${course.featured ? "fill-current" : ""}`} />
                            )}
                            <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Spotlight</span>
                          </button>
                        </div>
                      </td>

                      {/* Trash Removal Action Column */}
                      <td className="p-4 text-right min-w-[90px]">
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          disabled={processingId === `${course._id}-delete`}
                          className="p-2 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer"
                          title="Expunge entire program sequence from directory indices"
                        >
                          {processingId === `${course._id}-delete` ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}