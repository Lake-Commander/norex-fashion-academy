'use client'

class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  enable(on: boolean) {
    this.enabled = on
    if (on && !this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        this.ctx = new AudioCtx()
      } catch (e) {
        console.error('Audio Context not supported in this browser', e)
      }
    }
  }

  private initCtx() {
    if (!this.ctx && this.enabled && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        this.ctx = new AudioCtx()
      } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playChord() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Elegant luxury major/minor 7th arpeggio frequencies
    const freqs = [220, 277.18, 329.63, 415.30] // A3, C#4, E4, G#4 (Amaj7)
    
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1 + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      
      osc.start(now)
      osc.stop(now + 1.3)
    })
  }

  playClick() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06)
    
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
    
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.07)
  }

  playSuccess() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    
    const playTone = (freq: number, start: number, duration: number) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.05, start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      
      osc.start(start)
      osc.stop(start + duration)
    }

    playTone(523.25, now, 0.25) // C5
    playTone(783.99, now + 0.08, 0.35) // G5
  }

  playSweep() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.3)
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.02, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
    
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }

  playPop() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04)
    
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
    
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.05)
  }
}

export const sounds = new SoundManager()
