"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, Loader2, Plus, X, CheckCircle, Camera, Film, Layers, Palette } from "lucide-react";

interface ColorSwatch {
  name: string;
  hex: string;
  rgb: string;
  desc: string;
}

export default function RunwayUploadWorkspace() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"collection" | "look">("collection");
  const [existingCollections, setExistingCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // SECTION A: COLLECTION STATE
  const [title, setTitle] = useState("");
  const [waSeason, setWaSeason] = useState<"Pluvial Drop" | "Harmattan Regal" | "August Break" | "Sultry Heat">("Pluvial Drop");
  const [campaignPlot, setCampaignPlot] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [btsFile, setBtsFile] = useState<File | null>(null);
  const [btsPreview, setBtsPreview] = useState("");
  
  // Editorial Credits
  const [photographer, setPhotographer] = useState("Tyler Mitchell");
  const [stylist, setStylist] = useState("Gabriella Karefa-Johnson");
  const [castCredits, setCastCredits] = useState("Anok Yai, Mona Tougaard");

  // Palette Matrix Builder
  const [swatches, setSwatches] = useState<ColorSwatch[]>([
    { name: "Warm Ivory", hex: "#FAF9F6", rgb: "RGB 250 249 246", desc: "Reflective base linings" }
  ]);

  // Filmhouse Integration Flags
  const [hasFilm, setHasFilm] = useState(false);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmDuration, setFilmDuration] = useState("4m 30s");
  const [filmDescription, setFilmDescription] = useState("");
  const [youtubeId, setYoutubeId] = useState("");

  // SECTION B: LOOKBOOK ITEM STATE
  const [targetCollectionId, setTargetCollectionId] = useState("");
  const [lookType, setLookType] = useState<"look" | "backstage">("look");
  const [lookNumber, setLookNumber] = useState("01");
  const [garmentName, setGarmentName] = useState("");
  const [modelName, setModelName] = useState("");
  const [commentary, setCommentary] = useState("");
  const [lookFile, setLookFile] = useState<File | null>(null);
  const [lookPreview, setLookPreview] = useState("");

  useEffect(() => {
    async function loadDropdowns() {
      const res = await fetch("/api/admin/runway/collections");
      const data = await res.json();
      if (data.success) {
        setExistingCollections(data.data);
        if (data.data.length > 0) setTargetCollectionId(data.data[0]._id);
      }
    }
    loadDropdowns();
  }, [activeTab]);

  // Fixed: Declared file change listener loop to track cover previews safely
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverFile(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddSwatch = () => setSwatches([...swatches, { name: "", hex: "#ffffff", rgb: "RGB 255 255 255", desc: "" }]);
  
  const handleUpdateSwatch = (idx: number, key: keyof ColorSwatch, value: string) => {
    const updated = [...swatches];
    updated[idx][key] = value;
    setSwatches(updated);
  };

  const executeImageUploadPipeline = async (targetFile: File) => {
    const formData = new FormData();
    formData.append("file", targetFile);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!json.success) throw new Error("Cloudinary file upload transaction failed.");
    return json.url;
  };

  const handleCommitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) return alert("A seasonal collection launch requires a primary cover graphic anchor.");
    setLoading(true);

    try {
      const [coverUrl, btsUrl] = await Promise.all([
        executeImageUploadPipeline(coverFile),
        btsFile ? executeImageUploadPipeline(btsFile) : Promise.resolve("")
      ]);

      const payload = {
        title, waSeason, campaignPlot, photographer, stylist, castCredits, hasFilm,
        coverImage: coverUrl, btsImage: btsUrl, palette: swatches,
        ...(hasFilm ? { filmTitle, filmDirector, filmDuration, filmDescription, youtubeId } : {})
      };

      const res = await fetch("/api/admin/runway/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { resetForm(); router.push("/admin/runway"); }, 1200);
      }
    } catch (err: any) {
      alert(`CMS Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitLook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookFile) return alert("Please specify an image file asset for this scene node.");
    setLoading(true);

    try {
      const uploadedLookUrl = await executeImageUploadPipeline(lookFile);
      const payload = {
        collectionId: targetCollectionId, type: lookType, lookNumber, garmentName, modelName, commentary,
        image: uploadedLookUrl
      };

      const res = await fetch("/api/admin/runway/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { resetForm(); router.push("/admin/runway"); }, 1200);
      }
    } catch (err: any) {
      alert(`CMS Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false); setLoading(false);
    setTitle(""); setCampaignPlot(""); setCoverFile(null); setCoverPreview(""); setBtsFile(null); setBtsPreview("");
    setLookFile(null); setLookPreview(""); setCommentary(""); setGarmentName(""); setModelName("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-left text-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">RUNWAY EDITORIAL CMS</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Runway Management Factory</h1>
        </div>

        {/* Dynamic Context Workspace Switcher Toggle */}
        <div className="inline-flex bg-zinc-100 p-1 rounded-sm border border-zinc-200">
          <button type="button" onClick={() => { resetForm(); setActiveTab("collection"); }} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "collection" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500"}`}>
            <Layers className="h-3.5 w-3.5" />
            <span>Launch Collection Drop</span>
          </button>
          <button type="button" onClick={() => { resetForm(); setActiveTab("look"); }} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "look" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500"}`}>
            <Camera className="h-3.5 w-3.5" />
            <span>Append Look / Scene</span>
          </button>
        </div>
      </div>

      {success ? (
        <div className="p-12 text-center bg-emerald-50 border border-emerald-100 rounded-sm flex flex-col items-center justify-center gap-2">
          <CheckCircle className="h-10 w-10 text-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Runway Ledger References Secured</h3>
        </div>
      ) : activeTab === "collection" ? (
        /* ================= FORM A: CAMPAIGN DROP FACTORY ================= */
        <form onSubmit={handleCommitCollection} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Collection Campaign Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., Pluvial Ease & Geometric Prints" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">West African Season Index</label>
                <select value={waSeason} onChange={(e) => setWaSeason(e.target.value as any)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none">
                  <option value="Pluvial Drop">Pluvial Drop (Rainy / Humid)</option>
                  <option value="Harmattan Regal">Harmattan Regal (Dry / Festive)</option>
                  <option value="August Break">August Break (Little Dry)</option>
                  <option value="Sultry Heat">Sultry Heat (Little Rainy)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Visual Lead Photographer</label>
                <input required type="text" value={photographer} onChange={(e) => setPhotographer(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Lead Fashion Stylist</label>
                <input required type="text" value={stylist} onChange={(e) => setStylist(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Featured Models Cast</label>
                <input required type="text" value={castCredits} onChange={(e) => setCastCredits(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Campaign Plot Narrative Story</label>
              <textarea required rows={3} value={campaignPlot} onChange={(e) => setCampaignPlot(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none font-light text-justify" placeholder="Detail the contextual layout alignment objectives..." />
            </div>

            {/* DYNAMIC PALETTE DISCLOSURE INTERFACE GRID */}
            <div className="pt-4 border-t border-zinc-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500 flex items-center gap-1"><Palette className="h-3.5 w-3.5" /> Climatic Chromatics Palette</label>
                <button type="button" onClick={handleAddSwatch} className="text-[10px] uppercase font-mono font-bold text-[#C9A84C]">+ Append Swatch</button>
              </div>
              {swatches.map((swatch, sIdx) => (
                <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 border p-2.5 bg-zinc-50/50 rounded-sm relative">
                  <input type="text" required placeholder="Color Name" value={swatch.name} onChange={(e) => handleUpdateSwatch(sIdx, "name", e.target.value)} className="border p-2 text-xs bg-white focus:outline-none" />
                  <input type="text" required placeholder="Hex Code" value={swatch.hex} onChange={(e) => handleUpdateSwatch(sIdx, "hex", e.target.value)} className="border p-2 text-xs bg-white font-mono focus:outline-none" />
                  <input type="text" required placeholder="RGB String" value={swatch.rgb} onChange={(e) => handleUpdateSwatch(sIdx, "rgb", e.target.value)} className="border p-2 text-xs bg-white font-mono focus:outline-none" />
                  <div className="flex items-center gap-1">
                    <input type="text" required placeholder="Description Use" value={swatch.desc} onChange={(e) => handleUpdateSwatch(sIdx, "desc", e.target.value)} className="border p-2 text-xs bg-white flex-1 focus:outline-none" />
                    <button type="button" onClick={() => setSwatches(swatches.filter((_, i) => i !== sIdx))} className="text-zinc-400 hover:text-red-500"><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* CONDITIONAL INTEGRATION FOR FASHION FILMHOUSE SHORTS */}
            <div className="pt-4 border-t border-zinc-200 space-y-3">
              <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider cursor-pointer text-zinc-700">
                <input type="checkbox" checked={hasFilm} onChange={(e) => setHasFilm(e.target.checked)} className="h-4 w-4 accent-[#C9A84C]" />
                <span className="flex items-center gap-1"><Film className="h-4 w-4 text-[#C9A84C]" /> Include Accompanying Film Release</span>
              </label>

              {hasFilm && (
                <div className="p-4 border border-zinc-200 bg-zinc-50/30 space-y-3 rounded-sm animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Filmhouse Short Title</label>
                      <input type="text" required={hasFilm} value={filmTitle} onChange={(e) => setFilmTitle(e.target.value)} className="w-full border p-2 text-xs bg-white focus:outline-none" placeholder="e.g., Solstice Motion Curve" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Film Director</label>
                      <input type="text" required={hasFilm} value={filmDirector} onChange={(e) => setFilmDirector(e.target.value)} className="w-full border p-2 text-xs bg-white focus:outline-none" placeholder="Tyler Mitchell" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Video Playback Run Duration</label>
                      <input type="text" required={hasFilm} value={filmDuration} onChange={(e) => setFilmDuration(e.target.value)} className="w-full border p-2 text-xs bg-white focus:outline-none" placeholder="4m 32s" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">YouTube ID Video Token</label>
                      <input type="text" required={hasFilm} value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} className="w-full border p-2 text-xs bg-white font-mono focus:outline-none" placeholder="oPtfQAFIk-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Film Narrative Description</label>
                    <textarea rows={2} required={hasFilm} value={filmDescription} onChange={(e) => setFilmDescription(e.target.value)} className="w-full border p-2 text-xs bg-white focus:outline-none font-light" placeholder="Describe the focus parameters behind the motion captures..." />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 block">Primary Look Cover Frame</label>
              <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/50 p-6 text-center rounded-sm relative aspect-[4/3] flex flex-col items-center justify-center">
                {coverPreview ? <img src={coverPreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover rounded-sm" /> : <p className="text-xs text-zinc-400 font-bold">Select Cover Canvas</p>}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 block">Backstage Studio Teaser Panel</label>
              <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/50 p-6 text-center rounded-sm relative aspect-[16/10] flex flex-col items-center justify-center">
                {btsPreview ? <img src={btsPreview} alt="Backstage Preview" className="absolute inset-0 w-full h-full object-cover rounded-sm" /> : <p className="text-xs text-zinc-400 font-bold">Select Backstage Capture</p>}
                <input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]){ setBtsFile(e.target.files[0]); setBtsPreview(URL.createObjectURL(e.target.files[0])); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? "#e4e4e7" : "#1a1a1a" }} className="w-full py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center justify-center gap-2 rounded-sm shadow-md">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Sparkles className="h-4 w-4" />}
              <span>Deploy Seasonal Launch</span>
            </button>
          </div>
        </form>
      ) : (
        /* ================= FORM B: LOOKBOOK LOOKS APPENDER ================= */
        <form onSubmit={handleCommitLook} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            {existingCollections.length === 0 ? (
              <p className="text-amber-600 font-mono text-xs uppercase bg-amber-50 p-4 border border-amber-200">Workspace Error: Please deploy an parent drop drop capsule before adding model looks.</p>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Target Season Drop Allocation</label>
                  <select value={targetCollectionId} onChange={(e) => setTargetCollectionId(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none">
                    {existingCollections.map((c) => <option key={c._id} value={c._id}>{c.title} [{c.waSeason}]</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Capture Zone Category</label>
                    <select value={lookType} onChange={(e) => setLookType(e.target.value as any)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none">
                      <option value="look">Front Row Lookbook Silhouette</option>
                      <option value="backstage">Backstage Preparation Scene</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Look Index Code Identifier</label>
                    <input required type="text" value={lookNumber} onChange={(e) => setLookNumber(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none font-mono font-bold" placeholder="e.g., 01 or 07" />
                  </div>
                </div>

                {lookType === "look" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Garment Nomenclature Name</label>
                      <input required={lookType === "look"} type="text" value={garmentName} onChange={(e) => setGarmentName(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none" placeholder="Ankara Fusion Co-ord Set" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Walking Model Credit Name</label>
                      <input required={lookType === "look"} type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none" placeholder="Anok Yai" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">
                    {lookType === "look" ? "Couture Architecture Narrative Notes" : "Backstage Captions Log Summary"}
                  </label>
                  <textarea required rows={4} value={commentary} onChange={(e) => setCommentary(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none font-light" placeholder={lookType === "look" ? "Describe the drape mechanics structural balances..." : "Detail the grooming steps or apparel handling configurations..."} />
                </div>
              </>
            )}
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 block">Capture Frame Shot Canvas</label>
              <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/50 p-6 text-center rounded-sm relative aspect-[3/4] flex flex-col items-center justify-center">
                {lookPreview ? <img src={lookPreview} alt="Look Preview" className="absolute inset-0 w-full h-full object-cover rounded-sm" /> : <p className="text-xs text-zinc-400 font-bold">Select Media File</p>}
                <input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]){ setLookFile(e.target.files[0]); setLookPreview(URL.createObjectURL(e.target.files[0])); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </div>
            </div>

            <button type="submit" disabled={loading || existingCollections.length === 0} style={{ backgroundColor: loading ? "#e4e4e7" : "#1a1a1a" }} className="w-full py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center justify-center gap-2 rounded-sm shadow-md">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Camera className="h-4 w-4" />}
              <span>Commit Scene View Node</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}