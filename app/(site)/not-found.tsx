'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Compass, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between overflow-x-hidden">
      <Header />

      <section className="flex-1 flex flex-col items-center justify-center py-20 text-center relative px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        
        <div className="space-y-6 max-w-md relative z-10">
          <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 text-primary justify-center items-center animate-spin-slow">
            <Compass className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.35em] text-primary uppercase font-black">
              ERROR CODE 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase font-heading tracking-tight leading-none">
              Out of Season
            </h1>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-xs mx-auto">
              The requested design structure or document coordinate has been archived or does not exist in this catalog configuration.
            </p>
          </div>

          <Link
            href="/"
            onClick={handleInteract}
            className="inline-flex px-8 py-3.5 bg-primary text-primary-foreground hover:bg-accent font-bold text-xs uppercase tracking-widest rounded-full transition-all gap-2 items-center mx-auto shadow-lg shadow-primary/10"
          >
            <span>Return to House</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
