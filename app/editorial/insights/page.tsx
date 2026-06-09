'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { TrendingUp, BarChart2, ShieldCheck, Compass } from 'lucide-react'

export default function EditorialInsightsPage() {
  const { soundEnabled } = useShop()

  const reports = [
    {
      title: 'Post-Stretch Fabric Volatility Forecast',
      category: 'FABRIC BIOMECHANICS',
      metric: '+14.2%',
      desc: 'Infrared posture estimators confirm that elastomer-infused gabardine holds structural tension 14% longer under movement intervals than pure wool weave templates.'
    },
    {
      title: 'Zero Waste Layout Puzzle Efficiency',
      category: 'LOGISTICS & SUPPLY',
      metric: '97.2%',
      desc: 'Pattern cutters reached a record 97.2% fabric usage yield, dropping atelier scrap leftovers to just 2.8% globally.'
    }
  ]

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />

      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">
              METRIC LOGS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">
              Insights
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map((rep) => (
              <div key={rep.title} className="p-6 border border-gray-300 bg-white shadow-sm hover:border-[#1a1a1a] transition-all space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{rep.category}</span>
                  <span className="text-lg font-mono font-bold text-primary">{rep.metric}</span>
                </div>
                <h3 className="text-lg font-serif font-bold uppercase text-[#1a1a1a]">{rep.title}</h3>
                <p className="text-xs text-[#555] font-light font-serif leading-relaxed">
                  {rep.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Simulated chart overlay */}
          <div className="border border-gray-300 bg-white p-6 rounded-lg text-left space-y-6">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a]">FIBER DENSITY STABILIZATION LOGS</h4>
            </div>

            <div className="h-48 flex items-end gap-3 border-b border-gray-300 pb-2">
              {[60, 80, 45, 90, 75, 95].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t" style={{ height: `${val}%` }} />
                  <span className="text-[9px] font-mono text-gray-400">W-{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
