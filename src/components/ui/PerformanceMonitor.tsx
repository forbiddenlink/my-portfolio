'use client'

import { useEffect, useState } from 'react'

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Toggle visibility with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }

    const id = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(id)
  }, [isVisible])

  if (!isVisible) return null

  const fpsColor = fps >= 55 ? '#00ff00' : fps >= 30 ? '#ffaa00' : '#ff0000'

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 font-mono text-sm">
      <div className="flex items-center gap-3">
        <span className="text-white/60">FPS:</span>
        <span style={{ color: fpsColor }} className="font-bold text-lg">
          {fps}
        </span>
      </div>
    </div>
  )
}
