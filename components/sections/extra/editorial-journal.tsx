'use client'

import { Sparkles, ArrowRight } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import Link from 'next/link'

export default function EditorialJournal() {
  const { soundEnabled } = useShop()

  // Updated articles with African themes mapping directly to your catalog images
  const articles = [
    {
      id: 'insight',
      category: 'Style Insights',
      title: 'The Grammar of Posture and Silk Charmeuse Drapery',
      desc: 'An exploration into how our flagship Crimson Gown balances hand-sewn bodice beadwork with fluid architectural alignment paths.',
      image: '/product-1.png',
      date: 'June 09, 2026',
      readTime: '4 Min Read'
    },
    {
      id: 'story',
      category: 'Fashion Stories',
      title: 'The Co-ord Shift: Traditional Ankara Fluidity',
      desc: 'Following our pattern design team as they reconstruct heritage multi-prints into contemporary, unisex structural streetwear layouts.',
      image: '/product-6-new.jpeg',
      date: 'June 02, 2026',
      readTime: '6 Min Read'
    },
    {
      id: 'perspective',
      category: 'Academy Perspectives',
      title: 'The 2.8% Layout Challenge: Eradicating Studio Waste',
      desc: 'A review of our custom pattern puzzle nesting configurations utilized inside our Warri design training rooms to protect premium textiles.',
      image: '/product-4.jpg',
      date: 'May 18, 2026',
      readTime: '5 Min Read'
    }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <section className="bg-[#050505] px-6 py-24 md:px-8 border-b border-white/10 relative overflow-hidden">
      
      {/* Visual background nodes */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 blur-[100px] pointer-events-none rounded-full" 
        style={{ backgroundColor: "rgba(201, 168, 76, 0.02)" }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">09 // THE JOURNAL</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            Editorial Journal
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl font-light">
            Step into the editorial world of Norex. Read curated essays, studio design journals, and developments in Nigerian contemporary drapes.
          </p>
        </div>

        {/* 3-Column Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link
              href="/editorial"
              key={art.id}
              onMouseEnter={handleInteract}
              onClick={() => { if (soundEnabled) sounds.playClick() }}
              style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(26,26,26,0.2)" }}
              className="group cursor-pointer flex flex-col justify-between border rounded-sm p-4 hover:border-[#C9A84C]/50 transition-all duration-300 backdrop-blur-md"
            >
              {/* Image box */}
              <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="aspect-[4/3] rounded-sm overflow-hidden relative bg-[#FAF7F4] mb-6">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 filter grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-black/5" />
                
                {/* Floating category tag */}
                <div style={{ backgroundColor: "rgba(0,0,0,0.7)", borderColor: "rgba(255,255,255,0.05)" }} className="absolute top-4 left-4 px-3 py-1 rounded-sm border text-[8px] font-mono tracking-widest uppercase text-white/90">
                  {art.category}
                </div>
              </div>

              {/* Text metadata */}
              <div className="text-left space-y-4 px-1 pb-1">
                <div style={{ letterSpacing: "0.1em" }} className="flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase font-semibold">
                  <span>{art.date}</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold uppercase text-white tracking-wide leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {art.title}
                </h3>
                
                <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                  {art.desc}
                </p>

                <div 
                  style={{ borderTopColor: "rgba(255,255,255,0.05)", color: goldColor }} 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors pt-4 border-t"
                >
                  <span>Open Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}