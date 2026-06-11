'use client'

import { Sparkles, Landmark, Star, Compass } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function HouseAbout() {
  const { soundEnabled } = useShop()
  const goldColor = "#C9A84C";
  
  const sections = [
    {
      icon: Landmark,
      title: 'Our Heritage',
      subtitle: 'Origins of Balance',
      description: 'Founded in 2016, Norex Fashion was conceived as a precise reaction to transient, fast-paced trends. We establish structural wardrobe blueprints where modern architecture meets high tailoring.'
    },
    {
      icon: Compass,
      title: 'Design Philosophy',
      subtitle: 'Crafted Beyond Trends',
      description: 'We believe a garment must outlive the season. Our design philosophy explores the dialogue between posture, gravity, and premium fabric layers to guarantee design permanence.'
    },
    {
      icon: Star,
      title: 'Couture Assembly',
      subtitle: 'Precision Execution',
      description: 'From fluid silk charmeuse configurations to hand-loomed traditional selections, every step passes manual pattern calibration directly inside our main Nigerian workspace.'
    }
  ]

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <section className="bg-background text-foreground px-6 py-24 md:px-8 border-b border-border/25 relative overflow-hidden">
      <style>{`
        .house-pillar-card {
          border: 1px solid #f0ebe3; background-color: white; padding: 2rem;
          border-radius: 2px; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          text-align: left; display: flex; flex-direction: column; justify-content: space-between;
        }
        .house-pillar-card:hover {
          border-color: #C9A84C; transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.04);
        }
      `}</style>
      
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.02)" }} />

      <div className="mx-auto max-w-7xl">
        
        {/* Title row */}
        <div className="mb-20 text-left">
          <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black font-mono">06 // THE HOUSE</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-black font-heading text-foreground uppercase tracking-tight leading-none">
            The House of Norex
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl font-light">
            Step behind the scenes and review the values, structural stories, and material protocols that fuel our production stations.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <div 
                key={sec.title}
                onMouseEnter={handleInteract}
                className="house-pillar-card"
              >
                <div className="space-y-4">
                  <div style={{ backgroundColor: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.1)" }} className="rounded-sm p-3 text-[#C9A84C] w-fit border">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <span style={{ color: goldColor }} className="text-[8px] font-mono tracking-widest text-primary font-bold uppercase block">{sec.subtitle}</span>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-xl font-bold text-foreground uppercase tracking-wider">{sec.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-light mt-6">
                  {sec.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}