'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Clock, ArrowRight, Loader2 } from 'lucide-react'
import { useTelemetry } from "@/hooks/useTelemetry" // ⚡ Telemetry Import
import Link from 'next/link'

export default function EditorialStoriesPage() {
  const { soundEnabled } = useShop()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { trackRead } = useTelemetry() // ⚡ Destructure Hook

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch("/api/editorial");
        const data = await res.json();
        if (data.success) {
          setStories(data.publications.filter((p: any) => p.contentType === "story"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  // ⚡ Telemetry: Monitor index stream history tracks
  useEffect(() => {
    if (stories.length > 0) {
      trackRead(stories[0]._id);
    }
  }, [stories, trackRead]);

  const handleInteract = () => { if (soundEnabled) sounds.playPop(); }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />
      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">JOURNAL READS</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">Stories</h1>
          </header>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <div className="space-y-12">
              {stories.map((story) => (
                <article key={story._id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-200 pb-12 last:border-b-0">
                  <div className="lg:col-span-7 aspect-[16/10] bg-gray-200 border border-gray-300 rounded-sm overflow-hidden">
                    <img src={story.image || "/placeholder.png"} alt={story.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1000ms]" />
                  </div>
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex gap-4 text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                      <span>By {story.author || "Atelier Studio"}</span><span>•</span><span>{story.readTime}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#1a1a1a] leading-tight">{story.title}</h2>
                    <p className="text-xs leading-relaxed text-[#444] font-serif font-light">{story.summary}</p>
                    <Link href="/editorial" onClick={handleInteract} className="inline-flex px-6 py-3 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest gap-2 items-center text-decoration-none">
                      <span>Open Gazette Showroom</span><ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <StyleOracle /><Footer />
    </main>
  )
}