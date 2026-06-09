'use client'

import Header from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StyleOracle from '@/components/style-oracle'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EditorialStoriesPage() {
  const { soundEnabled } = useShop()

  const handleInteract = () => {
    if (soundEnabled) sounds.playPop()
  }

  const stories = [
    {
      id: '1',
      title: 'THE KINETIC REVOLUTION: HOW GEOMETRY REDEFINED STRETCH',
      author: 'Elena Rostova',
      readTime: '6 min read',
      image: '/runway/hero-banner-2.avif',
      desc: 'In the history of tailoring, structure has often been synonym with rigidity. From the stiff corsetry of the 19th century to the padded shoulders of the late 20th century, standard garments forced the human body to conform to static forms. The design offices of ORLIEN sought to break this constraint.'
    },
    {
      id: '2',
      title: 'AEGEAN GOLD: SOURCING THE PUREST GOTS COTTON',
      author: 'Sarah Jenkins',
      readTime: '4 min read',
      image: '/runway/look-07.avif',
      desc: 'Deep in the Aegean region of Turkey, organic cotton farming has evolved from a traditional technique into a precise ecological science. Here, cotton is grown with zero synthetic fertilizers, relying on local natural irrigation and biological pest controls.'
    }
  ]

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] transition-colors duration-500 flex flex-col justify-between overflow-x-hidden font-sans">
      <Header />

      <section className="relative w-full py-12 border-b border-gray-300 text-left">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          <header className="border-b-2 border-[#1a1a1a] pb-6 mb-12 text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#555] uppercase">
              JOURNAL READS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-[#1a1a1a] leading-none pt-2">
              Stories
            </h1>
          </header>

          <div className="space-y-12">
            {stories.map((story) => (
              <article key={story.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-200 pb-12 last:border-b-0">
                <div className="lg:col-span-7 aspect-[16/10] bg-gray-200 border border-gray-300 rounded overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1000ms]" />
                </div>
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="flex gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>By {story.author}</span>
                    <span>•</span>
                    <span>{story.readTime}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#1a1a1a] leading-tight">
                    {story.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-[#444] font-serif font-light">
                    {story.desc}
                  </p>
                  <Link
                    href="/editorial"
                    onClick={handleInteract}
                    className="inline-flex px-6 py-3 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all text-xs font-bold uppercase tracking-widest gap-2 items-center"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <StyleOracle />
      <Footer />
    </main>
  )
}
