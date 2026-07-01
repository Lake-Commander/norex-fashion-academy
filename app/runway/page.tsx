"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
import { useShop } from "@/context/ShopContext";
import { sounds } from "@/lib/sound-utils";
import { X, Maximize2, Volume2, VolumeX, Layers, Camera, Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry"; // ⚡ Telemetry Import

export default function DynamicRunwayShowcase() {
  const { soundEnabled } = useShop();
  const [activeTab, setActiveTab] = useState<"looks" | "backstage">("looks");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  
  const [looks, setLooks] = useState<any[]>([]);
  const [backstage, setBackstage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { trackVideo } = useTelemetry(); // ⚡ Destructure Hook
  const youtubePlayerRef = useRef<any>(null);

  useEffect(() => {
    async function loadActiveShowroomTracks() {
      try {
        const res = await fetch("/api/runway");
        const data = await res.json();
        if (data.success && data.looks) {
          setLooks(data.looks.filter((l: any) => l.type === "look"));
          setBackstage(data.looks.filter((l: any) => l.type === "backstage"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveShowroomTracks();
  }, []);

  // ⚡ Telemetry: Track background fashion stream video code index context when lightbox triggers
  useEffect(() => {
    if (lightboxIndex !== null && looks[lightboxIndex]) {
      trackVideo(`look-${looks[lightboxIndex].lookNumber}`);
    }
  }, [lightboxIndex, looks, trackVideo]);

  useEffect(() => {
    let fadeTimer: any = null;
    if (typeof window !== "undefined") {
      const initPlayer = () => {
        youtubePlayerRef.current = new (window as any).YT.Player("youtube-bg-player-runway", {
          videoId: "6BbI6VZOx9Q",
          playerVars: {
            autoplay: 1, mute: 1, loop: 1, playlist: "6BbI6VZOx9Q",
            controls: 0, showinfo: 0, rel: 0, modestbranding: 1,
            iv_load_policy: 3, disablekb: 1, playsinline: 1
          },
          events: {
            onReady: (e: any) => { e.target.playVideo(); e.target.mute(); },
            onStateChange: (e: any) => { if (e.data === 1) fadeTimer = setTimeout(() => setVideoLoaded(true), 1200); }
          }
        });
      };

      if (!(window as any).YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      } else {
        initPlayer();
      }
    }
    return () => { if (fadeTimer) clearTimeout(fadeTimer); };
  }, []);

  const handleToggleAmbient = () => {
    if (soundEnabled) sounds.playClick();
    if (youtubePlayerRef.current && typeof youtubePlayerRef.current.isMuted === "function") {
      if (youtubePlayerRef.current.isMuted()) {
        youtubePlayerRef.current.unMute();
        youtubePlayerRef.current.setVolume(40);
        setAmbientPlaying(true);
      } else {
        youtubePlayerRef.current.mute();
        setAmbientPlaying(false);
      }
    } else {
      setAmbientPlaying(!ambientPlaying);
    }
  };

  const handlePrevLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : looks.length - 1));
      if (soundEnabled) sounds.playPop();
    }
  };

  const handleNextLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev < looks.length - 1 ? prev + 1 : 0));
      if (soundEnabled) sounds.playPop();
    }
  };

  const activeDataset = activeTab === "looks" ? looks : backstage;
  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-900 flex flex-col justify-between overflow-x-hidden text-left">
      <Header />

      <section className="relative w-full aspect-[21/9] min-h-[380px] overflow-hidden bg-black flex items-center justify-center border-b border-zinc-800">
        <div className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${videoLoaded ? "opacity-60" : "opacity-0"}`}>
          <div id="youtube-bg-player-runway" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115vw] h-[65vw] min-h-100% min-w-[177vh] scale-125 pointer-events-none" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
        
        <div className="absolute inset-x-6 bottom-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 text-white">
          <div className="space-y-2">
            <div style={{ borderColor: "rgba(201,168,76,0.4)", backgroundColor: "rgba(201,168,76,0.1)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-0.5 border rounded-full text-[9px] font-mono tracking-widest uppercase font-bold">
              <Sparkles className="h-3 w-3" />
              <span>NOREX LIVE RUNWAY BROADCAST</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">Spring Couture Runway</h1>
          </div>

          <button type="button" onClick={handleToggleAmbient} className={`px-5 py-3 border rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer select-none ${ambientPlaying ? "bg-[#C9A84C] border-[#C9A84C] text-white font-black" : "bg-white/5 border-white/20 text-white"}`}>
            {ambientPlaying ? <><Volume2 className="h-3.5 w-3.5" /> <span>Mute Audio</span></> : <><VolumeX className="h-3.5 w-3.5 text-zinc-400" /> <span>Stream Audio</span></>}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-200 pb-6 mb-8 gap-4">
          <div className="flex p-1 bg-zinc-100 rounded-full border border-zinc-200">
            <button type="button" onClick={() => { if(soundEnabled) sounds.playSweep(); setActiveTab("looks"); }} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ${activeTab === "looks" ? "bg-zinc-900 text-white shadow" : "text-zinc-500"}`}>
              <Layers size={14} /> The Looks
            </button>
            <button type="button" onClick={() => { if(soundEnabled) sounds.playSweep(); setActiveTab("backstage"); }} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ${activeTab === "backstage" ? "bg-zinc-900 text-white shadow" : "text-zinc-500"}`}>
              <Camera size={14} /> Backstage
            </button>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">{activeDataset.length} Active Records Cataloged</span>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center w-full"><Loader2 className="h-7 w-7 animate-spin text-[#C9A84C]" /></div>
        ) : activeDataset.length === 0 ? (
          <p className="text-zinc-400 font-mono text-xs uppercase text-center py-16">No runway logs assigned to this layout tab node currently.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDataset.map((item, idx) => (
              <div 
                key={item._id}
                onClick={() => { if(activeTab === "looks") { if(soundEnabled) sounds.playChord(); setLightboxIndex(idx); } }}
                className={`group bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm hover:border-[#C9A84C] hover:-translate-y-1 transition-all ${activeTab === "looks" ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
                  <img src={item.image} alt="" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-3 left-3 text-[8px] font-mono text-white/50 tracking-wider">NOREX // S26</div>
                  <div className="absolute top-3 right-3 text-[8px] font-mono text-white/50 tracking-wider font-bold">IDX-{item.lookNumber}</div>
                </div>

                <div className="p-4 border-t border-zinc-100 flex justify-between items-center bg-white">
                  <div className="min-w-0 flex-1 text-left">
                    <span style={{ color: goldColor }} className="text-[9px] font-mono font-bold uppercase block">LOOK {item.lookNumber}</span>
                    <h3 className="text-xs font-bold text-zinc-900 truncate mt-0.5 uppercase tracking-wide">{item.garmentName || "Backstage Prep Capture"}</h3>
                    <p className="text-[10px] text-zinc-400 font-light font-sans truncate mt-0.5">{item.modelName || item.commentary}</p>
                  </div>
                  {activeTab === "looks" && <Maximize2 size={13} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0 ml-2" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && looks[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex flex-col justify-between p-6 overflow-y-auto text-white">
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center border-b border-white/10 pb-4">
            <div className="text-left font-mono">
              <span className="text-xs font-bold uppercase text-[#C9A84C] tracking-widest">RUNWAY SHOWROOM LIGHTBOX</span>
              <div className="text-[10px] text-zinc-400 mt-0.5">LOOK {looks[lightboxIndex].lookNumber} OF {looks.length}</div>
            </div>
            <button type="button" onClick={() => setLightboxIndex(null)} className="p-2 border border-white/10 rounded-full hover:border-white cursor-pointer"><X size={20} /></button>
          </div>

          <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-6">
            <button type="button" onClick={handlePrevLook} className="p-3 border border-white/10 rounded-full text-white cursor-pointer"><ChevronLeft size={20} /></button>
            <div className="aspect-[3/4] w-full max-w-[340px] rounded-sm overflow-hidden border border-white/10 bg-zinc-950">
              <img src={looks[lightboxIndex].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-md text-left space-y-4">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#C9A84C] block">LOOK {looks[lightboxIndex].lookNumber} SPEC</span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl font-bold uppercase tracking-tight">{looks[lightboxIndex].garmentName}</h2>
              <p className="text-xs font-mono tracking-wide text-zinc-400">MODEL PROFILE // <span className="text-white font-bold">{looks[lightboxIndex].modelName}</span></p>
              <div className="border-t border-white/10 pt-4"><p className="text-xs leading-relaxed text-zinc-300 font-light font-serif italic">"{looks[lightboxIndex].commentary}"</p></div>
            </div>
            <button type="button" onClick={handleNextLook} className="p-3 border border-white/10 rounded-full text-white cursor-pointer"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}
      <StyleOracle /><Footer />
    </main>
  );
}