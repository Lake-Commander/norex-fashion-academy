'use client'

import { useState } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { formatPrice } from '@/lib/utils'
import { Sparkles, ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

// Define a type for the local items extending your core Product type
interface NewArrivalProduct {
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
  featured: boolean;
  inStock: boolean;
  designerNote: string
  tags: string[]
}

export default function NewArrivalsPage() {
  const { soundEnabled, addToCart, toggleWishlist, isInWishlist } = useShop()

  const newItems: NewArrivalProduct[] = [
    {
      id: 'new-5',
      slug: 'deconstructed-twill-trench',
      name: 'Deconstructed Twill Trench',
      price: 290000,
      category: 'Evening Wear',
      gender: 'Female',
      description: 'Experimenting with organic wool canvas layers. The double-belt system pulls from military utility, offset by raw cuffs.',
      images: ['/runway/look-01.avif'],
      sizes: ['M'],
      colors: ['Default Color'],
      featured: true,
      inStock: true,
      designerNote: 'Experimenting with organic wool canvas layers. The double-belt system pulls from military utility, offset by raw cuffs.',
      tags: ['New Release', 'Atelier Block']
    },
    {
      id: 'new-6',
      slug: 'brutalist-leather-aviator',
      name: 'Brutalist Leather Aviator',
      price: 220000,
      category: 'Work Wear',
      gender: 'Both',
      description: 'Built from heavy cowhide treated with natural resins. The rib waist drapes dynamically with posture adjustments.',
      images: ['/runway/look-03.avif'],
      sizes: ['M'],
      colors: ['Default Color'],
      featured: true,
      inStock: true,
      designerNote: 'Built from heavy cowhide treated with natural resins. The rib waist drapes dynamically with posture adjustments.',
      tags: ['Trending', 'Leather Core']
    },
    {
      id: 'new-2',
      slug: 'liquid-silk-shift-dress',
      name: 'Liquid Silk Shift Dress',
      price: 145000,
      category: 'Casual Wear',
      gender: 'Female',
      description: 'Bias panels flow beautifully in natural motion states. Designed in collaboration with Mitchell.',
      images: ['/runway/look-04.avif'],
      sizes: ['M'],
      colors: ['Default Color'],
      featured: true,
      inStock: true,
      designerNote: 'Bias panels flow beautifully in natural motion states. Designed in collaboration with Mitchell.',
      tags: ['Couture', 'Pure Silk']
    }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const handleAddProduct = (item: NewArrivalProduct) => {
    // Passes the structurally sound object directly to context
    addToCart(item, 1)
    if (soundEnabled) sounds.playSuccess()
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="relative w-full py-16 md:py-24 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-left space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono text-[9px] uppercase tracking-widest font-black animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>LATEST EXPRESSIONS OF ORLIEN</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none text-foreground">
              New Arrivals
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-relaxed">
              Freshly cut silhouettes freshly tailored from our New York design table.
            </p>
          </div>

          {/* Large Editorial Product Showcase */}
          <div className="space-y-16">
            {newItems.map((item, idx) => {
              // Fixed: Uses the strict context method to find current item wishlist state safely
              const isWished = isInWishlist(item.id)
              return (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b border-border/20 pb-12 last:border-b-0 ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Visual block */}
                  <div className={`lg:col-span-7 relative group aspect-[4/3] rounded-3xl overflow-hidden bg-secondary border border-border/30 ${
                    idx % 2 === 1 ? 'lg:order-2' : ''
                  }`}>
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1000ms]" />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-primary transition-all active:scale-90 z-10"
                      title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-primary text-primary scale-110' : ''}`} />
                    </button>
                  </div>

                  {/* Specs & notes block */}
                  <div className="lg:col-span-5 text-left space-y-6">
                    <div className="flex gap-2">
                      {item.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 border border-primary/20 bg-primary/5 text-primary text-[8px] font-mono uppercase rounded font-bold tracking-wider">{t}</span>
                      ))}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground leading-none">
                      {item.name}
                    </h2>
                    
                    <div className="text-xl font-black text-primary font-mono">{formatPrice(item.price)}</div>
                    
                    <div className="p-5 bg-secondary/35 border border-border/40 rounded-2xl space-y-2">
                      <span className="text-[9px] font-mono text-primary font-black uppercase tracking-wider">DESIGNER NOTES</span>
                      <p className="text-xs font-serif leading-relaxed italic text-muted-foreground">
                        "{item.designerNote}"
                      </p>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => handleAddProduct(item)}
                        className="flex-1 py-3.5 bg-primary text-primary-foreground hover:bg-accent text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
                      >
                        <ShoppingBag className="h-4.5 w-4.5" />
                        <span>Reserve Piece</span>
                      </button>

                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={handleInteract}
                        className="px-6 py-3.5 border border-border hover:border-foreground text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Related Collections Grid */}
          <div className="border-t border-border/40 pt-12 text-left space-y-6">
            <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Related Collections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/collections/spring-summer" 
                onClick={handleInteract}
                className="group p-6 border border-border hover:border-foreground/30 rounded-2xl bg-card/25 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[8px] font-mono text-primary font-black uppercase tracking-widest">SEASONAL LAUNCH</span>
                  <h4 className="text-sm font-bold uppercase tracking-wide mt-1">Spring / Summer Collection</h4>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
              <Link 
                href="/collections/limited-edition" 
                onClick={handleInteract}
                className="group p-6 border border-border hover:border-foreground/30 rounded-2xl bg-card/25 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[8px] font-mono text-primary font-black uppercase tracking-widest">EXCLUSIVE CAPSULE</span>
                  <h4 className="text-sm font-bold uppercase tracking-wide mt-1">Limited Edition Lab</h4>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}