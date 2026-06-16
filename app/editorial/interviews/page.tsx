'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { Quote, MessageSquare, Loader2 } from 'lucide-react'
import { useTelemetry } from "@/hooks/useTelemetry" // ⚡ Telemetry Import

export default function EditorialInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { trackRead } = useTelemetry() // ⚡ Destructure Hook

  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await fetch("/api/editorial");
        const data = await res.json();
        if (data.success) {
          setInterviews(data.publications.filter((p: any) => p.contentType === "interview"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  // ⚡ Telemetry: Track primary transcript access logs on screen loading loops
  useEffect(() => {
    if (interviews.length > 0) {
      trackRead(interviews[0]._id);
    }
  }, [interviews, trackRead]);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />
      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">TRANSCRIPTS & Q&A</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">Interviews</h1>
          </header>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <div className="space-y-12 max-w-3xl mx-auto">
              {interviews.map((int) => (
                <div key={int._id} className="space-y-6 border-b border-gray-200 pb-10 last:border-b-0 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#C9A84C] font-black uppercase tracking-wider">{int.cast}</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#1a1a1a]">{int.title}</h2>
                  </div>

                  <div className="space-y-4 font-serif text-sm leading-relaxed text-[#333]">
                    {int.qaPairs?.map((pair: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-3">
                        <div className="flex gap-3 items-start bg-white p-4 border border-gray-200 rounded-sm">
                          <MessageSquare className="h-4 w-4 text-[#C9A84C] shrink-0 mt-1" />
                          <p className="font-bold text-[#1a1a1a]">Q: {pair.q}</p>
                        </div>
                        <div className="flex gap-3 items-start p-4">
                          <Quote className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
                          <p className="font-light"><strong>A:</strong> {pair.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <StyleOracle /><Footer />
    </main>
  )
}