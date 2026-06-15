import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";
import RunwayLook from "@/lib/models/RunwayLook";
import Link from "next/link";
import { Sparkles, Play, ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const collection = await RunwayCollection.findOne({ slug }).lean();
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: `${collection.title} | Norex Showroom`,
    description: collection.campaignPlot,
  };
}

export default async function DynamicCollectionPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const collectionDoc = await RunwayCollection.findOne({ slug }).lean();
  if (!collectionDoc) notFound();
  const collection = JSON.parse(JSON.stringify(collectionDoc));

  // Query lookbook garments or scenes attached to this collection instance
  const looksDocs = await RunwayLook.find({ collectionId: collection._id, type: "look" })
    .sort({ lookNumber: 1 })
    .lean();
  const looks = JSON.parse(JSON.stringify(looksDocs));

  // Dynamic Theme Mapping based on West African climatic season parameters
  const isDarkTheme = collection.waSeason === "Harmattan Regal";
  const goldColor = "#C9A84C";

  return (
    <main 
      className="min-h-screen transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left"
      style={{ 
        backgroundColor: isDarkTheme ? "#0c0c0c" : "#FCFAF7",
        color: isDarkTheme ? "#FAF9F6" : "#1a1a1a"
      }}
    >
      <style>{`
        .collection-hero { position: relative; w-full; aspect-ratio: 21/9; min-height: 380px; overflow: hidden; display: flex; align-items: center; justify-content: center; border-b: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : "#f0ebe3"}; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media(min-width: 1024px) { .grid-layout { grid-template-columns: repeat(12, 1fr); gap: 4rem; } }

        .palette-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media(min-width: 640px) { .palette-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; } }

        .looks-display-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        @media(min-width: 768px) { .looks-display-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem; } }

        .look-card { display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; color: inherit; }
        .look-img-wrapper { aspect-ratio: 3/4; width: 100%; overflow: hidden; border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.05)" : "#e5e7eb"}; background-color: ${isDarkTheme ? "#111" : "#FAF7F4"}; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); position: relative; }
        .look-card:hover .look-img-wrapper { border-color: #C9A84C; transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
        
        .breadcrumb-back { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; font-mono: monospace; display: flex; align-items: center; gap: 0.35rem; color: ${isDarkTheme ? "rgba(255,255,255,0.4)" : "#9ca3af"}; text-decoration: none; transition: color 0.2s; font-weight: 700; }
        .breadcrumb-back:hover { color: #C9A84C; }
      `}</style>

      {/* Hero Canvas Header */}
      <section className="collection-hero">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale mix-blend-luminosity animate-fade-in" style={{ backgroundImage: `url('${collection.coverImage || "/placeholder.png"}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50 pointer-events-none" />
        
        <div className="absolute inset-x-6 bottom-8 max-w-7xl mx-auto space-y-3 z-10 text-white">
          <div style={{ borderColor: isDarkTheme ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)", backgroundColor: isDarkTheme ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-0.5 border rounded-full text-[8px] font-mono tracking-widest uppercase font-black">
            <Sparkles className="h-3 w-3" />
            <span>{collection.waSeason.toUpperCase()} COLLECTION TRACK</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight max-w-5xl leading-none">
            {collection.title}
          </h1>
        </div>
      </section>

      {/* Content Stream Wrapper */}
      <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-12 space-y-16">
        
        {/* Dynamic Back to Collections Navigation Header */}
        <div style={{ borderBottom: `1px solid ${isDarkTheme ? "rgba(255,255,255,0.08)" : "#e5e7eb"}` }} className="pb-4">
          <Link href="/archive" className="breadcrumb-back">
            <ArrowLeft size={14} /> <span>Back to Showrooms Inventory</span>
          </Link>
        </div>

        {/* Campaign Plot Framework */}
        <div style={{ borderBottomColor: isDarkTheme ? "rgba(255,255,255,0.08)" : "#f0ebe3" }} className="grid-layout border-b pb-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CAMPAIGN STORY BOARD</span>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl sm:text-3xl font-bold uppercase leading-tight">
              Design Objective & Narrative context
            </h2>
            <p className="text-xs leading-relaxed font-sans text-justify opacity-75 font-light">
              {collection.campaignPlot}
            </p>
          </div>
          {collection.btsImage && (
            <div style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.08)" : "#f0ebe3" }} className="lg:col-span-7 child-media-frame aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden border relative">
              <img src={collection.btsImage} alt="Atelier backstage processing loops" className="w-full h-full object-cover filter grayscale contrast-[1.04]" />
            </div>
          )}
        </div>

        {/* Climatic Color Palette Display Matrix */}
        {collection.palette?.length > 0 && (
          <div className="space-y-6">
            <div>
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">CHROMATIC PALETTE SPECIFICATIONS</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1">Climatic Chromatics</h3>
            </div>
            <div className="palette-grid">
              {collection.palette.map((col: any, idx: number) => (
                <div key={idx} style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.08)" : "#f0ebe3", backgroundColor: isDarkTheme ? "#141414" : "white" }} className="p-4 border rounded-sm flex flex-col gap-4 shadow-sm">
                  <div style={{ backgroundColor: col.hex, borderColor: isDarkTheme ? "rgba(255,255,255,0.05)" : "#f0ebe3" }} className="h-16 w-full rounded-sm border shadow-inner" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide truncate">{col.name}</h4>
                    <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wider">{col.rgb}</p>
                    <p className="text-[10px] text-zinc-400 font-light mt-1.5 font-sans leading-relaxed text-justify line-clamp-2">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lookbook Collection Outfits Matrix Grid */}
        {looks.length > 0 && (
          <div className="space-y-6">
            <div>
              <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black uppercase block">VISUAL TAILORING ARCHIVE INDEX</span>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase tracking-wide mt-1">Collection Looks Deck</h3>
            </div>
            <div className="looks-display-grid">
              {looks.map((look: any) => (
                <Link key={look._id} href="/runway" className="look-card group">
                  <div className="look-img-wrapper rounded-sm">
                    <img src={look.image || "/placeholder-garment.png"} alt={look.garmentName} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-[800ms]" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">LOOK {look.lookNumber}</span>
                    <h4 className="text-xs font-bold truncate mt-0.5 uppercase tracking-wide">{look.garmentName || "Atelier Silhouette Framework Piece"}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">{look.modelName || "Showroom Variant Model"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Filmhouse Callout Module Widget Trigger */}
        {collection.hasFilm && (
          <div style={{ borderColor: isDarkTheme ? "rgba(255,255,255,0.08)" : "#e5e7eb", backgroundColor: isDarkTheme ? "#141414" : "#FAF7F4" }} className="p-8 border rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="max-w-xl space-y-2 text-left">
              <span style={{ color: goldColor }} className="text-[8px] font-mono font-bold uppercase tracking-wider block">CINEMATIC TRANSMISSION SHIELD</span>
              <h4 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-lg font-bold uppercase tracking-wide text-current">Behind the Blueprint Documentary short</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans text-justify">
                Explore the raw background acoustics, physical textile swatch boards, loom mapping data logs, and backstage fitting sequences captured live by pattern specialist trainers during development.
              </p>
            </div>
            <Link 
              href="/runway/fashion-films"
              style={{ backgroundColor: goldColor }}
              className="px-6 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer text-decoration-none hover:opacity-90 shadow-md"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Watch Campaign Short</span>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}