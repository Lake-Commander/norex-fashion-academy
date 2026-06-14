'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Loader2, ImageIcon } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  isFeatured: boolean;
}

export default function FeaturedProducts() {
  const { soundEnabled } = useShop()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Stagger offsets array to maintain your high-fashion asymmetrical layout grid
  const styleOffsets = ['lg:mt-0', 'lg:mt-12', 'lg:mt-24']

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/admin/products')
        const data = await res.json()
        
        if (data.success && data.products) {
          // Filter out items toggled as featured on the admin table, limit to top 3 for the grid layout
          const featuredItems = data.products.filter((p: ProductItem) => p.isFeatured).slice(0, 3)
          setProducts(featuredItems)
        }
      } catch (err) {
        console.error('Failed fetching dynamic featured products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <div className="bg-background px-6 py-24 md:px-8 border-b border-border/25 relative">
      <style>{`
        .product-feature-card {
          cursor: pointer; background-color: white; border: 1px solid #f0ebe3;
          padding: 1rem; border-radius: 2px; transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          text-decoration: none; display: block;
        }
        .product-feature-card:hover {
          border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.06);
          transform: translateY(-4px);
        }
        .product-feature-card:hover .feature-img {
          transform: scale(1.02);
        }
        .feature-img {
          transition: transform 0.8s ease;
        }
      `}</style>
      
      <div className="mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-20 text-center">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">04 / ATELIER SHOWCASE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight leading-none">
            Featured Masterpieces
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto font-light">
            Explore our curated studio silhouettes, dynamically updated from the showroom floor and tailored for uncompromised presence.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Streaming Active Grid...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono uppercase tracking-wider">
            No active garments currently toggled for the homepage showcase.
          </div>
        ) : (
          /* Asymmetric Offset grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {products.map((product, idx) => {
              const offsetClass = styleOffsets[idx % styleOffsets.length]
              
              return (
                <Link 
                  href={`/shop/${product.slug}`}
                  key={product._id} 
                  onMouseEnter={handleInteract}
                  onClick={() => { if (soundEnabled) sounds.playClick() }}
                  className={`product-feature-card ${offsetClass}`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 bg-[#FAF7F4] border border-gray-100">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover feature-img filter contrast-[1.01]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    
                    {/* Floating Meta tags inside card */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 text-left">
                      <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold block uppercase">{product.category}</span>
                      <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold tracking-tight uppercase leading-none text-white">{product.name}</h3>
                    </div>
                  </div>

                  {/* Outside Card Details */}
                  <div className="space-y-4 px-1 pb-1 text-left">
                    <p className="text-xs text-muted-foreground leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                      <span style={{ color: goldColor }} className="text-sm font-bold font-mono">
                        {formatPrice(product.price)}
                      </span>
                      <div style={{ color: goldColor }} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <span>Acquire</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}