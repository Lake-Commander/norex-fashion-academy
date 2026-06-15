'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { BarChart2, Loader2 } from 'lucide-react'

export default function EditorialInsightsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getInsights() {
      try {
        const res = await fetch("/api/editorial");
        const data = await res.json();
        if (data.success) {
          setReports(data.publications.filter((p: any) => p.contentType === "insight"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getInsights();
  }, []);

  // Standard historical fallback metrics density charts data array mappings
  const fallbackChart = [60, 80, 45, 90, 75, 95];
  const activeChartData = reports[0]?.chartData?.length > 0 ? reports[0].chartData.slice(0, 6) : fallbackChart;

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />
      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">METRIC LOGS</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">Insights</h1>
          </header>

          {loading ? (
            <div className="py-12 flex justify-center w-full"><Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reports.map((rep) => (
                <div key={rep._id} className="p-6 border border-gray-300 bg-white shadow-sm hover:border-[#1a1a1a] transition-all space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">{rep.category}</span>
                    <span className="text-lg font-mono font-bold text-[#C9A84C]">{rep.metric}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold uppercase text-[#1a1a1a]">{rep.title}</h3>
                  <p className="text-xs text-[#555] font-light leading-relaxed font-sans">{rep.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Render Graph Bar Chart Component Layer */}
          <div className="border border-gray-300 bg-white p-6 rounded-sm text-left space-y-6">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#C9A84C]" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a]">FIBER DENSITY STABILIZATION RECORD LOGS</h4>
            </div>
            <div className="h-48 flex items-end gap-3 border-b border-gray-300 pb-2">
              {activeChartData.map((val: number, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] transition-all rounded-t" style={{ height: `${Math.min(val, 100)}%` }} />
                  <span className="text-[9px] font-mono text-gray-400 font-bold">INTERVAL-0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <StyleOracle /><Footer />
    </main>
  )
}