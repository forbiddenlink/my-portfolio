'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useViewStore } from '@/lib/store'

export function SoundManager() {
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [isClient, setIsClient] = useState(false)
  const synthRef = useRef<AudioSynth | null>(null)
  const hasEntered = useViewStore((state) => state.hasEntered)

  useEffect(() => {
    setIsClient(true)
    synthRef.current = new AudioSynth()

    return () => {
      if (synthRef.current) {
        synthRef.current.stopDrone()
      }
    }
  }, [])

  useEffect(() => {
    if (!synthRef.current) return

    if (!isMuted && hasEntered) {
      synthRef.current.resume()
      synthRef.current.playDrone()
    } else {
      synthRef.current.stopDrone()
    }
  }, [isMuted, hasEntered])

  useEffect(() => {
    if (!isClient || !synthRef.current) return

    const handleButtonHover = () => !isMuted && synthRef.current?.playHover()
    const handleButtonClick = () => !isMuted && synthRef.current?.playClick()

    // Add event listeners to buttons
    const buttons = document.querySelectorAll('button, a[href], [role="button"]')
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', handleButtonHover)
      button.addEventListener('click', handleButtonClick)
    })

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('mouseenter', handleButtonHover)
        button.removeEventListener('click', handleButtonClick)
      })
    }
  }, [isMuted, isClient])

  if (!isClient) return null

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 group hover:scale-110"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      title={isMuted ? 'Enable sound effects' : 'Disable sound effects'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}

// Separate synth class to keep component clean
class AudioSynth {
  ctx: AudioContext | null = null
  masterGain: GainNode | null = null
  droneOscillators: OscillatorNode[] = []
  droneGain: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioContextClass()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.gain.value = 0.3 // Master volume
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playDrone() {
    if (!this.ctx || !this.masterGain || this.droneOscillators.length > 0) return

    this.droneGain = this.ctx.createGain()
    this.droneGain.connect(this.masterGain)
    this.droneGain.gain.value = 0.0

    // Low frequency drone
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55 // A1

    // Slight detune for texture
    const osc2 = this.ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 112 // A2 approx

    osc1.connect(this.droneGain)
    osc2.connect(this.droneGain)

    osc1.start()
    osc2.start()

    this.droneOscillators = [osc1, osc2]

    // Fade in
    this.droneGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2)
  }

  stopDrone() {
    if (!this.droneGain || !this.ctx) return

    // Fade out
    this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5)

    setTimeout(() => {
      this.droneOscillators.forEach(o => o.stop())
      this.droneOscillators = []
      this.droneGain?.disconnect()
      this.droneGain = null
    }, 500)
  }

  playClick() {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.connect(gain)
    gain.connect(this.masterGain)

    // High tech click
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2000, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  playHover() {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.connect(gain)
    gain.connect(this.masterGain)

    // Subtle hover chirp
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }
}
