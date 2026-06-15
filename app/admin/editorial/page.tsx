"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, Loader2, BookOpen, BarChart2, MessageSquare, FileText } from "lucide-react";
import { sounds } from "@/lib/sound-utils";

interface EditorialItem {
  _id: string;
  title: string;
  contentType: "article" | "insight" | "interview" | "story";
  category: string;
  featured: boolean;
  date: string;
}

export default function EditorialDirectoryPage() {
  const [publications, setPublications] = useState<EditorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/editorial");
        const data = await res.json();
        if (data.success) setPublications(data.publications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleFeatured = async (id: string, currentState: boolean) => {
    setProcessingId(`${id}-featured`);
    try {
      const res = await fetch(`/api/admin/editorial/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentState })
      });
      const data = await res.json();
      if (data.success) {
        setPublications((prev) => prev.map((p) => (p._id === id ? { ...p, featured: !currentState } : p)));
        sounds.playClick();
      }
    } catch (err) {
      alert("Failed toggling homepage showcase mapping.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeletePublication = async (id: string, name: string) => {
    if (!confirm(`Permanently drop "${name}" from the Gazette registries?`)) return;
    setProcessingId(`${id}-delete`);
    try {
      const res = await fetch(`/api/admin/editorial/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPublications((prev) => prev.filter((p) => p._id !== id));
        sounds.playSweep();
      }
    } catch (err) {
      alert("Failed expunging publication ledger entry.");
    } finally {
      setProcessingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "insight": return <BarChart2 size={14} className="text-blue-500" />;
      case "interview": return <MessageSquare size={14} className="text-purple-500" />;
      case "story": return <BookOpen size={14} className="text-emerald-500" />;
      default: return <FileText size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">GAZETTE PRESS ROOM</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Publications Directory</h1>
        </div>
        <Link href="/admin/editorial/upload" className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-md hover:bg-[#C9A84C] text-decoration-none">
          <Plus className="h-4 w-4" />
          <span>Publish Entry</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-2"><Loader2 className="h-7 w-7 animate-spin text-[#C9A84C]" /><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Streaming logs...</p></div>
      ) : publications.length === 0 ? (
        <p className="text-center p-12 text-zinc-400 font-mono text-xs uppercase border border-dashed border-zinc-200 bg-zinc-50/50 rounded-sm">Newsroom indices empty.</p>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
                <th className="p-4">Publication Title Document</th>
                <th className="p-4">Format Channel</th>
                <th className="p-4">Category Node</th>
                <th className="p-4">Date Stamped</th>
                <th className="p-4 text-center">Homepage Spot</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {publications.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 font-bold text-zinc-900 uppercase text-xs tracking-wide max-w-sm truncate">{item.title}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide font-bold text-zinc-500">
                      {getIcon(item.contentType)} <span>{item.contentType}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">{item.category}</td>
                  <td className="p-4 text-xs font-mono text-zinc-400 whitespace-nowrap">{item.date || "Unstamped"}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <button type="button" onClick={() => handleToggleFeatured(item._id, item.featured)} disabled={processingId !== null} className={`p-2 rounded border flex items-center gap-1.5 transition-all ${item.featured ? "bg-amber-50 border-[#C9A84C] text-[#C9A84C]" : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"}`}>
                        {processingId === `${item._id}-featured` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className={`h-3.5 w-3.5 ${item.featured ? "fill-current" : ""}`} />}
                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Slider</span>
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button type="button" onClick={() => handleDeletePublication(item._id, item.title)} disabled={processingId === `${item._id}-delete`} className="p-2 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition-all">
                      {processingId === `${item._id}-delete` ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}