'use client'

import { useState } from 'react'
import { ArrowRight, Check, Copy, Sparkles, AlertCircle } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

export default function Newsletter() {
  const { soundEnabled } = useShop()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const promoCode = 'NOREX-SOCIETY-20'
  const goldColor = "#C9A84C"

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      if (soundEnabled) sounds.playPop()
      setError('Please enter a valid structural email.')
      return
    }

    setError('')
    setSubscribed(true)
    if (soundEnabled) sounds.playSuccess()
  }

  const handleCopyCode = () => {
    if (soundEnabled) sounds.playClick()
    navigator.clipboard.writeText(promoCode)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="bg-[#050505] px-6 py-28 md:px-8 border-b border-white/10 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative grids/glows */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#C9A84C]/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-6">
          
          <div style={{ borderColor: "rgba(201, 168, 76, 0.25)", backgroundColor: "rgba(201, 168, 76, 0.05)", color: goldColor }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-black font-mono">THE SOCIETY</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
            Join The Norex Society
          </h2>
          
          <p className="text-sm text-gray-400 max-w-xl mx-auto font-light leading-relaxed font-serif italic">
            Exclusive design narratives, seasonal campaign logs, and priority collection previews.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-4 max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for private credentials access" 
                    className="w-full px-6 py-4 rounded-sm bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#C9A84C] transition-all font-light"
                  />
                  {error && (
                    <div className="absolute -bottom-6 left-2 flex items-center gap-1.5 text-red-400 text-[10px] font-medium">
                      <AlertCircle className="h-3 w-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  style={{ backgroundColor: goldColor }}
                  className="px-8 py-4 text-white font-bold rounded-sm text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shrink-0 hover:bg-[#B49542]"
                >
                  <span>Request Access</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-[10px] text-gray-500 pt-3 text-center w-full">
                We value your digital security. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div style={{ borderColor: "rgba(201, 168, 76, 0.2)", backgroundColor: "rgba(201, 168, 76, 0.05)" }} className="max-w-md mx-auto p-6 rounded-sm border text-center space-y-4">
              <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="h-5 w-5" />
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-white">Welcome to the Inner Circle</h4>
                <p className="text-xs text-gray-400 mt-1.5 font-light">
                  Your structural access profile is secured. Copy your initial 20% validation token below:
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 bg-black/60 border border-white/10 rounded-sm p-2 pl-4 max-w-sm mx-auto">
                <code style={{ color: goldColor }} className="text-xs font-mono font-bold tracking-wider">{promoCode}</code>
                <button
                  onClick={handleCopyCode}
                  style={{ backgroundColor: copied ? '#22c55e' : goldColor }}
                  className="px-4 py-2 rounded-sm text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-1 text-white hover:bg-[#B49542]"
                >
                  {copied ? <span>Copied</span> : <><Copy className="h-3 w-3" /><span>Copy</span></>}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}