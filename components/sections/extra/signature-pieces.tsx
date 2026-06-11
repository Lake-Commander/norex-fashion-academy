'use client'

import { Sparkles, ArrowRight, Heart } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface SignatureProduct {
  id: string
  slug: string
  name: string
  price: number
  category: string
  gender: 'Female' | 'Male' | 'Both'
  description: string
  images: string[]
  sizes: string[]
  colors: string[]
  featured: boolean
  inStock: boolean
  story: string
  material: string
  inspiration: string
  swatch: string
}

export default function SignaturePieces() {
  const { soundEnabled, addToCart, toggleWishlist, isInWishlist } = useShop()

  // Mapped directly from your real database tokens
  const signatureItems: SignatureProduct[] = [
    {
      id: "1",
      slug: "crimson-evening-gown",
      name: "Crimson Evening Gown",
      price: 185000,
      category: "Evening Wear",
      gender: "Female",
      description: "A breathtaking floor-length gown crafted from premium silk charmeuse.",
      images: ["/product-1.png"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Crimson", "Midnight Black", "Ivory"],
      featured: true,
      inStock: true,
      story: "An exploration into fluid silk architecture and majestic drapery contours. Crafted carefully with a dramatic lower cut backline, hand-applied bodice beadwork arrays, and a grand structural train that moves organically with step pacing.",
      material: "100% Premium Silk Charmeuse layers. Delicate micro-glass accents hand-secured directly within our Warri design hall.",
      inspiration: "Traditional royal Nigerian dress postures reimagined through clean, mid-century geometric open-back design formulas.",
      swatch: "Crimson Red / Midnight Black / Pearl Ivory"
    },
    {
      id: "5",
      slug: "ankara-fusion-co-ord",
      name: "Ankara Fusion Co-ord Set",
      price: 68000,
      category: "Casual Wear",
      gender: "Both",
      description: "A stunning two-piece co-ord set fusing vibrant Ankara print with contemporary tailoring.",
      images: ["/product-6-new.jpeg"],
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: ["Multi-print"],
      featured: true,
      inStock: true,
      story: "A modern structural two-piece statement set unifying vibrant African wax prints with disciplined, technical tailoring. Composing an architectural cropped jacket outline side-by-side with fluid wide-leg trouser drops.",
      material: "100% High-Density Premium Wax Cotton choices reinforced with breathable soft structural interlining matrices.",
      inspiration: "Asymmetrical urban tailoring lines balanced against complex traditional heritage textile layout grids.",
      swatch: "Multi-print Geometric Fusion"
    }
  ]

  const handleInstantBuy = (item: SignatureProduct) => {
    // Passes structural object matching context constraints
    addToCart(item, 1)
    if (soundEnabled) sounds.playSuccess()
  }

  const goldColor = "#C9A84C";

  return (
    <section className="bg-[#050505] px-6 py-24 md:px-8 border-b border-white/10 relative overflow-hidden">
      <style>{`
        .sig-img-container {
          position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); 
          background-color: #FAF7F4; aspect-ratio: 4/5; border-radius: 2px;
        }
        .sig-img {
          width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;
        }
        .sig-img-container:hover .sig-img {
          transform: scale(1.02);
        }

        .btn-sig-gold {
          background-color: #C9A84C; color: white; padding: 1rem 2rem; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none;
          transition: all 0.3s ease; border-radius: 2px; cursor: pointer;
        }
        .btn-sig-gold:hover {
          background-color: #B49542; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(201,168,76,0.3);
        }

        .btn-sig-outline {
          padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.1); background: none;
          color: white; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; transition: all 0.3s ease; border-radius: 2px; text-decoration: none; display: inline-block;
        }
        .btn-sig-outline:hover {
          border-color: #C9A84C; background-color: rgba(255,255,255,0.03); color: #C9A84C;
        }
      `}</style>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] blur-[150px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201, 168, 76, 0.02)" }} />

      <div className="mx-auto max-w-7xl">
        
        {/* Title Block */}
        <div className="mb-24 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">05 // THE SIGNATURES</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
            Signature Pieces
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl font-light">
            A meticulous showcase of our defining studio silhouettes. Inspect the structural narratives, raw composition metrics, and blueprints backing each layout.
          </p>
        </div>

        {/* Alternate Showcase Layout */}
        <div className="space-y-32">
          {signatureItems.map((item, index) => {
            const isLeft = index % 2 === 0
            const isWished = isInWishlist(item.id)

            return (
              <div 
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                
                {/* Image Block */}
                <div className={`lg:col-span-6 ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="sig-img-container">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="sig-img"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    
                    {/* Floating Wishlist Toggle */}
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-6 right-6 p-3 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#C9A84C] transition-all active:scale-90 z-20 cursor-pointer"
                      title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className="h-4.5 w-4.5" fill={isWished ? goldColor : "transparent"} color={isWished ? goldColor : "white"} />
                    </button>
                    
                    <div style={{ borderColor: "rgba(255,255,255,0.05)" }} className="absolute bottom-6 left-6 text-white text-[10px] font-mono tracking-widest bg-black/60 px-3 py-1 rounded-sm border uppercase">
                      Ref // Look {String(item.id).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Info Text Block */}
                <div className={`lg:col-span-6 text-left space-y-6 md:space-y-8 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-2">
                    <span style={{ color: goldColor, letterSpacing: "0.15em" }} className="text-[10px] font-mono font-bold uppercase block">
                      ATELIER MASTERPIECE CONFIGURATION
                    </span>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none">
                      {item.name}
                    </h3>
                    <p style={{ color: goldColor }} className="text-xl font-bold font-mono">{formatPrice(item.price)}</p>
                  </div>

                  {/* Story Section */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">The Design Narrative</h4>
                    <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed font-serif italic text-justify">
                      "{item.story}"
                    </p>
                  </div>

                  {/* Material Section */}
                  <div style={{ borderLeftColor: goldColor }} className="space-y-2 border-l-2 pl-4 py-0.5">
                    <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">Textile Provenance</h4>
                    <p className="text-xs text-gray-400 font-light font-mono leading-relaxed">
                      {item.material}
                    </p>
                  </div>

                  {/* Inspiration Section */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold">Structural Blueprint Core</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed max-w-lg">
                      {item.inspiration}
                    </p>
                  </div>

                  {/* Buy Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4">
                    <button
                      onClick={() => handleInstantBuy(item)}
                      className="btn-sig-gold"
                    >
                      Acquire Piece
                    </button>
                    
                    <Link
                      href={`/shop/${item.slug}`}
                      className="btn-sig-outline"
                    >
                      Specifications Detail
                    </Link>
                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}