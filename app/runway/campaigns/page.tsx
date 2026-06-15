"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { Camera, UserCircle, Sparkles, X, Maximize2, Loader2 } from "lucide-react";

export default function PublicCampaignsDirectory() {
  const { soundEnabled } = useShop();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        if (data.success) setCampaigns(data.collections);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const handleOpenModal = (idx: number) => {
    if (soundEnabled) sounds.playChord();
    setSelectedIndex(idx);
  };

  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-900 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />
      <section className="relative w-full py-16 md:py-24 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          <div className="space-y-3 max-w-2xl">
            <span style={{ color: goldColor }} className="text-[10px] font-mono tracking-[0.3em] uppercase font-black block">VISUAL DIRECTION ARCHIVE</span>
            <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-zinc-900">Campaigns</h1>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider leading-relaxed">Luxury editorial campaign records detailing the core aesthetic investigations of each seasonal drop.</p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {campaigns.map((camp, idx) => (
                <div 
                  key={camp._id} 
                  onClick={() => handleOpenModal(idx)}
                  className="group bg-white border border-zinc-200 rounded-sm p-4 cursor-pointer hover:border-[#C9A84C] hover:-translate-y-1 transition-all shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100 rounded-sm mb-4">
                    <img src={camp.coverImage || "/placeholder-garment.png"} alt="" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div style={{ backgroundColor: "#1a1a1a" }} className="absolute top-3 left-3 text-white font-mono text-[8px] tracking-widest px-2 py-0.5 uppercase rounded-sm font-bold shadow">{camp.waSeason.toUpperCase()}</div>
                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><Maximize2 size={12} /></div>
                  </div>
                  <div className="space-y-1">
                    <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold uppercase tracking-wide text-zinc-900 group-hover:text-[#C9A84C] transition-colors leading-tight">{camp.title}</h3>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed font-serif italic line-clamp-2">"{camp.campaignPlot}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Detail Modal Box Overlay */}
      {selectedIndex !== null && campaigns[selectedIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedIndex(null)} />
          <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-sm p-6 md:p-8 text-left shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 mb-6">
              <span style={{ color: goldColor }} className="text-xs font-mono font-bold uppercase tracking-wider">CAMPAIGN LEDGER CONFIG // {campaigns[selectedIndex].waSeason.toUpperCase()}</span>
              <button type="button" onClick={() => setSelectedIndex(null)} className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-900 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 aspect-[3/4] rounded-sm overflow-hidden bg-zinc-50 border border-zinc-200 shadow-sm"><img src={campaigns[selectedIndex].coverImage} alt="" className="w-full h-full object-cover" /></div>
              <div className="md:col-span-6 space-y-5">
                <div className="space-y-1.5">
                  <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase text-zinc-900 leading-tight">{campaigns[selectedIndex].title}</h3>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed font-serif italic text-justify">"{campaigns[selectedIndex].campaignPlot}"</p>
                </div>
                <div className="space-y-3.5 border-t border-zinc-100 pt-4 font-mono text-[10px] uppercase text-zinc-400 font-bold">
                  <div className="flex items-center gap-2"><Camera className="h-4 w-4 text-[#C9A84C] shrink-0" /><span>Visuals: <strong className="text-zinc-800">{campaigns[selectedIndex].photographer}</strong></span></div>
                  <div className="flex items-center gap-2"><UserCircle className="h-4 w-4 text-[#C9A84C] shrink-0" /><span>Styling: <strong className="text-zinc-800">{campaigns[selectedIndex].stylist}</strong></span></div>
                  <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#C9A84C] shrink-0" /><span>Cast Selection: <strong className="text-zinc-800">{campaigns[selectedIndex].castCredits}</strong></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <StyleOracle /><Footer />
    </main>
  );
}