"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Trash2, Star, Flame, Award, Loader2, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { sounds } from "@/lib/sound-utils";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  gender: string;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSignature: boolean;
  collectionGroup: string;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch store records on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed fetching storefront registry:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Centralized toggle processor for toggling isFeatured, isNewArrival, or isSignature
  const handleToggleFlag = async (id: string, field: "isFeatured" | "isNewArrival" | "isSignature", currentValue: boolean) => {
    setProcessingId(`${id}-${field}`);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue })
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, [field]: !currentValue } : p))
        );
        sounds.playClick();
      }
    } catch (err) {
      alert("Failed updating flag mapping node.");
    } finally {
      setProcessingId(null);
    }
  };

  // Expunge item permanently from database
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you certain you want to permanently delete "${name}" from the catalog?`)) return;

    setProcessingId(`${id}-delete`);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        sounds.playSweep();
      }
    } catch (err) {
      alert("Failed expunging garment from registry.");
    } finally {
      setProcessingId(null);
    }
  };

  const getCollectionBadgeLabel = (group: string) => {
    switch (group) {
      case "pluvial-drop": return "Pluvial Drop";
      case "harmattan-regal": return "Harmattan Regal";
      case "heritage-capsules": return "Heritage Capsule";
      default: return "Standard Catalog";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-zinc-800">
      
      {/* Header Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C] font-bold uppercase block">STOREFRONT INVENTORY</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl font-bold mt-1 uppercase text-zinc-900">Garment Registry</h1>
        </div>
        
        <Link 
          href="/admin/products/upload"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-md hover:bg-[#C9A84C] text-decoration-none"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Garment</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
          <p className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Loading Master Product Arrays...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-200 bg-zinc-50/50 rounded-sm space-y-3">
          <ImageIcon className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700">Catalog Registry Empty</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">No custom pieces uploaded yet. Initialize your digital showroom by adding products above.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                  <th className="p-4 font-bold">Garment</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Category Scope</th>
                  <th className="p-4 font-bold">Climate Allocation</th>
                  <th className="p-4 font-bold text-center">Homepage Flag Toggles</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50/70 transition-colors">
                    
                    {/* Image & Title Column */}
                    <td className="p-4 flex items-center gap-4 min-w-[240px]">
                      <div className="h-12 w-12 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400"><ImageIcon size={16} /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-zinc-900 truncate uppercase text-xs tracking-wide">{product.name}</h4>
                        <span className="text-[9px] font-mono uppercase bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                          {product.gender === "Both" ? "Unisex" : product.gender}
                        </span>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="p-4 font-mono font-bold text-zinc-700 min-w-[110px]">
                      {formatPrice(product.price)}
                    </td>

                    {/* Category Column */}
                    <td className="p-4 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                      {product.category}
                    </td>

                    {/* Climate Collection Grouping Badge */}
                    <td className="p-4 min-w-[140px]">
                      <span 
                        className={`text-[9px] font-mono uppercase px-2 py-1 rounded-sm border font-bold ${
                          product.collectionGroup !== "none"
                            ? "bg-amber-50/50 border-amber-200 text-amber-800"
                            : "bg-zinc-50 border-zinc-200 text-zinc-400"
                        }`}
                      >
                        {getCollectionBadgeLabel(product.collectionGroup)}
                      </span>
                    </td>

                    {/* Homepage Visibility Feature Flags Toggles */}
                    <td className="p-4 min-w-[240px]">
                      <div className="flex justify-center items-center gap-3">
                        
                        {/* Featured Flag */}
                        <button
                          onClick={() => handleToggleFlag(product._id, "isFeatured", product.isFeatured)}
                          disabled={processingId !== null}
                          className={`p-2 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                            product.isFeatured 
                              ? "bg-amber-50 border-[#C9A84C] text-[#C9A84C]" 
                              : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                          }`}
                          title="Toggle Homepage Grid Showcase"
                        >
                          {processingId === `${product._id}-isFeatured` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Star className={`h-3.5 w-3.5 ${product.isFeatured ? "fill-current" : ""}`} />
                          )}
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Grid</span>
                        </button>

                        {/* New Arrival Flag */}
                        <button
                          onClick={() => handleToggleFlag(product._id, "isNewArrival", product.isNewArrival)}
                          disabled={processingId !== null}
                          className={`p-2 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                            product.isNewArrival 
                              ? "bg-purple-50 border-purple-400 text-purple-700" 
                              : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                          }`}
                          title="Toggle New Arrival Drop Badge"
                        >
                          {processingId === `${product._id}-isNewArrival` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Flame className={`h-3.5 w-3.5 ${product.isNewArrival ? "fill-current" : ""}`} />
                          )}
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">New</span>
                        </button>

                        {/* Signature Piece Flag */}
                        <button
                          onClick={() => handleToggleFlag(product._id, "isSignature", product.isSignature)}
                          disabled={processingId !== null}
                          className={`p-2 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                            product.isSignature 
                              ? "bg-emerald-50 border-emerald-400 text-emerald-700" 
                              : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                          }`}
                          title="Highlight as Signature Design Narrative Block"
                        >
                          {processingId === `${product._id}-isSignature` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Award className="h-3.5 w-3.5" />
                          )}
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Signature</span>
                        </button>

                      </div>
                    </td>

                    {/* Hard Delete Execution Column */}
                    <td className="p-4 text-right min-w-[100px]">
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        disabled={processingId === `${product._id}-delete`}
                        className="p-2 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer"
                        title="Expunge Garment From Core Registry"
                      >
                        {processingId === `${product._id}-delete` ? (
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
