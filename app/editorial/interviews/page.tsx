'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { Quote, MessageSquare } from 'lucide-react'

export default function EditorialInterviewsPage() {
  const { soundEnabled } = useShop()

  const interviews = [
    {
      title: 'Structural Tension: A Talk with the Studio Design Office',
      cast: 'ORLIEN Design Office',
      q: 'What inspired the biological motion wraps in Solstice?',
      a: 'We observed raw concrete buildings and how sunlight splits across their geometry. We wanted to replicate that contrast in fabrics, letting weighted bias silk slip against tailored wool flaps.'
    },
    {
      title: 'Crafting Precision: Q&A with Master Pattern Cutter',
      cast: 'Pierre Laurent',
      q: 'How did you lower fabric waste to under 3%?',
      a: 'We mapped pattern cards into mathematical clusters. Instead of cutting pieces in static lines, we rotate components dynamically to lock together like puzzle blocks.'
    }
  ]

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />

      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">
              TRANSCRIPTS & Q&A
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">
              Interviews
            </h1>
          </header>

          <div className="space-y-12 max-w-3xl mx-auto">
            {interviews.map((int) => (
              <div key={int.title} className="space-y-6 border-b border-gray-200 pb-10 last:border-b-0 text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-primary font-black uppercase tracking-wider">{int.cast}</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#1a1a1a]">{int.title}</h2>
                </div>

                <div className="space-y-4 font-serif text-sm leading-relaxed text-[#333]">
                  <div className="flex gap-3 items-start bg-white p-4 border border-gray-300 rounded">
                    <MessageSquare className="h-4.5 w-4.5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-[#1a1a1a]">Q: {int.q}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start p-4">
                    <Quote className="h-4.5 w-4.5 text-gray-300 shrink-0 mt-1" />
                    <div>
                      <p className="font-light"><strong>A:</strong> {int.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
