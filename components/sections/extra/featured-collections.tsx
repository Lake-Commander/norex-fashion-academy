'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import Link from 'next/link'

export default function FeaturedCollections() {
  const { soundEnabled } = useShop()
  
  const collections = [
    { 
      name: "Women's Couture & Bridal", 
      tag: '01 // FLUID REGAL WEIGHTS',
      desc: 'Luminous silk evening wear, structured bodices, and intricate lace overlay masterworks calculated for dramatic formal presentation frames.',
      image: '/product-1.png', 
      className: 'lg:mt-0',
      link: '/shop?gender=Female'
    },
    { 
      name: "Men's Bespoke Tailoring", 
      tag: '02 // STRUCTURED HERITAGE STATIONS',
      desc: 'Tailored power blazers, high-density traditional configurations, and clean bespoke casual cuts engineered for an uncompromised posture layout.',
      image: '/product-5.jpeg', 
      className: 'lg:mt-12',
      link: '/shop?gender=Male'
    },
    { 
      name: 'Limited Edition Lab', 
      tag: '03 // EXCLUSIVE ACADEMY CAPSULES',
      desc: 'Numbered pieces handcrafted alongside top academy trainees utilizing premium West African multi-prints and zero-waste pattern layouts.',
      image: '/product-6-new.jpeg', 
      className: 'lg:mt-24',
      link: '/shop?gender=Both'
    },
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const goldColor = "#C9A84C";

  return (
    <div className="bg-background px-6 py-24 md:px-8 border-b border-border/25 relative">
      <style>{`
        .collection-card {
          cursor: pointer; background-color: white; border: 1px solid #f0ebe3;
          padding: 1rem; border-radius: 2px; transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .collection-card:hover {
          border-color: #C9A84C; box-shadow: 0 15px 35px rgba(201,168,76,0.06);
          transform: translateY(-4px);
        }
      `}</style>
      
      <div className="mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-20 text-center">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">04 / THE SEASONS</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight leading-none">
            Featured Collections
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto font-light">
            Explore our architectural capsule blueprints, each engineered to fulfill elite West African design and contemporary posture expectations.
          </p>
        </div>

        {/* Asymmetric Offset grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {collections.map((collection) => (
            <Link 
              href={collection.link}
              key={collection.name} 
              onMouseEnter={handleInteract}
              onClick={() => { if (soundEnabled) sounds.playClick() }}
              className={`collection-card ${collection.className}`}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 bg-[#FAF7F4] border border-gray-100">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-full object-cover filter contrast-[1.01]"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                
                {/* Floating Meta tags inside card */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 text-left">
                  <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest font-bold block">{collection.tag}</span>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-2xl font-bold tracking-tight uppercase leading-none text-white">{collection.name}</h3>
                </div>
              </div>

              {/* Outside Card Description */}
              <div className="space-y-4 px-1 pb-1 text-left">
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {collection.desc}
                </p>

                <div style={{ color: goldColor }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:text-[#1a1a1a] transition-colors pt-2">
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}