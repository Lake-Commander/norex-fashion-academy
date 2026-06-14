"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, Loader2, Plus, X, CheckCircle, Trash2, Layers, Info } from "lucide-react";

interface InfoPair {
  label: string;
  value: string;
}

interface ProductFormState {
  formId: string;
  name: string;
  price: string;
  category: string;
  gender: string;
  description: string;
  files: File[];
  previewUrls: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isSignature: boolean;
  collectionGroup: string;
  // Conditional Signature Specific Mappings
  story: string;
  material: string;
  inspiration: string;
  swatch: string;
  // Dynamic Generic Metadata
  additionalInfo: InfoPair[];
  // Block Tracking Status Indicators
  isUploading: boolean;
  isSuccess: boolean;
}

export default function MultiProductUploadPage() {
  const router = useRouter();
  
  // Initialize a template structural node for new form instances
  const createEmptyFormNode = (): ProductFormState => ({
    formId: Math.random().toString(36).substring(2, 9),
    name: "",
    price: "",
    category: "Evening Wear",
    gender: "Female",
    description: "",
    files: [],
    previewUrls: [],
    isFeatured: false,
    isNewArrival: false,
    isSignature: false,
    collectionGroup: "none",
    story: "",
    material: "",
    inspiration: "",
    swatch: "",
    additionalInfo: [],
    isUploading: false,
    isSuccess: false,
  });

  // State array containing all active product entry forms on screen
  const [productForms, setProductForms] = useState<ProductFormState[]>([createEmptyFormNode()]);

  // Append a fresh decoupled creation card to the layout array
  const handleAddNewFormBlock = () => {
    setProductForms((prev) => [...prev, createEmptyFormNode()]);
  };

  // Remove a specific form block instance completely from the screen view
  const handleRemoveFormBlock = (formId: string) => {
    if (productForms.length === 1) {
      alert("Your workspace requires at least one active product creation block.");
      return;
    }
    setProductForms((prev) => prev.filter((form) => form.formId !== formId));
  };

  // Scoped updater function to mutate field states inside an explicit block node
  const updateFormBlockFields = (formId: string, updates: Partial<ProductFormState>) => {
    setProductForms((prev) =>
      prev.map((form) => (form.formId === formId ? { ...form, ...updates } : form))
    );
  };

  // Local media asset previews configuration scoped to card instances
  const handleFileSelection = (formId: string, targetFiles: FileList | null) => {
    if (!targetFiles) return;
    const selected = Array.from(targetFiles);
    const formInstance = productForms.find((f) => f.formId === formId);
    if (!formInstance) return;

    const updatedFiles = [...formInstance.files, ...selected];
    const updatedUrls = [...formInstance.previewUrls, ...selected.map((file) => URL.createObjectURL(file))];

    updateFormBlockFields(formId, { files: updatedFiles, previewUrls: updatedUrls });
  };

  const handleRemovePreviewAsset = (formId: string, assetIdx: number) => {
    const formInstance = productForms.find((f) => f.formId === formId);
    if (!formInstance) return;

    const filteredFiles = formInstance.files.filter((_, i) => i !== assetIdx);
    const filteredUrls = formInstance.previewUrls.filter((_, i) => i !== assetIdx);

    updateFormBlockFields(formId, { files: filteredFiles, previewUrls: filteredUrls });
  };

  // Inline array dynamic metadata append/drop actions
  const handleAddInfoPair = (formId: string) => {
    const formInstance = productForms.find((f) => f.formId === formId);
    if (!formInstance) return;
    updateFormBlockFields(formId, {
      additionalInfo: [...formInstance.additionalInfo, { label: "", value: "" }],
    });
  };

  const handleUpdateInfoPair = (formId: string, pairIdx: number, key: "label" | "value", textStr: string) => {
    const formInstance = productForms.find((f) => f.formId === formId);
    if (!formInstance) return;
    const items = [...formInstance.additionalInfo];
    items[pairIdx][key] = textStr;
    updateFormBlockFields(formId, { additionalInfo: items });
  };

  const handleRemoveInfoPair = (formId: string, pairIdx: number) => {
    const formInstance = productForms.find((f) => f.formId === formId);
    if (!formInstance) return;
    updateFormBlockFields(formId, {
      additionalInfo: formInstance.additionalInfo.filter((_, i) => i !== pairIdx),
    });
  };

  // Isolated single-card submission loop workflow
  const handleCommitSingleProduct = async (e: React.FormEvent, currentForm: ProductFormState) => {
    e.preventDefault();
    if (currentForm.files.length === 0) {
      alert(`Upload Blocked: "${currentForm.name || "Unnamed Piece"}" requires an image asset.`);
      return;
    }

    updateFormBlockFields(currentForm.formId, { isUploading: true });

    try {
      const uploadedCloudUrls = [];

      // Phase 1: Stream target files up to Cloudinary cloud instance sequentially
      for (const file of currentForm.files) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Cloudinary media stream failed to compile.");
        const uploadData = await uploadRes.json();

        if (uploadData.success) {
          uploadedCloudUrls.push(uploadData.url);
        }
      }

      // Phase 2: Inject signature variables natively if the flag is enabled
      const productPayload = {
        name: currentForm.name,
        price: Number(currentForm.price),
        category: currentForm.category,
        gender: currentForm.gender,
        description: currentForm.description,
        images: uploadedCloudUrls,
        isFeatured: currentForm.isFeatured,
        isNewArrival: currentForm.isNewArrival,
        isSignature: currentForm.isSignature,
        collectionGroup: currentForm.collectionGroup,
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        colors: [currentForm.swatch || "Default Matrix"],
        // Appends metadata parameters directly into structure schema
        additionalInfo: [
          ...currentForm.additionalInfo,
          ...(currentForm.isSignature ? [
            { label: "Design Narrative", value: currentForm.story },
            { label: "Textile Provenance", value: currentForm.material },
            { label: "Structural Blueprint Core", value: currentForm.inspiration }
          ] : [])
        ]
      };

      const dbRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      if (!dbRes.ok) throw new Error("Database collection entry writing transaction rejected.");
      const dbData = await dbRes.json();

      if (dbData.success) {
        updateFormBlockFields(currentForm.formId, { isSuccess: true });
      }
    } catch (err: any) {
      alert(`CMS Transaction Error on card: ${err.message}`);
    } finally {
      updateFormBlockFields(currentForm.formId, { isUploading: false });
    }
  };

  const goldColor = "#C9A84C";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-left text-zinc-800">
      
      {/* Central Command Workspace Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">CMS BULK FACTORY</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Continuous Upload Dashboard</h1>
        </div>
        
        <button 
          onClick={handleAddNewFormBlock}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-md hover:bg-[#C9A84C] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product Entry Section</span>
        </button>
      </div>

      {/* Dynamic Render Loop of Active Workspace Section Cards */}
      <div className="space-y-12">
        {productForms.map((form, index) => (
          <div key={form.formId} className="relative bg-white border border-zinc-200 shadow-sm rounded-sm p-6 md:p-8 space-y-6">
            
            {/* Form Instance Toolbar Frame Section */}
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3 bg-zinc-50/50 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-4 mb-2">
              <span style={{ color: form.isSuccess ? "#10b981" : goldColor }} className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span>ENTRY BLOCK CONTAINER [0{index + 1}]</span>
              </span>
              
              <button 
                type="button" 
                onClick={() => handleRemoveFormBlock(form.formId)}
                className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                title="Discard this specific workspace form"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {form.isSuccess ? (
              <div className="p-12 text-center bg-emerald-50/50 border border-emerald-100 rounded-sm space-y-3 flex flex-col items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500 animate-pulse" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Garment Successfully Committed</h4>
                <p className="text-xs text-zinc-400 max-w-sm">This instance parameter loop has completely resolved in MongoDB. You can safely clear or replace this layout slot.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleCommitSingleProduct(e, form)} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left General Mapping Parameters Grid Column */}
                <div className="md:col-span-7 space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Garment Name</label>
                    <input required type="text" value={form.name} onChange={(e) => updateFormBlockFields(form.formId, { name: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g., Crimson Evening Gown" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Price (₦ Naira)</label>
                      <input required type="number" value={form.price} onChange={(e) => updateFormBlockFields(form.formId, { price: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="185000" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Department Gender</label>
                      <select value={form.gender} onChange={(e) => updateFormBlockFields(form.formId, { gender: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none focus:border-[#C9A84C]">
                        <option value="Female">Women's Collection</option>
                        <option value="Male">Men's Collection</option>
                        <option value="Both">Unisex / Both</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Category Group</label>
                      <select value={form.category} onChange={(e) => updateFormBlockFields(form.formId, { category: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none focus:border-[#C9A84C]">
                        <option value="Evening Wear">Evening Wear</option>
                        <option value="Bridal">Bridal</option>
                        <option value="Casual Wear">Casual Wear</option>
                        <option value="Work Wear">Work Wear</option>
                        <option value="Traditional">Traditional Wear</option>
                        <option value="Bespoke">Bespoke Tailoring</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Climate Collection Assignment</label>
                      <select value={form.collectionGroup} onChange={(e) => updateFormBlockFields(form.formId, { collectionGroup: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm bg-white focus:outline-none focus:border-[#C9A84C]">
                        <option value="none">No Specific Drop</option>
                        <option value="pluvial-drop">The Pluvial Drop (Rainy)</option>
                        <option value="harmattan-regal">Harmattan Regal (Festive)</option>
                        <option value="heritage-capsules">Heritage Capsules (Limited Run)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Atelier Product Description</label>
                    <textarea required rows={4} value={form.description} onChange={(e) => updateFormBlockFields(form.formId, { description: e.target.value })} className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-light" placeholder="Detail the cut weight, structural adjustments, silhouette definitions..." />
                  </div>

                  {/* ADDITIONAL DYNAMIC METADATA INFORMATION BLOCK */}
                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" /> Additional Information Parameters
                      </label>
                      <button type="button" onClick={() => handleAddInfoPair(form.formId)} className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#C9A84C] hover:underline">
                        + Add Spec Row
                      </button>
                    </div>

                    {form.additionalInfo.map((pair, pIdx) => (
                      <div key={pIdx} className="flex gap-2 items-center">
                        <input type="text" required value={pair.label} onChange={(e) => handleUpdateInfoPair(form.formId, pIdx, "label", e.target.value)} placeholder="e.g., Fabric Lining" className="flex-1 border border-zinc-300 p-2 rounded-sm text-xs focus:outline-none focus:border-[#C9A84C]" />
                        <input type="text" required value={pair.value} onChange={(e) => handleUpdateInfoPair(form.formId, pIdx, "value", e.target.value)} placeholder="e.g., 100% Weighted Silk" className="flex-1 border border-zinc-300 p-2 rounded-sm text-xs focus:outline-none focus:border-[#C9A84C]" />
                        <button type="button" onClick={() => handleRemoveInfoPair(form.formId, pIdx)} className="text-zinc-400 hover:text-red-500 p-1">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* EXTRA HIGHER COUTURE CONDITIONS DISCLOSURE MODULE (Reveals when isSignature is checked) */}
                  <div className={`transition-all duration-500 overflow-hidden ${form.isSignature ? "max-h-[600px] opacity-100 pt-4 border-t border-zinc-200 mt-4 space-y-4" : "max-h-0 opacity-0 pointer-events-none"}`}>
                    <span style={{ color: goldColor }} className="text-[10px] font-mono tracking-widest uppercase font-bold block">
                      ★ High-Fashion Signature Specifications Blueprint
                    </span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Textile Provenance</label>
                        <input type="text" required={form.isSignature} value={form.material} onChange={(e) => updateFormBlockFields(form.formId, { material: e.target.value })} placeholder="e.g., 100% Premium Silk Charmeuse layers" className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Color Swatch Range</label>
                        <input type="text" required={form.isSignature} value={form.swatch} onChange={(e) => updateFormBlockFields(form.formId, { swatch: e.target.value })} placeholder="e.g., Crimson Red / Midnight Black" className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">The Design Narrative / Story</label>
                      <textarea rows={3} required={form.isSignature} value={form.story} onChange={(e) => updateFormBlockFields(form.formId, { story: e.target.value })} placeholder="Describe the grand train movement paths, structural backlines, overlay configurations..." className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] font-light" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500">Structural Blueprint Inspiration</label>
                      <input type="text" required={form.isSignature} value={form.inspiration} onChange={(e) => updateFormBlockFields(form.formId, { inspiration: e.target.value })} placeholder="e.g., Traditional royal Nigerian postures balanced against contemporary parameters" className="w-full border border-zinc-300 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                  </div>

                </div>

                {/* Right Flags Controller & Media Upload Pipeline Zone (5 Columns) */}
                <div className="md:col-span-5 space-y-5">
                  
                  {/* Storefront Layout Flag Groupings Container */}
                  <div className="p-4 border border-zinc-200 bg-zinc-50/50 rounded-sm space-y-2.5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 border-b pb-1.5 mb-2">Display Routing Parameters</h3>
                    
                    <label className="flex items-center gap-3 text-xs cursor-pointer font-bold uppercase tracking-wide text-zinc-600">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateFormBlockFields(form.formId, { isFeatured: e.target.checked })} className="h-3.5 w-3.5 rounded-sm accent-[#C9A84C]" />
                      <span>Showcase on Home Grid</span>
                    </label>

                    <label className="flex items-center gap-3 text-xs cursor-pointer font-bold uppercase tracking-wide text-zinc-600">
                      <input type="checkbox" checked={form.isNewArrival} onChange={(e) => updateFormBlockFields(form.formId, { isNewArrival: e.target.checked })} className="h-3.5 w-3.5 rounded-sm accent-[#C9A84C]" />
                      <span>Pill as New Arrival</span>
                    </label>

                    <label className="flex items-center gap-3 text-xs cursor-pointer font-bold uppercase tracking-wide text-zinc-600">
                      <input type="checkbox" checked={form.isSignature} onChange={(e) => updateFormBlockFields(form.formId, { isSignature: e.target.checked })} className="h-3.5 w-3.5 rounded-sm accent-[#C9A84C]" />
                      <span style={{ color: form.isSignature ? goldColor : "inherit" }}>Highlight as Signature Masterpiece</span>
                    </label>
                  </div>

                  {/* Dropzone File Dropper */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-500 block">Garment Media Views</label>
                    <div className="border border-dashed border-zinc-300 hover:border-[#C9A84C] bg-zinc-50/60 p-5 text-center rounded-sm relative transition-colors">
                      <input type="file" multiple accept="image/*" onChange={(e) => handleFileSelection(form.formId, e.target.files)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" />
                      <Upload className="h-6 w-6 text-zinc-400 mx-auto mb-1.5" />
                      <p className="text-xs text-zinc-600 font-medium">Select item images</p>
                    </div>

                    {/* Previews Collection Container */}
                    {form.previewUrls.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1.5">
                        {form.previewUrls.map((url, imgIdx) => (
                          <div key={imgIdx} className="relative aspect-square border border-zinc-200 rounded-sm overflow-hidden bg-white">
                            <img src={url} alt="Garment swatch trace" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => handleRemovePreviewAsset(form.formId, imgIdx)} className="absolute top-1 right-1 p-0.5 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors z-20">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Isolated Action Trigger Button */}
                  <button
                    type="submit"
                    disabled={form.isUploading}
                    style={{ backgroundColor: form.isUploading ? "#e4e4e7" : "#1a1a1a" }}
                    className="w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-[#C9A84C]"
                  >
                    {form.isUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                        <span className="text-zinc-500">Uploading Container Parameters...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Commit This Garment</span>
                      </>
                    )}
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