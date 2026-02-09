'use client'

import { useViewStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { HolographicProjectPanel } from './HolographicProjectPanel'

export function ExplorationOverlay() {
  const view = useViewStore((state) => state.view)
  const isLanding = useViewStore((state) => state.isLanding)
  const [showInstructions, setShowInstructions] = useState(true)
  const [nearCrystal, setNearCrystal] = useState(false)

  useEffect(() => {
    if (view === 'exploration' && !isLanding) {
      // Show instructions briefly after landing
      const timer = setTimeout(() => setShowInstructions(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [view, isLanding])

  if (view !== 'exploration') return null

  return (
    <>
      {/* Landing HUD */}
      {isLanding && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-pulse">🚀</div>
            <div className="text-2xl font-mono text-cyan-400 tracking-wider">
              APPROACHING PLANET SURFACE
            </div>
            <div className="mt-4 text-white/60 font-mono">
              Prepare for landing...
            </div>
          </div>
        </div>
      )}

      {/* Exploration Instructions */}
      {!isLanding && showInstructions && (
        <div
          className="fixed top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top duration-500"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl px-8 py-6 shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-cyan-400 font-mono text-sm mb-4 text-center tracking-wider">
              PLANET EXPLORATION MODE
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">W</kbd>
                <span className="text-white/80">Move Forward</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">S</kbd>
                <span className="text-white/80">Move Back</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">A</kbd>
                <span className="text-white/80">Move Left</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">D</kbd>
                <span className="text-white/80">Move Right</span>
              </div>
              <div className="flex items-center gap-3 col-span-2 justify-center">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">ESC</kbd>
                <span className="text-white/80">Return to Galaxy</span>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/50 font-mono">
              Click to move camera • Explore to find project details
            </div>
          </div>
        </div>
      )}

      {/* Click to dismiss hint */}
      {!isLanding && showInstructions && (
        <button
          onClick={() => setShowInstructions(false)}
          className="fixed bottom-10 right-10 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/60 hover:text-white text-sm font-mono transition-all duration-200"
        >
          Hide Instructions
        </button>
      )}

      {/* Holographic project panel - show after short delay */}
      <HolographicProjectPanel show={!isLanding && !showInstructions} />
    </>
  )
}
