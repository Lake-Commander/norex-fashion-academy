import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import RunwayCollection from "@/lib/models/RunwayCollection";
import RunwayLook from "@/lib/models/RunwayLook";
import Link from "next/link";
import { ArrowLeft, History, Clock, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ season: string }> };

export default async function ArchiveSeasonPage({ params }: Props) {
  const { season } = await params;
  await connectDB();

  const collectionDoc = await RunwayCollection.findOne({ slug: season }).lean();
  if (!collectionDoc) notFound();
  const data = JSON.parse(JSON.stringify(collectionDoc));

  // Fetch lookbook garments assigned to this historical record marker
  const looksDocs = await RunwayLook.find({ collectionId: data._id, type: "look" }).sort({ lookNumber: 1 }).lean();
  const looks = JSON.parse(JSON.stringify(looksDocs));

  const goldColor = "#C9A84C";

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-900 transition-colors duration-500 flex flex-col justify-between overflow-x-hidden text-left">
      <section className="relative w-full py-16 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          {/* Breadcrumb row alignment */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-200 pb-4">
            <Link href="/archive" className="hover:text-[#C9A84C] flex items-center gap-1 text-decoration-none text-current font-bold">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Museum Archive</span>
            </Link>
            <span>/</span>
            <span className="font-bold text-zinc-800">{data.waSeason.toUpperCase()} VAULT REGISTRY</span>
          </div>

          {/* Title Area Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span style={{ color: goldColor }} className="text-[10px] font-mono tracking-[0.3em] uppercase font-black block">
                ARCHIVED COUTURE BLOCK LOG
              </span>
              <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 leading-none">
                {data.title}
              </h1>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A84C]">{data.waSeason} Framework</p>
              <p className="text-xs text-zinc-500 leading-relaxed font-light font-serif italic text-justify">
                {data.campaignPlot}
              </p>
            </div>
            
            <div className="lg:col-span-7 aspect-[21/9] bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shadow-sm">
              <img src={data.coverImage || "/placeholder.png"} alt="" className="w-full h-full object-cover filter grayscale" />
            </div>
          </div>

          {/* Visual Look Breakdown Loop Grid */}
          {looks.length > 0 && (
            <div className="space-y-6">
              <div>
                <span style={{ color: goldColor }} className="text-[9px] font-mono tracking-widest font-black flex items-center gap-1.5 uppercase">
                  <History className="h-3.5 w-3.5" />
                  <span>SIGNATURE LOOKS TRACKING MATRIX</span>
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-xl font-bold uppercase tracking-wide mt-1 text-zinc-900">Look Architecture Logs</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {looks.map((look: any) => (
                  <div key={look._id} className="p-4 border border-zinc-200 bg-white rounded-sm flex gap-4 items-center shadow-sm">
                    <div className="w-20 h-28 rounded-sm overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                      <img src={look.image} alt="" className="w-full h-full object-cover filter grayscale" />
                    </div>
                    <div className="space-y-1 text-left">
                      <span style={{ color: goldColor }} className="text-[8px] font-mono font-black uppercase">LOOK {look.lookNumber}</span>
                      <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">{look.garmentName || "Atelier Silhouette"}</h4>
                      <p className="text-xs text-zinc-500 font-light font-serif italic">"{look.commentary.substring(0, 90)}..."</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Traceability Footnote */}
          <div className="p-5 bg-[#FAF7F4] border border-zinc-200 rounded-sm text-[10px] font-mono text-zinc-400 uppercase tracking-wide leading-relaxed font-bold">
            Historical Note Tracker: All technical specifications, pattern templates, and fabric data maps regarding {data.title} are written securely into locked archive allocations.
          </div>

        </div>
      </section>
    </main>
  );
}