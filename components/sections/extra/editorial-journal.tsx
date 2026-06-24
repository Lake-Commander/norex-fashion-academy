"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Sparkles, Loader2, FileText } from "lucide-react";

export default function LatestEditorialsSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch("/api/editorial");
        const data = await res.json();
        if (data.success) {
          // Isolate general written stories or cover logs and slice top 3
          const latestItems = data.publications
            .filter((p: any) => p.contentType === "article" || p.contentType === "story")
            .slice(0, 3);
          setPosts(latestItems);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLatest();
  }, []);

  const goldColor = "#C9A84C";

  return (
    <section className="bg-[#white] px-6 py-24 md:px-8 border-b border-zinc-100 text-left">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-3">
              <Sparkles className="h-3 w-3" />
              <span className="text-[8px] uppercase tracking-widest font-black font-mono">09 // THE PRESS RELEASE</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl md:text-4xl font-bold text-zinc-900 uppercase tracking-tight leading-none">
              From The Gazette
            </h2>
          </div>
          <Link href="/editorial" className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:text-zinc-900 transition-colors text-decoration-none inline-flex items-center gap-1">
            <span>Read All Chronicles</span> <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
        ) : posts.length === 0 ? (
          <p className="text-zinc-400 font-mono text-xs uppercase text-center py-6">No journal updates published currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href="/editorial" key={post._id} className="group text-decoration-none space-y-4 block">
                <div className="relative aspect-[16/11] overflow-hidden bg-zinc-50 border border-zinc-200 rounded-sm">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><FileText size={28} /></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    <span style={{ color: goldColor }}>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold text-zinc-900 uppercase leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-2">{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}