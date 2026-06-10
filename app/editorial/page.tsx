'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { 
  ChevronRight, 
  X, 
  BookOpen, 
  Star, 
  Quote, 
  Compass, 
  Clock, 
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  category: 'Couture & Atelier' | 'Sustainability Deck' | 'Sustainable Living' | 'Culture & Heritage'
  image: string
  summary: string
  author: string
  date: string
  readTime: string
  photography: string
  styling: string
  content: string[]
  pullQuote: string
}

const magazineArticles: Article[] = [
  {
    id: '1',
    category: 'Couture & Atelier',
    title: 'THE CRIMSON ARCHITECTURE: REDEFINING NIGERIAN REGAL DRAPERY',
    image: '/product-1.png',
    summary: 'An exploration into fluid silk mechanics, hand-sewn bodice beadwork, and structural open-back geometry tailored within our Warri studio.',
    author: 'Ephraim Ohise',
    date: 'June 09, 2026',
    readTime: '6 min read',
    photography: 'Daniel Obasi',
    styling: 'Smartatta Emmanuel',
    pullQuote: "Bespoke lines should never strangle movement. Our evening wear must breathe, float, and sway with majestic freedom at every black-tie event.",
    content: [
      "In the landscape of Nigerian ceremonial fashion, volume and rigidity have historically dictated design. From heavily starched traditional laces to unyielding structural linings, ensembles frequently restricted the natural posture of the modern wearer. The design table at Norex Fashion set out to disrupt this framework.",
      "By engineering custom drape formulas on premium silk charmeuse fabric, our atelier crafted a method that perfectly supports structural weight while encouraging dramatic movement. The iconic Crimson Evening Gown uses these contours, maintaining an immaculate silhouette from its tailored bodice down to the grand sweep of its train.",
      "The delicate hand-beaded detailing accentuating the bodice serves as an architectural anchor. This ensures that the low open-back line retains its tailored hold during natural physical movement, capturing an elegant visual equilibrium that feels lightweight yet deeply impactful."
    ]
  },
  {
    id: '2',
    category: 'Culture & Heritage',
    title: 'THE CO-ORD REVOLUTION: INTERPRETING TRADITIONAL ANKARA FUSION',
    image: '/product-6-new.jpeg',
    summary: 'How contemporary unisex block tailoring is repositioning premium African heritage prints inside daily casual styles.',
    author: 'Kemi Sanusi',
    date: 'June 02, 2026',
    readTime: '5 min read',
    photography: 'Stephen Tayo',
    styling: 'Dunsin Wright',
    pullQuote: "Ankara is not a static canvas for the past. It is an evolving language of geometry, tailored to break down boundaries.",
    content: [
      "Vibrant Ankara prints have always carried deep communal history across West Africa, traditionally styled into rigid, formal silhouettes. However, our creative design room saw an opportunity to bridge heritage expressions with modern urban requirements.",
      "The result is the Ankara Fusion Co-ord Set—a versatile two-piece ensemble that balances structured cropped jackets with sweeping wide-leg trousers. By cutting the textile profiles explicitly across unisex baselines, the collection honors historic multi-prints while serving a contemporary global crowd.",
      "By teaching these intricate pattern-matching methods to trainees inside our fashion design academy, Norex is protecting standard artisan skills while injecting fresh perspective into Nigerian casual wear loops."
    ]
  },
  {
    id: '3',
    category: 'Sustainability Deck',
    title: 'THE ATELIER GRID SYSTEM: DEFEATING PRODUCTION WASTE IN DELTA STATE',
    image: '/runway/bts-06.avif',
    summary: 'How our design academy optimized layout cutting maps to decrease fabric remnant borders to a record 2.8%.',
    author: 'Tamunotaribo Ferebo',
    date: 'May 18, 2026',
    readTime: '4 min read',
    photography: 'Chidi Thompson',
    styling: 'Norex Studio Team',
    pullQuote: "Wastage is an operational failure. An intelligent layout grid locks pattern cuts together like a puzzle, preserving precious textiles.",
    content: [
      "In standard custom garment production, up to 25% of raw textile lengths are regular casualties of the initial cutting phase. These offcut scraps are typically written off as unavoidable workspace losses. For a responsible house, this metric was unacceptable.",
      "Our pattern designers developed a systematic nesting layout framework. By charting panels together in precise mathematical placements, garment pieces lock snugly into one another, dropping leftover remnants down to a tight 2.8%.",
      "The remaining offcut fragments are immediately collected and redirected into our fashion academy workshops. Students transform these premium silk and traditional print residuals into patchwork headwear, inner linings, and experimental design mockups, ensuring a circular ecosystem."
    ]
  },
  {
    id: '4',
    category: 'Couture & Atelier',
    title: 'THE CATHEDRAL WEAVE: UNPACKING TIMELINES IN BRIDAL COUTURE',
    image: '/product-4.jpg',
    summary: 'Behind the scenes of our signature bridal masterworks, featuring delicate lace layouts and structured underwire baselines.',
    author: 'Sylvester Oputa',
    date: 'May 10, 2026',
    readTime: '7 min read',
    photography: 'Lakin Ogunbanwo',
    styling: 'Gabriella Karefa-Johnson',
    pullQuote: "Every bridal gown is an emotional monument. Each hand-embroidered line tracks a dedicated narrative of timeless elegance.",
    content: [
      "Bridal attire demands an elite standard of construction. The garment must support extreme physical posture requirements over long hours while appearing completely effortless. Inside our bespoke salon, this balance is approached like fine architecture.",
      "The Ivory Bridal Ensemble displays this dedication. Built on an underlying corsetry base, the dress supports the torso comfortably while distributing the weight of the exquisite lace overlay and cathedral-length veil across safe ergonomic coordinates.",
      "Finished over eighty hours of hand-guided stitchwork, the micro-floral details are hand-placed across the lace boundaries to flow seamlessly across structural seam closures, capturing an impeccable, unified rhythm."
    ]
  }
]

