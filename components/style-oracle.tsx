'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, ArrowRight, ArrowLeft, RefreshCw, Check, ShoppingBag, Eye } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { sounds } from '@/lib/sound-utils'

type Aesthetic = 'cyber' | 'parisian' | 'luxury' | 'gothic'
type Palette = 'obsidian' | 'cyber' | 'ivory' | 'emerald'
type Occasion = 'rave' | 'street' | 'gala' | 'executive'

interface OracleProduct {
  id: number
  name: string
  price: string
  image: string
}

export default function StyleOracle() {
  const { isOracleOpen, setOracleOpen, soundEnabled, addToCart } = useShop()
  const [step, setStep] = useState<number>(1)
  const [aesthetic, setAesthetic] = useState<Aesthetic | null>(null)
  const [palette, setPalette] = useState<Palette | null>(null)
  const [occasion, setOccasion] = useState<Occasion | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [result, setResult] = useState<any | null>(null)
  const [outfitAdded, setOutfitAdded] = useState<boolean>(false)

  // Reset quiz state when drawer opens or closes
  useEffect(() => {
    if (isOracleOpen) {
      setStep(1)
      setAesthetic(null)
      setPalette(null)
      setOccasion(null)
      setResult(null)
      setOutfitAdded(false)
    }
  }, [isOracleOpen])

  if (!isOracleOpen) return null

  const handleNext = () => {
    if (soundEnabled) sounds.playClick()
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (soundEnabled) sounds.playClick()
    setStep((prev) => prev - 1)
  }

  const startAnalysis = () => {
    if (soundEnabled) sounds.playSweep()
    setLoading(true)
    setStep(4)

    const messages = [
      'Calibrating atmospheric aesthetic dimensions...',
      'Deconstructing chromatic fabric densities...',
      'Mapping occasion vectors and style geometry...',
      'Synthesizing ultimate look combinations...'
    ]

    let currentMsgIdx = 0
    setLoadingMessage(messages[0])

    const interval = setInterval(() => {
      currentMsgIdx++
      if (currentMsgIdx < messages.length) {
        if (soundEnabled) sounds.playPop()
        setLoadingMessage(messages[currentMsgIdx])
      } else {
        clearInterval(interval)
        computeResults()
      }
    }, 600)
  }

  const computeResults = () => {
    // Determine recommendations based on answers
    let matchedProducts: OracleProduct[] = []
    let styleTitle = ''
    let styleDesc = ''
    let matchScore = 0

    // Item definitions
    const items = {
      trench: { id: 5, name: 'Sartorial Trench Coat', price: '$290', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop' },
      bomber: { id: 6, name: 'Cyber Bomber Jacket', price: '$180', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop' },
      jacket: { id: 1, name: 'Leather Jacket', price: '$149', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop' },
      trouser: { id: 7, name: 'Pleated Linen Trouser', price: '$110', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop' },
      denim: { id: 3, name: 'Black Denim', price: '$89', image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop' },
      glasses: { id: 8, name: 'Geometric Sunglasses', price: '$75', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop' },
      sneakers: { id: 4, name: 'Sneakers Pro', price: '$129', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop' },
      tshirt: { id: 2, name: 'White T-Shirt', price: '$49', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' }
    }

    if (aesthetic === 'cyber') {
      matchedProducts = [items.bomber, items.denim, items.sneakers]
      styleTitle = 'NEO-STREET CYBERPUNK'
      styleDesc = `Your profile indicates a strong alignment with structural techwear. Fusing deep ${palette} tones with oversized, high-utility materials creates a modern, speed-resistant silhouette.`
      matchScore = 96
    } else if (aesthetic === 'parisian') {
      matchedProducts = [items.trench, items.trouser, items.glasses]
      styleTitle = 'LUXURY PARISIAN CHIC'
      styleDesc = `An elegant blend of soft drapes and geometric styling. Combining linen, draped wool, and structural eyewear creates a sophisticated editorial posture suitable for any high-fashion setting.`
      matchScore = 98
    } else if (aesthetic === 'luxury') {
      matchedProducts = [items.jacket, items.denim, items.tshirt]
      styleTitle = 'QUIET MONOCHROME LUXURY'
      styleDesc = `You appreciate clean minimal cuts and high-quality textures. Elevating your wardrobe with structured leather jackets and raw organic denim fits your premium lifestyle choices perfectly.`
      matchScore = 94
    } else {
      // Gothic / Custom
      matchedProducts = [items.bomber, items.trouser, items.glasses]
      styleTitle = 'STRUCTURAL ASYMMETRICAL MOOD'
      styleDesc = `A bold, mysterious aesthetic focused on geometry and drape heights. Dark accents paired with asymmetrical jackets and angular shades offer an avant-garde runway presence.`
      matchScore = 92
    }

    setResult({
      title: styleTitle,
      desc: styleDesc,
      score: matchScore,
      products: matchedProducts
    })
    setLoading(false)
    if (soundEnabled) sounds.playSuccess()
  }

  const addOutfitToCart = () => {
    if (!result) return
    result.products.forEach((prod: OracleProduct) => {
      addToCart({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image
      })
    })
    setOutfitAdded(true)
    if (soundEnabled) sounds.playSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl glass-panel flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black font-heading">AI STYLE ORACLE</span>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) sounds.playClick()
              setOracleOpen(false)
            }}
            className="p-1.5 rounded-full hover:bg-secondary text-foreground transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* STEP 1: Aesthetic */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step 01 of 03</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">Choose Your Core Aesthetic Vibe</h3>
                <p className="text-sm text-muted-foreground mt-1">Which visual world represents your fashion vision?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'cyber', name: 'Cyber Streetwear', desc: 'Tech-utility, oversized bombers, bold neon glows, urban edge', icon: '⚡' },
                  { id: 'parisian', name: 'Parisian Chic', desc: 'Draped trench coats, pleated trousers, sleek sunglasses, refined', icon: '🏛️' },
                  { id: 'luxury', name: 'Quiet Luxury', desc: 'Premium basics, minimalist premium leather, subtle textures, classic', icon: '☕' },
                  { id: 'gothic', name: 'Neo-Gothic / Avant-Garde', desc: 'Asymmetric drapes, dark silhouettes, metallic rings, striking lines', icon: '🌘' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (soundEnabled) sounds.playClick()
                      setAesthetic(item.id as Aesthetic)
                    }}
                    className={`p-5 text-left rounded-2xl border flex items-start gap-4 transition-all ${
                      aesthetic === item.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border/60 hover:bg-secondary/40 hover:border-border'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-1">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Palette */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step 02 of 03</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">Select Your Chromatic Spectrum</h3>
                <p className="text-sm text-muted-foreground mt-1">What color atmosphere fuels your look?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'obsidian', name: 'Obsidian & Gold Swell', color: 'bg-gradient-to-r from-black to-[#d4af37]', desc: 'Rich midnight black paired with luxury champagne highlights' },
                  { id: 'cyber', name: 'Cyber Neon Charge', color: 'bg-gradient-to-r from-[#07090e] to-[#a855f7]', desc: 'Matte space blue with bright purple & neon flares' },
                  { id: 'ivory', name: 'Parisian Ivory & Clay', color: 'bg-gradient-to-r from-white to-[#8e7b5f]', desc: 'Creamy warm plaster color balanced by soft slate accents' },
                  { id: 'emerald', name: 'Forest Emerald & Brass', color: 'bg-gradient-to-r from-[#081a12] to-[#c5a880]', desc: 'Classic forest green balanced by antique bronze metallic textures' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (soundEnabled) sounds.playClick()
                      setPalette(item.id as Palette)
                    }}
                    className={`p-5 text-left rounded-2xl border flex items-start gap-4 transition-all ${
                      palette === item.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border/60 hover:bg-secondary/40 hover:border-border'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg ${item.color} border border-border shrink-0 mt-1`} />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Occasion */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step 03 of 03</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">Designate the Destination</h3>
                <p className="text-sm text-muted-foreground mt-1">Where will this garment sculpture be showcased?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'rave', name: 'Cyber Rave & Club', desc: 'High motion, dark strobe lights, neon glows, expressive comfort', icon: '🔊' },
                  { id: 'street', name: 'High-Street Urban Stroll', desc: 'Casual layers, weather proof, daily utility, chic silhouettes', icon: '🏙️' },
                  { id: 'gala', name: 'Art Exhibition Gala', desc: 'Editorial postures, striking outlines, premium textile finishes', icon: '🎨' },
                  { id: 'executive', name: 'Creative Executive Lounge', desc: 'Modern professional drapes, minimal, sophisticated comfort', icon: '💼' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (soundEnabled) sounds.playClick()
                      setOccasion(item.id as Occasion)
                    }}
                    className={`p-5 text-left rounded-2xl border flex items-start gap-4 transition-all ${
                      occasion === item.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border/60 hover:bg-secondary/40 hover:border-border'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-1">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Loader and Results */}
          {step === 4 && (
            <div className="space-y-8 py-6">
              {loading ? (
                /* High-tech scanner state */
                <div className="flex flex-col items-center justify-center text-center space-y-6 h-64">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black tracking-widest text-primary animate-pulse uppercase">ANALYZING STYLE VECTORS</p>
                    <p className="text-xs text-muted-foreground font-mono">{loadingMessage}</p>
                  </div>
                </div>
              ) : (
                /* Results Output */
                result && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="text-center p-6 bg-secondary/30 rounded-3xl border border-border/80 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 bg-primary/20 border-b border-l border-primary/30 rounded-bl-2xl">
                        <span className="text-[10px] font-black text-primary tracking-widest">{result.score}% MATCH</span>
                      </div>
                      
                      <span className="text-[9px] font-black text-primary tracking-[0.2em] uppercase">Style Diagnosis Verdict</span>
                      <h3 className="text-xl md:text-2xl font-black text-foreground mt-2 tracking-wide font-heading">{result.title}</h3>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-lg mx-auto font-light">{result.desc}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black tracking-widest text-foreground uppercase">RECOMMENDED COMBINATION</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {result.products.map((prod: OracleProduct) => (
                          <div key={prod.id} className="group relative rounded-2xl overflow-hidden border border-border bg-secondary/50 p-1.5 sm:p-2.5 flex flex-col justify-between">
                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-background mb-1.5 sm:mb-2">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <h5 className="text-[9px] sm:text-[10px] font-bold text-foreground truncate">{prod.name}</h5>
                            <p className="text-[10px] sm:text-xs font-black text-primary mt-1">{prod.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border flex items-center justify-between mt-auto">
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 border border-border/80 hover:bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back</span>
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={(step === 1 && !aesthetic) || (step === 2 && !palette)}
              className="ml-auto px-8 py-3 bg-primary text-primary-foreground disabled:opacity-40 disabled:pointer-events-none hover:bg-accent rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={startAnalysis}
              disabled={!occasion}
              className="ml-auto px-8 py-3 bg-primary text-primary-foreground disabled:opacity-40 disabled:pointer-events-none hover:bg-accent rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <span>Run Style Oracle</span>
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </button>
          ) : (
            /* Results Actions */
            !loading && (
              <div className="flex gap-4 w-full justify-between items-center">
                <button
                  onClick={() => {
                    if (soundEnabled) sounds.playClick()
                    setStep(1)
                    setAesthetic(null)
                    setPalette(null)
                    setOccasion(null)
                    setResult(null)
                    setOutfitAdded(false)
                  }}
                  className="px-6 py-3 border border-border hover:bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Start Over</span>
                </button>

                <button
                  onClick={addOutfitToCart}
                  disabled={outfitAdded}
                  className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    outfitAdded
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-accent shadow-lg shadow-primary/20'
                  }`}
                >
                  {outfitAdded ? (
                    <>
                      <Check className="h-4.5 w-4.5" />
                      <span>Outfit Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>Buy Complete Outfit</span>
                    </>
                  )}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
