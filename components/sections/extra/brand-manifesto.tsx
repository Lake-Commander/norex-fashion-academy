'use client'

import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandManifesto() {
  const goldColor = "#C9A84C";

  return (
    <section className="bg-black text-white px-6 py-28 md:py-36 md:px-8 border-b border-white/10 relative overflow-hidden flex items-center justify-center">
      {/* Editorial Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" 
        style={{ backgroundColor: "rgba(201, 168, 76, 0.03)" }}
      />
      
      <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
        <span style={{ color: goldColor, letterSpacing: "0.35em" }} className="text-[9px] font-mono uppercase font-black block">
          NOREX ATELIER MANIFESTO // SERIES 01
        </span>
        
        <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", lineHeight: 1.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase text-white"
          >
            Fashion is an unspoken dialogue between geometry, architecture, and identity.
          </motion.h2>
          
          <div className="w-16 h-[1px] mx-auto" style={{ backgroundColor: "rgba(201, 168, 76, 0.3)" }} />
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl font-light font-serif italic tracking-wide text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Crafted to endure, engineered to express.
          </motion.p>
        </div>

        <div style={{ letterSpacing: "0.25em" }} className="text-[8px] font-mono text-white/30 uppercase pt-4">
          NOREX FASHION HOUSE • WARRI • LAGOS • ATELIER ACADEMY STATIONS
        </div>
      </div>
    </section>
  )
}