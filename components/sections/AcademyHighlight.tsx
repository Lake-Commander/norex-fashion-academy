'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Loader2, BookOpen } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  image: string;
  featured: boolean;
}

export default function FeaturedCourses() {
  const { soundEnabled } = useShop()
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Stagger offsets array to maintain your high-fashion asymmetrical layout grid
  const styleOffsets = ['lg:mt-0', 'lg:mt-12', 'lg:mt-24']

  useEffect(() => {
    async function fetchFeaturedPrograms() {
      try {
        const res = await fetch('/api/courses')
        const data = await res.json()
        
        if (data.success && data.courses) {
          // Isolate courses toggled for the homepage spotlight, maximum of 4 for the grid layout
          const featuredItems = data.courses.filter((c: CourseItem) => c.featured).slice(0, 4)
          setCourses(featuredItems)
        }
      } catch (err) {
        console.error('Failed fetching storefront academy spotlights:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedPrograms()
  }, [])

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <div className="bg-background px-4 py-14 md:px-8 md:py-20 border-b border-border/25 relative">
      <style>{`
        .course-feature-card {
          cursor: pointer; background-color: white; border: 1px solid #f0ebe3;
          padding: 1rem; border-radius: 2px; transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          text-decoration: none; display: block;
        }
        .course-feature-card:hover {
          border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.06);
          transform: translateY(-4px);
        }
        .course-feature-card:hover .course-img {
          transform: scale(1.02);
        }
        .course-img {
          transition: transform 0.8s ease;
        }
      `}</style>
      
      <div className="mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-8 text-center md:mb-12">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">05 / ACADEMY EDUCATION SPOKE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight leading-none">
            Featured Programs
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto font-light">
            Train under professional master couturiers. Explore elite structural fashion modules actively curated inside our technical workshops.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Streaming Active Showrooms...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono uppercase tracking-wider">
            No active academy modules currently toggled for the landing spotlight.
          </div>
        ) : (
          /* Asymmetric Offset grid layout matrix matching lookbook rules */
          <div className="grid grid-cols-2 gap-3 items-start md:gap-6 lg:grid-cols-4 lg:gap-8">
            {courses.map((course, idx) => {
              const offsetClass = styleOffsets[idx % styleOffsets.length]
              
              return (
                <Link 
                  href={`/academy/courses/${course.slug}`}
                  key={course._id} 
                  onMouseEnter={handleInteract}
                  onClick={() => { if (soundEnabled) sounds.playClick() }}
                  className={`course-feature-card ${offsetClass}`}
                >
                  {/* Image Canvas Container */}
                  <div className="relative aspect-3/4 overflow-hidden rounded-sm mb-3 bg-[#FAF7F4] border border-gray-100 md:mb-4">
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover course-img filter contrast-[1.01]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <BookOpen size={32} />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
                    
                    {/* Floating Meta titles inside card overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 text-left">
                      <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold block uppercase border border-[#C9A84C]/30 bg-black/40 px-2 py-0.5 rounded-sm w-fit">
                        {course.level} TRACK
                      </span>
                      <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold tracking-tight uppercase leading-none text-white">{course.title}</h3>
                    </div>
                  </div>

                  {/* Outside Card Structural Metadata details text summary */}
                  <div className="space-y-2 px-1 pb-1 text-left md:space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-100 md:pt-3">
                      <div className="text-[9px] font-mono text-zinc-400 font-bold uppercase">
                        Duration // {course.duration}
                      </div>
                      <span style={{ color: goldColor }} className="text-xs font-bold font-mono">
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    <div style={{ color: goldColor }} className="flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-wider pt-1 md:text-[9px]">
                      <span>Review Program Syllabus</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}