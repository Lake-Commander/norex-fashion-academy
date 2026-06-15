"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Loader2, Plus, Trash2, Layers, Film, Image as ImageIcon, Camera } from "lucide-react";
import { sounds } from "@/lib/sound-utils";

export default function AdminRunwayControlPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [droppingId, setDroppingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCollectionsRegistry() {
      try {
        const res = await fetch("/api/admin/runway/collections");
        const data = await res.json();
        if (data.success) setCollections(data.data);
      } catch (err) {
        console.error(err);
      } loading && setLoading(false);
    }
    loadCollectionsRegistry();
  }, []);

  const handleDeleteCollectionDrop = async (id: string, name: string) => {
    if (!confirm(`Are you completely certain you want to permanently erase "${name}"? This action triggers a cascading deletion across all attached lookbook frames.`)) return;
    setOriginalIdTracker(id);

    try {
      const res = await fetch(`/api/admin/runway/collections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCollections((prev) => prev.filter((c) => c._id !== id));
        sounds.playSweep();
      }
    } catch (err) {
      alert("Failed clearing target drops from database records.");
    } finally {
      setOriginalIdTracker(null);
    }
  };

  const [originalIdTracker, setOriginalIdTracker] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">NARRATIVE STUDIO VAULT</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Runway Collections</h1>
        </div>
        <Link href="/admin/runway/upload" className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-md hover:bg-[#C9A84C] text-decoration-none">
          <Plus className="h-4 w-4" />
          <span>Launch Runway Segment</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-2"><Loader2 className="h-7 w-7 animate-spin text-[#C9A84C]" /><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Reading collection vectors...</p></div>
      ) : collections.length === 0 ? (
        <p className="text-center p-12 text-zinc-400 font-mono text-xs uppercase border border-dashed border-zinc-200 bg-zinc-50/50 rounded-sm">Atelier digital vault registers are currently empty.</p>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
                <th className="p-4">Active Drop Title</th>
                <th className="p-4">Climatic Season Profile</th>
                <th className="p-4">Film Status</th>
                <th className="p-4">Swatches</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {collections.map((camp) => (
                <tr key={camp._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <div className="h-10 w-14 bg-zinc-100 border border-zinc-200 rounded-sm overflow-hidden relative">
                      <img src={camp.coverImage || "/placeholder-garment.png"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wide">{camp.title}</h4>
                      <p className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5">Credits: {camp.photographer} // {camp.stylist}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-zinc-100 text-zinc-700 border font-bold">
                      {camp.waSeason}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium font-mono uppercase">
                      {camp.hasFilm ? <><Film className="h-3.5 w-3.5 text-blue-500" /><span className="text-blue-700 font-bold">Cinema Logged</span></> : <><ImageIcon className="h-3.5 w-3.5 text-zinc-300" /><span className="text-zinc-400">Stills Index</span></>}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {camp.palette?.slice(0, 4).map((sw: any, sIdx: number) => (
                        <div key={sIdx} className="w-4 h-4 rounded-full border border-zinc-200 shadow-inner" style={{ backgroundColor: sw.hex }} title={sw.name} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button type="button" onClick={() => handleDeleteCollectionDrop(camp._id, camp.title)} disabled={originalIdTracker === camp._id} className="p-2 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer">
                      {originalIdTracker === camp._id ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Trash2 className="h-4 w-4" />}
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