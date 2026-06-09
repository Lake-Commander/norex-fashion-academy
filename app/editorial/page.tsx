'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { 
  ChevronRight, 
  X, 
  BookOpen, 
  Star, 
  Award, 
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
    title: 'THE KINETIC REVOLUTION: HOW GEOMETRY REDEFINED STRETCH',
    image: '/runway/hero-banner-2.avif',
    summary: 'A comprehensive investigation into structural drapery, deconstructed waistlines, and how garments adapt to natural physical motion.',
    author: 'Elena Rostova',
    date: 'June 07, 2026',
    readTime: '6 min read',
    photography: 'Tyler Mitchell',
    styling: 'Gabriella Karefa-Johnson',
    pullQuote: "We wanted to escape static shapes. In 2026, fashion lives in movement. Silhouettes must flow, stretch, and compress like living tissue.",
    content: [
      "In the history of tailoring, structure has often been synonym with rigidity. From the stiff corsetry of the 19th century to the padded shoulders of the late 20th century, standard garments forced the human body to conform to static forms. The design offices of ORLIEN sought to break this constraint.",
      "By analyzing biological motion curves using infrared sensors and muscle acceleration paths, our design lab mapped fabric weight distributions at the shoulder and hip joints. The result is clothing that responds to posture changes. Standard wool coats are split into layered canvas grids, allowing fluid swing during running or walking.",
      "The choice of fabrics was crucial. By combining high-twist wool gabardines with technical elastomer fibers, the garments hold their geometric lines while offering structural stretch. It is a new language of comfort—one that does not compromise on visual sharp shapes."
    ]
  },
  {
    id: '2',
    category: 'Sustainable Living',
    title: 'AEGEAN GOLD: SOURCING THE PUREST GOTS COTTON',
    image: '/runway/look-07.avif',
    summary: 'Tracing long-staple cotton yarn from the organic fields of Turkey directly to the digital looms of our concrete atelier.',
    author: 'Sarah Jenkins',
    date: 'May 28, 2026',
    readTime: '4 min read',
    photography: 'Ethan James Green',
    styling: 'Tonne Goodman',
    pullQuote: "True luxury begins in the soil. Without pristine organic fiber structures, no amount of modern tailoring can make a garment last.",
    content: [
      "Deep in the Aegean region of Turkey, organic cotton farming has evolved from a traditional technique into a precise ecological science. Here, cotton is grown with zero synthetic fertilizers, relying on local natural irrigation and biological pest controls.",
      "This Aegean cotton is prized for its extra-long-staple fibers. When spun, these long fibers create a yarn that is incredibly smooth, strong, and resistant to pilling. It is this specific yarn that forms the foundation of our Fine Knit T-Shirts and shirt templates.",
      "By establishing direct contracts with local farming collectives, we guarantee full transparency and fair wage margins. Every kilogram of fiber can be traced back to its specific field, ensuring a clean supply line that benefits both the farmers and the final wearer."
    ]
  },
  {
    id: '3',
    category: 'Sustainability Deck',
    title: 'THE 2.8% CHALLENGE: ELIMINATING ATELIER PRINT SCRAPS',
    image: '/runway/bts-06.avif',
    summary: 'How our engineering team redesigned cutting grids to reduce residual fabric waste to a fraction of the industry average.',
    author: 'Marcus Aurelius',
    date: 'May 15, 2026',
    readTime: '5 min read',
    photography: 'Johnny Dufort',
    styling: 'Ib Kamara',
    pullQuote: "Waste is a design failure. An optimized layout grid fits garment parts together like puzzles, leaving nothing behind.",
    content: [
      "In standard industrial garment production, up to 25% of fabric is discarded during the cutting phase. These residual scraps are typically swept away and sent to landfills. For a luxury fashion house, this waste is unacceptable.",
      "Our software engineers collaborated with pattern makers to create a compression algorithm. The system layouts garment pieces in organic puzzle clusters, minimizing margins between items. Through this system, we reduced fabric scrap waste to 2.8%.",
      "The remaining scraps are not discarded. We collect all cotton and wool residuals, shredding them back to raw fibers. These fibers are then re-spun into insulated quilting blocks to serve as warming layers in our tech windbreakers and bombers."
    ]
  },
  {
    id: '4',
    category: 'Culture & Heritage',
    title: 'BRUTALIST CONCRETE ROOTS: THE SPACE OF CREATION',
    image: '/runway/bts-01.avif',
    summary: 'Exploring the raw architectural design that inspired the clean, sharp lines of our initial canvas collections.',
    author: 'Jean-Pierre Laurent',
    date: 'April 30, 2026',
    readTime: '8 min read',
    photography: 'David Sims',
    styling: 'Alastair McKimm',
    pullQuote: "There is an honest beauty in raw concrete. It does not hide its texture under paint, just as our garments show their structural seams.",
    content: [
      "The concrete warehouse that houses the ORLIEN design lab was built in 1974. With its heavy pillars, raw formwork textures, and massive skylights, it stands as a monument to Brutalist architecture. This concrete space directly shaped our brand philosophy.",
      "Brutalist architecture values raw material honesty. It reveals the grain of the wood molds and the structural weight of the support beams. In the same way, our outerwear highlights its construction. Seam bindings are bound in contrasting colors, and zipper rails are left exposed.",
      "Creating in this space keeps us focused on essentials. We avoid superficial decorations, focusing instead on volume, drape, and structural lines. The concrete environment serves as a constant reminder that form must hold weight and function."
    ]
  },
  {
    id: '5',
    category: 'Couture & Atelier',
    title: 'THE OUTERWEAR MANIFESTO: DECONSTRUCTING THE CYBER BOMBER',
    image: '/runway/look-03.avif',
    summary: 'How GRS Certified ocean plastics were transformed into a weather-proof shell tailored for kinetic acceleration.',
    author: 'David K.',
    date: 'April 12, 2026',
    readTime: '5 min read',
    photography: 'Craig McDean',
    styling: 'Mel Ottenberg',
    pullQuote: "Technical performance should not feel synthetic. We engineered a shell that blocks wind but breathes with organic ease.",
    content: [
      "The Cyber Bomber Jacket was conceived as an adaptable shield. Its outer shell is woven from 100% Global Recycled Standard (GRS) nylon, reclaimed from ocean plastics and fishing nets. The weave is dense enough to block heavy wind.",
      "To avoid hazardous chemical coatings, we achieved waterproofing by compressing the nylon fibers under high heat. This creates a dense barrier that repels water droplets while allowing micro-vapor to escape, keeping the wearer dry from the inside.",
      "Asymmetric drawcords adjust the volume at the hem and sleeves, letting the wearer transform the shape from a relaxed drop-shoulder drape to a cropped shell. It is utility tailored for modern acceleration."
    ]
  },
  {
    id: '6',
    category: 'Culture & Heritage',
    title: 'SARTORIAL ANACHRONISM: BRIDGING TAILORING GENERATIONS',
    image: '/runway/look-01.avif',
    summary: 'A dialogue between old-world bespoke fittings and next-generation style customization software.',
    author: 'Sarah Jenkins',
    date: 'March 29, 2026',
    readTime: '7 min read',
    photography: 'Steven Meisel',
    styling: 'Carine Roitfeld',
    pullQuote: "We are not replacing the tailor. We are giving the tailor a digital canvas that stretches across borders.",
    content: [
      "In a traditional bespoke shop, a master tailor spends hours measuring the client's posture, shoulders, and chest curves. This human touch is the pinnacle of luxury. But how do we scale this level of fit in a digital era?",
      "Our answer is the AI Styling Oracle. By analyzing client measurements using advanced body contour estimators, we calculate custom drape formulas. These metrics are sent directly to automated cutting machines, creating bespoke garments without paper patterns.",
      "This digital integration does not replace human skill. Every custom suit is finished by hand by our atelier artisans, ensuring that traditional lapel padding, hem stitching, and sleeve settings are executed to standard guidelines."
    ]
  }
]

