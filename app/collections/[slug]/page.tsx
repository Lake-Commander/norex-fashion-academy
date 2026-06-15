import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";
import RunwayLook from "@/lib/models/RunwayLook";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Sparkles, Play, ShieldCheck, ShoppingBag } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function DynamicCollectionPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const collectionDoc = await RunwayCollection.findOne({ slug }).lean();
  if (!collectionDoc) notFound();
  const collection = JSON.parse(JSON.stringify(collectionDoc));

  // Query lookbook garments attached to this collection node
  const looksDocs = await RunwayLook.find({ collectionId: collection._id, type: "look" }).sort({ lookNumber: 1 }).lean();
  const looks = JSON.parse(JSON.stringify(looksDocs));

  const isDarkTheme = collection.waSeason === "Harmattan Regal";
  const goldColor = "#C9A84C";

  return (
    <main 
      className="min-h-screen transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left"
      style={{ 
        backgroundColor: isDarkTheme ? "#000000" : "#FCFAF7",
        color: isDarkTheme ? "#FAF9F6" : "#1a1a1a"
      }}
    >
      <style>{`
        .collection-hero { relative; w-full; aspect-ratio: 21/9; min-height: 380px; overflow: hidden; display: flex; align-items: center; justify-content: center; border-b: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : "#f0ebe3"}; }
        .look-card { display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; color: inherit; }
        .look-img-wrapper { aspect-ratio: 3/4; w-full; overflow: hidden; border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.05)" : "#e5e7eb"}; background-color: ${isDarkTheme ? "#111" : "#FAF7F4"}; transition: all 0.3s; }
        .look-card:hover .look-img-wrapper { border-color: #C9A84C; transform: translateY(-2px); }
        .btn-action-trigger { width: 100%; py: 1rem; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; border-radius: 1px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
      `}</style>

      {/* Hero Canvas Banner */}
      <section className="collection-hero relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale animate-fade-in" style={{ backgroundImage: `url('${collection.coverImage || "/placeholder.png"}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
        
        <div className="absolute inset-x-6 bottom-8 max-w-7xl mx-auto space-y-3 z-10 text-white">
          <div style={{ borderColor: "rgba(201,168,76,0.4)", backgroundColor: "rgba(201,168,76,0.1)", color: goldColor }} className="inline-flex items-center gap-1 px-3 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-bold">
            <Sparkles className="h-3 w-3" />
            <span>{collection.waSeason.toUpperCase()} CAPSULE COLLECTION</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight max-w-4xl leading-none">
            {collection.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-16 space-y-20">
        
        {/* Campaign Plot Frame */}
        <div style={{ borderBottomColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "#f0ebe3" }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b pb-12">
          <div className="lg:col-span-5 space-y-4">
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CAMPAIGN STORY BOARD</span>
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-2xl sm:text-3xl font-bold uppercase leading-tight">
              Design Objective & Core Narrative.
            </h2>
            <p className="text-xs leading-relaxed font-light font-sans text-justify opacity-80">
              {collection.campaignPlot}
            </p>
          </div>
          {collection.btsImage && (
            <div style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.05)" : "#f0ebe3" }} className="lg:col-span-7 aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden border">
              <img src={collection.btsImage} alt="Backstage work loops" className="w-full h-full object-cover filter grayscale contrast-[1.03]" />
            </div>
          )}
        </div>

        {/* Climatic Color Palette Display Matrix */}
        {collection.palette?.length > 0 && (
          <div className="space-y-6">
            <div>
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CHROMATIC PALETTE MATRICES</span>
              <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase tracking-wide mt-1">Seasonal Chromatics</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {collection.palette.map((col: any, idx: number) => (
                <div key={idx} style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "#f0ebe3", backgroundColor: isDarkTheme ? "#111" : "white" }} className="p-4 border rounded-sm flex flex-col gap-4">
                  <div style={{ backgroundColor: col.hex, borderColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "#f0ebe3" }} className="h-16 w-full rounded-sm border shadow-inner" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">{col.name}</h4>
                    <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase">{col.rgb}</p>
                    <p className="text-[10px] text-zinc-400 font-light mt-1 font-sans">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lookbook Looks List Section */}
        {looks.length > 0 && (
          <div className="space-y-6">
            <div>
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">VISUAL LOOKBOOK REGISTRY</span>
              <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase tracking-wide mt-1">Collection Looks Deck</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {looks.map((look: any) => (
                <Link key={look._id} href="/runway" className="look-card group">
                  <div className="look-img-wrapper rounded-sm">
                    <img src={look.image} alt={look.garmentName} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">LOOK {look.lookNumber}</span>
                    <h4 className="text-xs font-bold truncate mt-0.5 uppercase tracking-wide">{look.garmentName || "Atelier Silhouette Piece"}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">{look.modelName || "Atelier Catalog Frame"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Filmhouse Callout Module Trigger */}
        {collection.hasFilm && (
          <div style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "#e5e7eb", backgroundColor: isDarkTheme ? "#111" : "#FAF7F4" }} className="p-8 border rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">EXPERIENCE BROADCAST ACCESS</span>
              <h4 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-lg font-bold uppercase tracking-wide">Behind the Blueprint Documentary Film</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                Explore the raw ambient audio logs, loom framework configurations, and garment fitting chronicles captured live during the processing of this seasonal drop.
              </p>
            </div>
            <Link 
              href="/runway/fashion-films"
              style={{ backgroundColor: goldColor }}
              className="px-6 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-md text-decoration-none hover:opacity-90"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Stream Campaign Short</span>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}