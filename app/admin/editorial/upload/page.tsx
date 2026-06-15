"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, Loader2, Plus, X, CheckCircle, FileText, BarChart, MessageSquare, BookOpen } from "lucide-react";

export default function EditorialUploadCMS() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Core Global States
  const [contentType, setContentType] = useState<"article" | "insight" | "interview" | "story">("article");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Couture & Atelier");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Ephraim Ohise");
  const [readTime, setReadTime] = useState("5 min read");
  const [featured, setFeatured] = useState(false);
  
  // Image Hosting Asset States
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Specialized Variations State Triggers
  const [paragraphs, setParagraphs] = useState<string[]>([""]);
  const [pullQuote, setPullQuote] = useState("");
  const [photography, setPhotography] = useState("Daniel Obasi");
  const [styling, setStyling] = useState("Smartatta Emmanuel");

  const [metric, setMetric] = useState("+14.2%");
  const [chartDataString, setChartDataString] = useState("60, 80, 45, 90, 75, 95");

  const [cast, setCast] = useState("ORLIEN Design Office");
  const [qaPairs, setQaPairs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddParagraph = () => setParagraphs([...paragraphs, ""]);
  const handleUpdateParagraph = (idx: number, txt: string) => {
    const updated = [...paragraphs];
    updated[idx] = txt;
    setParagraphs(updated);
  };

  const handleAddQA = () => setQaPairs([...qaPairs, { q: "", a: "" }]);
  const handleUpdateQA = (idx: number, key: "q" | "a", txt: string) => {
    const updated = [...qaPairs];
    updated[idx][key] = txt;
    setQaPairs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = "";
      if (file) {
        const mediaForm = new FormData();
        mediaForm.append("file", file);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: mediaForm });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) uploadedImageUrl = uploadJson.url;
      }

      // Format dynamic chart numbers
      const processedChartData = chartDataString.split(",").map(num => Number(num.trim()));

      const payload = {
        contentType, title, category, summary, author, readTime, featured,
        image: uploadedImageUrl,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
        content: paragraphs.filter(p => p.trim() !== ""),
        pullQuote, photography, styling,
        metric, chartData: processedChartData,
        cast, qaPairs: qaPairs.filter(p => p.q.trim() !== "")
      };

      const res = await fetch("/api/admin/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/editorial");
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-left text-zinc-800">
      <div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">GAZETTE NEWSROOM CMS</span>
        <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Publish Editorial Entry</h1>
      </div>

      {success ? (
        <div className="p-12 text-center bg-emerald-50 border border-emerald-100 rounded-sm flex flex-col items-center justify-center gap-2">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Publication Written to Ledger</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Form Stream Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Content Format Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as any)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none focus:border-[#C9A84C]">
                <option value="article">Gazette Article Segment</option>
                <option value="insight">Fiber Metric Analytics Report</option>
                <option value="interview" >Dialogue Interview Script</option>
                <option value="story">Atelier Narrative Story</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Publication Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., THE CRIMSON ARCHITECTURE" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Category Tag</label>
                <input required type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., Couture & Atelier" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Estimated Reading Speed Time</label>
                <input required type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="6 min read" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Abstract Summary Description</label>
              <textarea required rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-light" placeholder="Provide a brief context abstract overview capsule..." />
            </div>

            {/* CONDITIONAL EXTRA FORM MODULE BLOCK FOR ARTICLES & STORIES */}
            {(contentType === "article" || contentType === "story") && (
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-1">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border border-zinc-300 p-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-1">Photography</label>
                    <input type="text" value={photography} onChange={(e) => setPhotography(e.target.value)} className="w-full border border-zinc-300 p-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-1">Styling</label>
                    <input type="text" value={styling} onChange={(e) => setStyling(e.target.value)} className="w-full border border-zinc-300 p-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Pull Quote</label>
                  <input type="text" value={pullQuote} onChange={(e) => setPullQuote(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-serif italic" placeholder="Enter accent pull quote string narrative masterwork..." />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Paragraph Content Segments</label>
                    <button type="button" onClick={handleAddParagraph} className="text-[10px] uppercase font-mono font-bold text-[#C9A84C]">+ Append Paragraph</button>
                  </div>
                  {paragraphs.map((p, idx) => (
                    <textarea key={idx} rows={3} value={p} onChange={(e) => handleUpdateParagraph(idx, e.target.value)} className="w-full border border-zinc-300 p-3 text-xs focus:outline-none focus:border-[#C9A84C] font-light" placeholder={`Paragraph segment ##0${idx + 1}`} />
                  ))}
                </div>
              </div>
            )}

            {/* CONDITIONAL EXTRA FORM MODULE BLOCK FOR METRIC INSIGHTS */}
            {contentType === "insight" && (
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Accent Metric Value</label>
                    <input type="text" value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., +14.2% or 97.2%" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Bar Chart Matrix Data (6 Values CSV)</label>
                    <input type="text" value={chartDataString} onChange={(e) => setChartDataString(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-mono" placeholder="60, 80, 45, 90, 75, 95" />
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL EXTRA FORM MODULE BLOCK FOR INTERVIEWS */}
            {contentType === "interview" && (
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Speaker / Cast Credits</label>
                  <input type="text" value={cast} onChange={(e) => setCast(e.target.value)} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., Pierre Laurent or ORLIEN Design Office" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Transcripts Dialogue Q&A Pairs</label>
                    <button type="button" onClick={handleAddQA} className="text-[10px] uppercase font-mono font-bold text-[#C9A84C]">+ Append Q&A Node</button>
                  </div>
                  {qaPairs.map((pair, idx) => (
                    <div key={idx} className="p-3 border border-zinc-200 bg-zinc-50 space-y-2 rounded-sm">
                      <input type="text" value={pair.q} onChange={(e) => handleUpdateQA(idx, "q", e.target.value)} placeholder="Question Text..." className="w-full border border-zinc-300 p-2 text-xs bg-white focus:outline-none" />
                      <textarea rows={2} value={pair.a} onChange={(e) => handleUpdateQA(idx, "a", e.target.value)} placeholder="Answer Transcript..." className="w-full border border-zinc-300 p-2 text-xs bg-white focus:outline-none font-light" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Stream Sidebar Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 border border-zinc-200 bg-zinc-50/50 rounded-sm">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 border-b pb-1 mb-2">Display Routing</h3>
              <label className="flex items-center gap-3 text-xs font-bold uppercase cursor-pointer text-zinc-600">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#C9A84C]" />
                <span>Feature in Homepage Slider</span>
              </label>
            </div>

            {contentType !== "insight" && (
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 block">Cover Graphic Node</label>
                <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/50 p-6 text-center rounded-sm relative aspect-[4/3] flex flex-col items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-zinc-300 mb-1" />
                      <p className="text-xs text-zinc-500 font-bold">Upload Editorial Asset</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? "#e4e4e7" : "#1a1a1a" }} className="w-full py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C9A84C] flex items-center justify-center gap-2 rounded-sm shadow-md">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Sparkles className="h-4 w-4" />}
              <span>Commit Publication Log</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}