export default function EditorialPage() {
  const { soundEnabled } = useShop()
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

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

  const categories = ['ALL', 'COUTURE & ATELIER', 'SUSTAINABILITY DECK', 'SUSTAINABLE LIVING', 'CULTURE & HERITAGE']

  const filteredArticles = activeCategory === 'ALL'
    ? magazineArticles
    : magazineArticles.filter(art => art.category.toUpperCase() === activeCategory)

  const coverStory = magazineArticles[0]

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />

      {/* Vogue-Style Editorial Content Container */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-12 md:px-8">
        
        {/* Magazine Header Masthead */}
        <header className="border-b-2 border-[#1a1a1a] pb-8 mb-12 text-center space-y-4">
          <div className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase flex justify-between items-center border-b border-gray-300 pb-2">
            <span>ISSUE NO. 04 // SUMMER 2026</span>
            <span className="hidden md:inline">PUBLISHED IN COOPERATIVE ATELIER</span>
            <span>EST. NEW YORK</span>
          </div>
          
          {/* Masthead Title */}
          <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter uppercase text-[#1a1a1a] select-none leading-none pt-2">
            ORLIEN Gazette
          </h1>
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#555] uppercase pt-2">
            THE CHRONICLES OF GEOMETRIC TAILORING & SUSTAINABLE CRAFT
          </p>
        </header>

        {/* Big Cover Feature (Split panel) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-gray-300 pb-12 mb-12 items-center">
          
          {/* Cover Image */}
          <div 
            onClick={() => handleSelectArticle(coverStory)}
            className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden bg-gray-200 border border-gray-300 cursor-pointer group relative shadow-md"
          >
            <img 
              src={coverStory.image} 
              alt={coverStory.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1000ms] scale-100 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-[#faf9f6]/5 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute bottom-4 left-4 bg-black/75 px-3 py-1 text-[8px] text-white font-mono uppercase tracking-widest rounded">
              FEATURED COVER STORY
            </div>
          </div>

          {/* Cover Text Info */}
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#777] font-bold border-b border-primary/20 pb-0.5">
              {coverStory.category}
            </span>
            <h2 
              onClick={() => handleSelectArticle(coverStory)}
              className="text-3xl md:text-5xl font-serif font-black uppercase text-[#1a1a1a] leading-tight hover:text-[#555] cursor-pointer transition-colors"
            >
              {coverStory.title}
            </h2>
            <p className="text-sm text-[#333] font-serif italic leading-relaxed">
              "{coverStory.summary}"
            </p>
            
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#555]">
              <span>By {coverStory.author}</span>
              <span>{coverStory.readTime}</span>
            </div>

            <button
              onClick={() => handleSelectArticle(coverStory)}
              className="inline-flex px-6 py-3 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all text-xs font-bold uppercase tracking-widest gap-2 items-center mt-2 group"
            >
              <span>Read Feature Story</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Mid layout: Grid of Articles + Right review column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Article Grid (8 columns) */}
          <div className="lg:col-span-8 space-y-12 text-left">
            
            {/* Filter Category Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-300 pb-5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { handleInteract(); setActiveCategory(cat) }}
                  className={`px-4 py-2 border rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                      : 'border-gray-300 text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {cat.replace('SUSTAINABILITY DECK', 'LEDGER')}
                </button>
              ))}
            </div>

            {/* Asymmetrical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {filteredArticles.map((art) => (
                <article 
                  key={art.id} 
                  className="group flex flex-col justify-between border border-gray-300 bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#1a1a1a] transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Image frame */}
                    <div 
                      onClick={() => handleSelectArticle(art)}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 cursor-pointer border border-gray-200"
                    >
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        loading="lazy"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[8px] font-mono text-[#777] uppercase tracking-wider">
                      <span>{art.category}</span>
                      <span>{art.date}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleSelectArticle(art)}
                      className="text-lg md:text-xl font-serif font-black uppercase text-[#1a1a1a] leading-snug hover:text-[#555] cursor-pointer transition-colors"
                    >
                      {art.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#555] leading-relaxed font-light font-serif line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  {/* Credits & Read Button */}
                  <div className="pt-6 border-t border-gray-100 mt-6 flex items-end justify-between">
                    <div className="text-[8px] font-mono text-gray-400">
                      <div>PHOTO: {art.photography}</div>
                      <div>STYLE: {art.styling}</div>
                    </div>
                    
                    <button
                      onClick={() => handleSelectArticle(art)}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#555] flex items-center gap-1 group"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

          </div>

          {/* Right: Review Critique Column & Editor's Picks (4 columns) */}
          <div className="lg:col-span-4 space-y-10 border-t lg:border-t-0 lg:border-l border-gray-300 pt-10 lg:pt-0 lg:pl-10 text-left">
            
            {/* Vogue & GQ Critical Reviews */}
            <div className="space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a1a] font-black border-b-2 border-[#1a1a1a] pb-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>CRITICAL REVIEW ACCLAIM</span>
              </h4>
              
              {/* Review 1 */}
              <div className="space-y-2 pb-6 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm tracking-wider text-[#1a1a1a]">VOGUE RUNWAY</span>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-xs font-serif italic text-[#333] leading-relaxed">
                  "ORLIEN has delivered the most structurally honest collection of 2026. The deconstructed coats represent a triumph of biomechanics over traditional fabric stiffness."
                </blockquote>
                <p className="text-[9px] font-mono text-[#777] uppercase">— Fashion Critic Editor</p>
              </div>

              {/* Review 2 */}
              <div className="space-y-2 pb-6 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm tracking-wider text-[#1a1a1a]">GQ MAGAZINE</span>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-xs font-serif italic text-[#333] leading-relaxed">
                  "The Cyber Bomber is a masterpiece of technical utility. Reducing waste to under 3% while producing organic jackets represents a template for the industry's future."
                </blockquote>
                <p className="text-[9px] font-mono text-[#777] uppercase">— Senior Style Director</p>
              </div>
            </div>

            {/* Editor's Picks */}
            <div className="space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a1a] font-black border-b-2 border-[#1a1a1a] pb-2 flex items-center gap-1.5">
                <Compass className="h-4 w-4" />
                <span>EDITOR'S PICKS S26</span>
              </h4>

              <div className="space-y-4">
                {[
                  { id: '1', name: 'Sartorial Trench Coat', price: '$290', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&h=160&fit=crop' },
                  { id: '2', name: 'Cyber Bomber Jacket', price: '$180', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=120&h=160&fit=crop' },
                  { id: '3', name: 'Pleated Linen Trouser', price: '$110', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=120&h=160&fit=crop' }
                ].map((pick) => (
                  <div key={pick.id} className="flex gap-4 p-3 bg-white border border-gray-200 hover:border-[#1a1a1a] transition-all">
                    <div className="w-14 h-18 bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <img src={pick.image} alt={pick.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h5 className="text-[11px] font-bold uppercase text-[#1a1a1a] tracking-wider truncate">{pick.name}</h5>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">ORLIEN ATELIER BLOCK</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-primary">{pick.price}</span>
                        <Link 
                          href="/shop"
                          onClick={handleInteract}
                          className="text-[9px] font-mono font-black uppercase text-[#1a1a1a] hover:underline"
                        >
                          SHOP CATALOG
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Magazine Callout */}
            <div className="p-6 border-2 border-dashed border-[#1a1a1a] bg-white text-center space-y-4">
              <h5 className="text-xs font-mono font-black uppercase tracking-wider">GET THE PRINT GAZETTE</h5>
              <p className="text-[11px] text-[#555] font-light font-serif leading-relaxed">
                Receive physical offset copies of the ORLIEN Gazette directly to your doorstep. Complete with seasonal swatch cards.
              </p>
              <Link 
                href="/" 
                className="block w-full py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-all text-[9px] font-mono font-bold uppercase tracking-widest"
              >
                REQUEST REGISTER ACCESS
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Slide-Out Article Reader Drawer (Vogue Layout) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          {/* Transparent click area to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseDrawer} />

          {/* Paper Editorial Drawer */}
          <div className="relative w-full max-w-2xl bg-[#faf9f6] text-[#1a1a1a] border-l border-gray-300 h-full flex flex-col p-6 md:p-10 shadow-2xl z-10 animate-slide-in-right overflow-y-auto">
            
            {/* Close trigger row */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-300 mb-8">
              <div className="text-left font-mono">
                <span className="text-[9px] text-[#777] font-bold tracking-[0.2em] uppercase">{selectedArticle.category}</span>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">ORLIEN GAZETTE // JOURNAL FEED</div>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-2 border border-gray-300 rounded-full hover:border-[#1a1a1a] hover:bg-gray-100 text-[#1a1a1a] transition-all active:scale-95"
                title="Close Article"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Article Content Layout */}
            <article className="space-y-6 text-left max-w-xl mx-auto">
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-serif font-black uppercase text-[#1a1a1a] tracking-wide leading-tight">
                {selectedArticle.title}
              </h2>
              
              {/* Writer and Credits info */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#555] border-y border-gray-200 py-3">
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

              {/* Large Image illustration inside article */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 border border-gray-300 my-6 shadow-sm">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              {/* Long text content with Drop Cap */}
              <div className="space-y-4 font-serif text-sm leading-relaxed text-[#222]">
                {selectedArticle.content.map((p, idx) => {
                  if (idx === 0) {
                    // Apply Drop Cap on first letter of first paragraph
                    return (
                      <p 
                        key={idx} 
                        className="first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:font-black first-letter:text-primary leading-relaxed font-light"
                      >
                        {p}
                      </p>
                    )
                  }
                  return (
                    <p key={idx} className="font-light">
                      {p}
                    </p>
                  )
                })}
              </div>

              {/* Big Centered Pull Quote */}
              <div className="my-8 border-y-2 border-[#1a1a1a] py-6 text-center relative max-w-md mx-auto">
                <Quote className="h-8 w-8 text-primary/10 absolute top-2 left-2 pointer-events-none" />
                <blockquote className="text-base font-serif italic text-[#1a1a1a] leading-relaxed px-6">
                  "{selectedArticle.pullQuote}"
                </blockquote>
              </div>

              {/* Production and Creative Credits */}
              <div className="border-t border-gray-300 pt-6 mt-10 space-y-2 text-[10px] font-mono text-[#777] uppercase bg-white/40 p-4 border rounded">
                <div className="flex justify-between">
                  <span>Photography Directors</span>
                  <span className="text-[#1a1a1a] font-bold">{selectedArticle.photography}</span>
                </div>
                <div className="flex justify-between">
                  <span>Styling & Visuals</span>
                  <span className="text-[#1a1a1a] font-bold">{selectedArticle.styling}</span>
                </div>
                <div className="flex justify-between">
                  <span>Garment Selection</span>
                  <span className="text-[#1a1a1a] font-bold">ORLIEN Atelier blocks</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Sourcing</span>
                  <span className="text-[#1a1a1a] font-bold">GOTS & GRS registries</span>
                </div>
              </div>

            </article>

            {/* Bottom spacer */}
            <div className="h-12" />

          </div>
        </div>
      )}

      <StyleOracle />
      <Footer />
    </main>
  )
}
