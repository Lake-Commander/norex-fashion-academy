"use client";

import { useState } from "react";
import { Sparkles, Upload, Loader2, Plus, X, CheckCircle, Trash2, BookOpen, GraduationCap } from "lucide-react";

interface CourseFormBlock {
  blockId: string;
  title: string;
  price: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  curriculumInput: string;
  curriculumList: string[];
  file: File | null;
  previewUrl: string;
  featured: boolean;
  isProcessing: boolean;
  isComplete: boolean;
}

export default function CourseFactoryPage() {
  const createBlankBlock = (): CourseFormBlock => ({
    blockId: Math.random().toString(36).substring(2, 9),
    title: "",
    price: "",
    duration: "3 Months",
    level: "Beginner",
    description: "",
    curriculumInput: "",
    curriculumList: [],
    file: null,
    previewUrl: "",
    featured: false,
    isProcessing: false,
    isComplete: false,
  });

  const [blocks, setBlocks] = useState<CourseFormBlock[]>([createBlankBlock()]);

  const updateBlock = (blockId: string, updates: Partial<CourseFormBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.blockId === blockId ? { ...b, ...updates } : b)));
  };

  const handleAppendCurriculumRow = (blockId: string) => {
    const block = blocks.find((b) => b.blockId === blockId);
    if (!block || !block.curriculumInput.trim()) return;
    updateBlock(blockId, {
      curriculumList: [...block.curriculumList, block.curriculumInput.trim()],
      curriculumInput: ""
    });
  };

  const handleRemoveCurriculumRow = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.blockId === blockId);
    if (!block) return;
    updateBlock(blockId, {
      curriculumList: block.curriculumList.filter((_, i) => i !== index)
    });
  };

  const handleFileStream = (blockId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    updateBlock(blockId, {
      file: files[0],
      previewUrl: URL.createObjectURL(files[0])
    });
  };

  const handleCommitCourse = async (e: React.FormEvent, block: CourseFormBlock) => {
    e.preventDefault();
    if (!block.file) return alert("Please map an instructional teaser thumbnail cover asset.");
    if (block.curriculumList.length === 0) return alert("A professional syllabus timeline framework requires at least one curriculum topic.");

    updateBlock(block.blockId, { isProcessing: true });
    try {
      // Phase 1: Upload Teaser Asset to Cloudinary
      const mediaData = new FormData();
      mediaData.append("file", block.file);
      const mediaRes = await fetch("/api/admin/upload", { method: "POST", body: mediaData });
      const mediaJson = await mediaRes.json();
      if (!mediaJson.success) throw new Error("Cloudinary media buffer stream rejected.");

      // Phase 2: Transmit Structural Payload Configuration directly to MongoDB
      const payload = {
        title: block.title,
        price: Number(block.price),
        duration: block.duration,
        level: block.level,
        description: block.description,
        image: mediaJson.url,
        curriculum: block.curriculumList,
        featured: block.featured
      };

      const dbRes = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const dbJson = await dbRes.json();

      if (dbJson.success) {
        updateBlock(block.blockId, { isComplete: true });
      }
    } catch (err: any) {
      alert(`Course Factory Blocked: ${err.message}`);
    } finally {
      updateBlock(block.blockId, { isProcessing: false });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-left text-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">ACADEMY SYLLABUS PANEL</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Continuous Curriculum Factory</h1>
        </div>
        <button type="button" onClick={() => setBlocks([...blocks, createBlankBlock()])} className="px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all hover:bg-[#C9A84C] cursor-pointer">
          + Add Course Section Form
        </button>
      </div>

      <div className="space-y-12">
        {blocks.map((block, idx) => (
          <div key={block.blockId} className="relative bg-white border border-zinc-200 shadow-sm rounded-sm p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3 bg-zinc-50/50 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-4">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-[#C9A84C]" /> PROGRAM SLOT MODULE [0{idx + 1}]
              </span>
              <button type="button" onClick={() => setBlocks(blocks.filter((b) => b.blockId !== block.blockId))} className="text-zinc-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>

            {block.isComplete ? (
              <div className="p-12 text-center bg-emerald-50/30 border border-emerald-100 rounded-sm space-y-2 flex flex-col items-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Syllabus Registry Secured</h4>
                <p className="text-xs text-zinc-400">Course entry written successfully to your MongoDB clusters.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleCommitCourse(e, block)} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Course Title</label>
                    <input required type="text" value={block.title} onChange={(e) => updateBlock(block.blockId, { title: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., Luxury Bridal Couture Construction" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Tuition Fee (₦)</label>
                      <input required type="number" value={block.price} onChange={(e) => updateBlock(block.blockId, { price: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="280000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Term Duration</label>
                      <input required type="text" value={block.duration} onChange={(e) => updateBlock(block.blockId, { duration: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="3 Months" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Experience Tier Level</label>
                      <select value={block.level} onChange={(e) => updateBlock(block.blockId, { level: e.target.value as any })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none focus:border-[#C9A84C]">
                        <option value="Beginner">Beginner Tier</option>
                        <option value="Intermediate">Intermediate Tier</option>
                        <option value="Advanced">Advanced Couture Tier</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Homepage Exposure</label>
                      <label className="flex items-center gap-2 border border-zinc-300 p-3 rounded-sm text-sm bg-white cursor-pointer h-[46px]">
                        <input type="checkbox" checked={block.featured} onChange={(e) => updateBlock(block.blockId, { featured: e.target.checked })} className="accent-[#C9A84C] h-4 w-4" />
                        <span className="text-xs font-semibold text-zinc-600 uppercase">Pin to Academy Spotlight</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400">Course Syllabus Description Summary</label>
                    <textarea required rows={3} value={block.description} onChange={(e) => updateBlock(block.blockId, { description: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-light" placeholder="Summarize the core structural learning outputs..." />
                  </div>

                  {/* CURRICULUM ARRAY TAG BUILDER FLOW INTERFACE */}
                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500 block">Syllabus Course Outline Milestones</label>
                    <div className="flex gap-2">
                      <input type="text" value={block.curriculumInput} onChange={(e) => updateBlock(block.blockId, { curriculumInput: e.target.value })} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAppendCurriculumRow(block.blockId); } }} placeholder="e.g., High-Density Corsetry Underwiring Foundations" className="flex-1 border border-zinc-300 p-2.5 rounded-sm text-xs focus:outline-none focus:border-[#C9A84C]" />
                      <button type="button" onClick={() => handleAppendCurriculumRow(block.blockId)} className="px-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase rounded-sm hover:bg-[#C9A84C]">Append</button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {block.curriculumList.map((curric, cIdx) => (
                        <span key={cIdx} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                          <span>{curric}</span>
                          <button type="button" onClick={() => handleRemoveCurriculumRow(block.blockId, cIdx)} className="text-zinc-400 hover:text-red-500 ml-0.5 font-bold"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 block">Teaser Cover Canvas</label>
                    <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/50 p-6 text-center rounded-sm relative transition-colors aspect-[4/3] flex flex-col items-center justify-center">
                      {block.previewUrl ? (
                        <img src={block.previewUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover rounded-sm" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-zinc-300 mb-1" />
                          <p className="text-xs font-bold text-zinc-500">Upload Banner File</p>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileStream(block.blockId, e.target.files)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" />
                    </div>
                  </div>

                  <button type="submit" disabled={block.isProcessing} style={{ backgroundColor: block.isProcessing ? "#e4e4e7" : "#1a1a1a" }} className="w-full py-4 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-[#C9A84C]">
                    {block.isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" /> : <BookOpen className="h-3.5 w-3.5" />}
                    <span>Commit Course Framework</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}