export default function EditorialPage() {
  const { soundEnabled } = useShop()
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleSelectArticle = (article: Article) => {
    if (soundEnabled) sounds.playChord()
    setSelectedArticle(article)
  }

  const handleCloseDrawer = () => {
    if (soundEnabled) sounds.playSweep()
    setSelectedArticle(null)
  }

  const categories = ['ALL', 'COUTURE & ATELIER', 'SUSTAINABILITY DECK', 'CULTURE & HERITAGE']

  const filteredArticles = activeCategory === 'ALL'
    ? magazineArticles
    : magazineArticles.filter(art => art.category.toUpperCase() === activeCategory)

  const coverStory = magazineArticles[0]
  const goldColor = "#C9A84C"

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />

      <style>{`
        .gazette-border { border-color: #1a1a1a; }
        .text-gold { color: #C9A84C; }
        .bg-gold { background-color: #C9A84C; }
        
        .article-card {
          border: 1px solid #e5e7eb; bg-white; padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .article-card:hover {
          border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.08);
          transform: translateY(-2px);
        }
        
        .pick-row {
          display: flex; gap: 1rem; padding: 0.75rem; border: 1px solid #e5e7eb;
          transition: all 0.3s ease; background-color: white;
        }
        .pick-row:hover { border-color: #C9A84C; transform: translateX(2px); }
        
        .btn-black-outline {
          display: inline-flex; px: 1.5rem; py: 0.75rem; border: 1px solid #1a1a1a;
          background: none; text-transform: uppercase; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.15em; cursor: pointer; transition: all 0.3s;
        }
        .btn-black-outline:hover { background-color: #1a1a1a; color: white; }
        
        .drawer-overlay {
          position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px); display: flex; justify-content: flex-end;
        }
      `}</style>

      {/* Editorial Content Container */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-24 md:px-8">
        
        {/* Magazine Header Masthead */}
        <header style={{ borderBottom: "2px solid #1a1a1a" }} className="pb-6 mb-12 text-center space-y-4">
          <div style={{ borderColor: "#e5e7eb" }} className="text-[10px] font-mono tracking-[0.3em] text-[#6b7280] uppercase flex justify-between items-center border-b pb-2">
            <span>ISSUE NO. 04 // SEASONAL 2026</span>
            <span className="hidden md:inline">POWERED BY NOREX DESIGN ACADEMY STATIONS</span>
            <span>EST. WARRI, NIGERIA</span>
          </div>
          
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900, color: "#1a1a1a" }} className="tracking-tighter uppercase select-none leading-none pt-2">
            Norex Gazette
          </h1>
          <p style={{ letterSpacing: "0.2em" }} className="text-[10px] font-mono text-[#6b7280] uppercase pt-1">
            THE CHRONICLES OF WEST AFRICAN TAILORING, GEOMETRIC CONTOURS & COUTURE EDUCATION
          </p>
        </header>

        {/* Big Cover Feature */}
        <section style={{ borderBottom: "1px solid #e5e7eb" }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 mb-12 items-center">
          
          {/* Cover Image */}
          <div 
            onClick={() => handleSelectArticle(coverStory)}
            style={{ border: "1px solid #e5e7eb" }}
            className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden bg-gray-100 cursor-pointer group relative shadow-sm"
          >
            <img 
              src={coverStory.image} 
              alt={coverStory.title} 
              className="w-full h-full object-cover filter grayscale contrast-[1.02] group-hover:grayscale-0 transition-all duration-[1000ms] scale-100 group-hover:scale-[1.01]"
            />
            <div style={{ background: "rgba(26,26,26,0.75)" }} className="absolute bottom-4 left-4 px-3 py-1 text-[8px] text-white font-mono uppercase tracking-widest rounded-sm font-bold">
              FEATURED ATELIER COVER STORY
            </div>
          </div>

          {/* Cover Text Info */}
          <div className="lg:col-span-5 text-left space-y-4">
            <span style={{ color: "#C9A84C", letterSpacing: "0.15em" }} className="text-[9px] font-mono uppercase font-bold block">
              {coverStory.category}
            </span>
            <h2 
              onClick={() => handleSelectArticle(coverStory)}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15 }}
              className="uppercase text-[#1a1a1a] hover:text-[#C9A84C] cursor-pointer transition-colors"
            >
              {coverStory.title}
            </h2>
            <p className="text-sm text-[#4b5563] font-serif italic leading-relaxed">
              "{coverStory.summary}"
            </p>
            
            <div style={{ borderTop: "1px solid #f0ebe3" }} className="pt-3 flex items-center justify-between text-[10px] font-mono text-[#6b7280]">
              <span>By {coverStory.author}</span>
              <span>{coverStory.readTime}</span>
            </div>

            <button
              onClick={() => handleSelectArticle(coverStory)}
              className="btn-black-outline inline-flex gap-2 items-center mt-2 group"
            >
              <span>Read Studio Feature</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Mid layout: Grid of Articles + Right review column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Article Grid */}
          <div className="lg:col-span-8 space-y-10 text-left">
            
            {/* Filter Category Bar */}
            <div style={{ borderBottom: "1px solid #e5e7eb" }} className="flex flex-wrap items-center gap-2 pb-5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { handleInteract(); setActiveCategory(cat) }}
                  style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }}
                  className={`px-4 py-2 border rounded-full font-bold uppercase transition-all ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                      : 'border-gray-300 text-[#6b7280] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  {cat.replace('SUSTAINABILITY DECK', 'LAB LEDGER')}
                </button>
              ))}
            </div>

            {/* Asymmetrical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredArticles.map((art) => (
                <article key={art.id} className="article-card flex flex-col justify-between bg-white shadow-sm">
                  <div className="space-y-4">
                    {/* Image frame */}
                    <div 
                      onClick={() => handleSelectArticle(art)}
                      style={{ border: "1px solid #f0ebe3" }}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 cursor-pointer"
                    >
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        loading="lazy"
                        className="w-full h-full object-cover filter grayscale contrast-[1.03] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-[1.02]"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[8px] font-mono text-[#6b7280] uppercase tracking-wider">
                      <span style={{ color: "#C9A84C" }}>{art.category}</span>
                      <span>{art.date}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleSelectArticle(art)}
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}
                      className="uppercase text-[#1a1a1a] hover:text-[#C9A84C] cursor-pointer transition-colors line-clamp-2"
                    >
                      {art.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#6b7280] leading-relaxed font-light line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  {/* Credits & Read Button */}
                  <div style={{ borderTop: "1px solid #f9f9f9" }} className="pt-4 mt-5 flex items-end justify-between">
                    <div className="text-[8px] font-mono text-gray-400 leading-tight">
                      <div>IMAGE: {art.photography}</div>
                      <div>STYLING: {art.styling}</div>
                    </div>
                    
                    <button
                      onClick={() => handleSelectArticle(art)}
                      className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#C9A84C] flex items-center gap-1 group"
                    >
                      <span>Open Story</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Critics & Editor Picks */}
          <div style={{ borderColor: "#e5e7eb" }} className="lg:col-span-4 space-y-10 border-t lg:border-t-0 lg:border-l pt-10 lg:pt-0 lg:pl-10 text-left">
            
            {/* Acclaim Critique Reviews */}
            <div className="space-y-6">
              <h4 style={{ borderBottom: "2px solid #1a1a1a" }} className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a1a] font-black pb-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-gold" />
                <span>CRITICAL ACCLAIM COUTURE</span>
              </h4>
              
              {/* Review 1 */}
              <div style={{ borderBottom: "1px solid #e5e7eb" }} className="space-y-2 pb-5">
                <div className="flex items-center justify-between">
                  <span style={{ letterSpacing: "0.05em" }} className="font-serif font-bold text-xs text-[#1a1a1a]">LAGOS FASHION WEEK</span>
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
                <blockquote className="text-xs font-serif italic text-[#4b5563] leading-relaxed">
                  "Norex has delivered an impeccable statement of structural integrity. Their evening gowns represent a brilliant fusion of mathematical contour calculations and timeless Nigerian identity."
                </blockquote>
                <p className="text-[9px] font-mono text-[#9ca3af] uppercase">— Runway Report Editor</p>
              </div>

              {/* Review 2 */}
              <div style={{ borderBottom: "1px solid #e5e7eb" }} className="space-y-2 pb-5">
                <div className="flex items-center justify-between">
                  <span style={{ letterSpacing: "0.05em" }} className="font-serif font-bold text-xs text-[#1a1a1a]">THISDAY STYLE</span>
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
                <blockquote className="text-xs font-serif italic text-[#4b5563] leading-relaxed">
                  "The Ankara Fusion sets are structural masterworks. Eradicating cutting layout waste to under 3% inside their Warri academy provides an ideal sustainability template for the ecosystem."
                </blockquote>
                <p className="text-[9px] font-mono text-[#9ca3af] uppercase">— Senior Fashion Correspondent</p>
              </div>
            </div>

            {/* Editor's Picks */}
            <div className="space-y-6">
              <h4 style={{ borderBottom: "2px solid #1a1a1a" }} className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a1a] font-black pb-2 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-gold" />
                <span>STUDIO SELECTIONS S26</span>
              </h4>

              <div className="space-y-3">
                {[
                  { id: '1', name: 'Crimson Evening Gown', price: 185000, image: '/product-1.png' },
                  { id: '2', name: 'Ivory Bridal Ensemble', price: 320000, image: '/product-4.jpg' },
                  { id: '5', name: 'Ankara Fusion Co-ord Set', price: 68000, image: '/product-6-new.jpeg' }
                ].map((pick) => (
                  <div key={pick.id} className="pick-row">
                    <div style={{ border: "1px solid #f0ebe3" }} className="w-14 h-18 overflow-hidden shrink-0 bg-[#FAF7F4]">
                      <img src={pick.image} alt={pick.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h5 style={{ fontSize: "0.68rem", letterSpacing: "0.05em" }} className="font-bold uppercase text-[#1a1a1a] truncate">{pick.name}</h5>
                        <p style={{ fontSize: "0.55rem" }} className="text-[#9ca3af] font-mono mt-0.5">NOREX ATELIER PIECE</p>
                      </div>
                      <div className="flex justify-between items-center">
                        {mounted && <span style={{ color: "#C9A84C" }} className="text-xs font-mono font-bold">{formatPrice(pick.price)}</span>}
                        <Link 
                          href="/shop"
                          onClick={handleInteract}
                          style={{ fontSize: "0.55rem", letterSpacing: "0.05em" }}
                          className="font-mono font-black uppercase text-[#1a1a1a] hover:text-gold text-decoration-none"
                        >
                          SHOP NOW
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Magazine Callout */}
            <div style={{ border: "1px solid #1a1a1a" }} className="p-6 bg-white text-center space-y-4">
              <h5 style={{ letterSpacing: "0.1em" }} className="text-xs font-mono font-black uppercase">THE ATELIER JOURNAL</h5>
              <p className="text-[11px] text-[#6b7280] font-light leading-relaxed">
                Receive physical offset copies of the Norex Gazette directly to your station, complete with seasonal hand-selected material swatch bundles and pattern layout charts.
              </p>
              <Link 
                href="/contact" 
                style={{ letterSpacing: "0.15em", fontSize: "0.65rem" }}
                className="block w-full py-3 bg-[#1a1a1a] text-white hover:bg-[#C9A84C] text-decoration-none transition-all font-mono font-bold uppercase"
              >
                REQUEST REGISTER ACCESS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Out Article Reader Drawer */}
      {selectedArticle && (
        <div className="drawer-overlay" style={{ animation: "fadeIn 0.3s ease out" }}>
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseDrawer} />

          <div style={{ borderLeft: "1px solid #e5e7eb" }} className="relative w-full max-w-2xl bg-[#faf9f6] text-[#1a1a1a] h-full flex flex-col p-6 md:p-10 shadow-2xl z-10 overflow-y-auto">
            
            <div style={{ borderBottom: "1px solid #e5e7eb" }} className="flex items-center justify-between pb-4 mb-6">
              <div className="text-left font-mono">
                <span style={{ color: "#C9A84C", letterSpacing: "0.15em" }} className="text-[9px] font-bold uppercase">{selectedArticle.category}</span>
                <div className="text-[10px] text-[#9ca3af] font-mono mt-0.5">NOREX GAZETTE // JOURNAL CORE</div>
              </div>
              <button
                onClick={handleCloseDrawer}
                style={{ border: "1px solid #e5e7eb" }}
                className="p-2 rounded-full hover:border-[#1a1a1a] hover:bg-gray-100 text-[#1a1a1a] transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <article className="space-y-6 text-left max-w-xl mx-auto">
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 }} className="uppercase text-[#1a1a1a]">
                {selectedArticle.title}
              </h2>
              
              <div style={{ borderY: "1px solid #e5e7eb" }} className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#6b7280] py-2 border-t border-b">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                  <span>By <strong className="text-black font-bold">{selectedArticle.author}</strong></span>
                </div>
                <div>•</div>
                <div>{selectedArticle.date}</div>
                <div>•</div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <div style={{ border: "1px solid #e5e7eb" }} className="aspect-[16/9] w-full overflow-hidden bg-gray-100 my-4 shadow-sm">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 font-serif text-sm leading-relaxed text-[#222]">
                {selectedArticle.content.map((p, idx) => {
                  if (idx === 0) {
                    return (
                      <p 
                        key={idx} 
                        style={{ fontStyle: "normal" }}
                        className="first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:font-black first-letter:text-[#C9A84C] leading-relaxed font-light text-justify"
                      >
                        {p}
                      </p>
                    )
                  }
                  return <p key={idx} className="font-light text-justify">{p}</p>
                })}
              </div>

              <div style={{ borderTop: "2px solid #1a1a1a", borderBottom: "2px solid #1a1a1a" }} className="my-8 py-6 text-center relative max-w-md mx-auto">
                <Quote className="h-8 w-8 text-gold opacity-10 absolute top-2 left-2 pointer-events-none" />
                <blockquote style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem" }} className="italic text-[#1a1a1a] leading-relaxed px-6">
                  "{selectedArticle.pullQuote}"
                </blockquote>
              </div>

              <div style={{ border: "1px solid #f0ebe3" }} className="pt-4 mt-8 space-y-2 text-[10px] font-mono text-[#6b7280] uppercase bg-white/50 p-4 border rounded-sm">
                <div className="flex justify-between">
                  <span>Visual Directors</span>
                  <span className="text-[#1a1a1a] font-bold">{selectedArticle.photography}</span>
                </div>
                <div className="flex justify-between">
                  <span>Styling Layout</span>
                  <span className="text-[#1a1a1a] font-bold">{selectedArticle.styling}</span>
                </div>
                <div className="flex justify-between">
                  <span>Garment Selection</span>
                  <span className="text-[#1a1a1a] font-bold">NOREX Custom catalogs</span>
                </div>
              </div>
            </article>

            <div className="h-12" />
          </div>
        </div>
      )}

      <StyleOracle />
      <Footer />
    </main>
  )
}