"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import Link from "next/link";

interface CollectionItem {
  _id: string;
  title: string;
  slug: string;
  waSeason: "Pluvial Drop" | "Harmattan Regal" | "August Break" | "Sultry Heat";
  campaignPlot: string;
  coverImage: string;
  photographer: string;
  stylist: string;
  castCredits: string;
}

export default function RunwayArchive() {
  const { soundEnabled } = useShop();
  
  // Database States
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [looks, setLooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    async function loadDynamicTimelineData() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        
        if (data.success && data.collections?.length > 0) {
          setCollections(data.collections);
          setLooks(data.looks || []);
          // Set initial fallback pointer focus to the most recent season document
          setActiveId(data.collections[0]._id);
        }
      } catch (err) {
        console.error("Failed querying timeline data loops:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicTimelineData();
  }, []);

  const handleSelectSeason = (collectionId: string) => {
    setActiveId(collectionId);
    if (soundEnabled) sounds.playSweep();
  };

  // Evaluate targeted element out of state arrays
  const selected = collections.find(c => c._id === activeId);
  
  // Extract connected design garment highlights automatically based on child relationships
  const computedHighlights = looks
    .filter((l: any) => l.collectionId === activeId && l.type === "look" && l.garmentName)
    .slice(0, 3)
    .map((l: any) => l.garmentName);

  const goldColor = "#C9A84C";

  if (loading) {
    return (
      <div className="bg-background py-24 text-center flex flex-col items-center justify-center gap-2 border-b border-border/25">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Syncing Timeline Registers...</p>
      </div>
    );
  }

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 transition-colors duration-500 relative">
      <style>{`
        .timeline-selector-card {
          border: 1px solid #f0ebe3; background-color: white; padding: 2rem;
          border-radius: 2px; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;
        }
      `}</style>
      
      {/* Decorative backdrop blur */}
      <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.02)" }} />

      <div className="mx-auto max-w-7xl">
        
        {/* Title row */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">10 // THE ARCHIVE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight leading-none">
            Runway Archive
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl font-light">
            A visual timeline of the house's past seasonal collections. Browse show venues, highlights, and structural silhouettes across our history.
          </p>
        </div>

        {/* Dynamic Timeline Grid */}
        {collections.length === 0 ? (
          <p className="text-zinc-400 font-mono text-xs uppercase text-left py-12 border border-dashed border-zinc-200 text-center bg-white">No active collections published to trace inside timelines.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Timeline Selector */}
            <div className="lg:col-span-4 timeline-selector-card">
              <div className="space-y-4">
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-bold uppercase block mb-6">
                  ARCHIVE COHORT CHRONOLOGY
                </span>
                
                <div style={{ borderLeftColor: "#f0ebe3" }} className="relative border-l pl-6 space-y-8 text-left">
                  {collections.map((s) => {
                    const isActive = activeId === s._id;
                    return (
                      /* Fixed: Remapped onClick hook parameter destination node directly to handleSelectSeason */
                      <div key={s._id} onClick={() => handleSelectSeason(s._id)} className="relative cursor-pointer group">
                        <span 
                          className="absolute -left-[32px] top-1 h-3 w-3 rounded-full border transition-all duration-300" 
                          style={{
                            backgroundColor: isActive ? goldColor : "white",
                            borderColor: isActive ? goldColor : "#d1d5db",
                            transform: isActive ? "scale(1.2)" : "scale(1)"
                          }}
                        />
                        <div className="space-y-0.5">
                          <span style={{ color: isActive ? goldColor : "#9ca3af" }} className="text-xs font-mono font-bold tracking-wider block">
                            {s.waSeason?.toUpperCase()}
                          </span>
                          <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className={`text-base font-bold uppercase transition-colors ${isActive ? "text-[#1a1a1a]" : "text-gray-400 group-hover:text-[#1a1a1a]"}`}>
                            {s.title.substring(0, 24)}...
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/archive"
                style={{ color: goldColor, borderTop: "1px solid #f0ebe3" }}
                className="inline-flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#1a1a1a] transition-colors pt-5 mt-6 w-full text-decoration-none font-mono"
              >
                <span>Open Master Historical Vault</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right Widescreen Details Panel */}
            {selected && (
              <div style={{ backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.05)" }} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border rounded-sm p-6 md:p-8 relative min-h-[400px]">
                
                {/* Image Box */}
                <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="md:col-span-5 aspect-[3/4] rounded-sm overflow-hidden relative shadow-2xl bg-[#FAF7F4]">
                  <img
                    src={selected.coverImage || "/placeholder-garment.png"}
                    alt={selected.title}
                    className="w-full h-full object-cover filter contrast-[1.02] grayscale"
                    style={{ animation: "fadeIn 0.5s ease-out" }}
                    key={selected._id}
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Details content */}
                <div className="md:col-span-7 text-left space-y-6">
                  <div className="space-y-1">
                    <span style={{ color: goldColor, borderBottomColor: "rgba(201, 168, 76, 0.25)" }} className="text-[8px] font-mono tracking-widest font-bold uppercase border-b pb-1 inline-block">
                      NOREX LAB // {selected.waSeason?.toUpperCase()} TRACK
                    </span>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl md:text-3xl font-bold uppercase text-white tracking-wider leading-none">
                      {selected.title}
                    </h3>
                    <span style={{ letterSpacing: "0.05em" }} className="text-[10px] font-mono text-gray-400 uppercase block pt-1">
                      Visualized: {selected.photographer} · Styled: {selected.stylist}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 font-light leading-relaxed font-serif italic text-justify">
                    "{selected.campaignPlot}"
                  </p>

                  <div style={{ borderTopColor: "rgba(255,255,255,0.05)" }} className="space-y-2 pt-4 border-t">
                    <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">Key Collection Pieces</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {computedHighlights.length === 0 ? (
                        <span className="text-[10px] text-zinc-500 font-mono italic uppercase">No separate pieces registered yet.</span>
                      ) : (
                        computedHighlights.map((h: string) => (
                          <span 
                            key={h}
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                            className="px-3 py-1 rounded-sm border text-gray-300 font-mono text-[9px] uppercase tracking-wider font-bold"
                          >
                            {h}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section> /* Fixed: Aligned layout terminal node tag specifically back to </section> */
  );
}