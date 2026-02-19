'use client'

import { useEffect, useState, useCallback } from 'react'
import { useViewStore } from '@/lib/store'
import { galaxies, getGalaxyById } from '@/lib/galaxyData'
import { useScanTarget } from '@/components/3d/ScanSystem'

// Touch target minimum size (44x44px for accessibility)
const TOUCH_TARGET_SIZE = 'min-h-[44px] min-w-[44px]'

// Detect touch device
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
  }, [])

  return isTouch
}

export function ExplorerHUD() {
  // Get scan target from shared store
  const { targetPlanet, isScanned: isTargetScanned } = useScanTarget()
  const scanTargetId = targetPlanet?.id ?? null
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const scannedPlanets = useViewStore((state) => state.scannedPlanets)
  const scanningPlanet = useViewStore((state) => state.scanningPlanet)
  const scanProgress = useViewStore((state) => state.scanProgress)

  const isTouch = useIsTouchDevice()
  const [locationVisible, setLocationVisible] = useState(true)
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())

  // Get current galaxy data
  const currentGalaxy = selectedGalaxy ? getGalaxyById(selectedGalaxy) : null
  const galaxyIndex = galaxies.findIndex((g) => g.id === selectedGalaxy)

  // Count scanned planets in current galaxy
  const totalPlanetsInGalaxy = currentGalaxy?.projects.length ?? 0
  const scannedInGalaxy = currentGalaxy
    ? currentGalaxy.projects.filter((p) => scannedPlanets.has(p.id)).length
    : 0

  // Track camera movement to show/hide location indicator
  const handleCameraMove = useCallback(() => {
    setLastMoveTime(Date.now())
    setLocationVisible(true)
  }, [])

  // Listen for mouse/touch movement to detect camera activity
  useEffect(() => {
    if (view !== 'galaxy') return

    const handleMove = () => handleCameraMove()

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('wheel', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('wheel', handleMove)
    }
  }, [view, handleCameraMove])

  // Fade out location indicator after 3s of no movement
  useEffect(() => {
    if (view !== 'galaxy') return

    const fadeTimer = setTimeout(() => {
      const timeSinceMove = Date.now() - lastMoveTime
      if (timeSinceMove >= 3000) {
        setLocationVisible(false)
      }
    }, 3000)

    return () => clearTimeout(fadeTimer)
  }, [view, lastMoveTime])

  // Only show in galaxy view
  if (view !== 'galaxy') return null

  const isScanning = scanningPlanet === scanTargetId && scanTargetId !== null
  const canLand = scanTargetId !== null && isTargetScanned
  const canScan = scanTargetId !== null && !isTargetScanned && !isScanning

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Location Indicator - Bottom Left */}
      <div
        className={`absolute bottom-6 left-6 transition-opacity duration-500 ${
          locationVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="rounded-xl px-4 py-3 backdrop-blur-sm"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: `1px solid ${currentGalaxy?.color ?? '#ffffff'}30`,
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px ${currentGalaxy?.color ?? '#ffffff'}10`,
          }}
        >
          {/* Galaxy name */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: currentGalaxy?.color ?? '#ffffff',
                boxShadow: `0 0 8px ${currentGalaxy?.color ?? '#ffffff'}`,
              }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: currentGalaxy?.color ?? '#ffffff' }}
            >
              {currentGalaxy?.name ?? 'Unknown Galaxy'}
            </span>
          </div>

          {/* Exploration progress */}
          <div className="text-xs text-white/60 font-mono">
            {scannedInGalaxy}/{totalPlanetsInGalaxy} explored
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 w-32 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalPlanetsInGalaxy > 0 ? (scannedInGalaxy / totalPlanetsInGalaxy) * 100 : 0}%`,
                backgroundColor: currentGalaxy?.color ?? '#ffffff',
              }}
            />
          </div>
        </div>
      </div>

      {/* Scan/Land Prompts - Center Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        {/* Scanning Progress */}
        {isScanning && (
          <div className="flex flex-col items-center animate-in fade-in duration-200">
            {/* Circular progress indicator */}
            <div className="relative w-16 h-16 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                {/* Background circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                />
                {/* Progress circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={currentGalaxy?.color ?? '#9D4EDD'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - scanProgress)}
                  style={{
                    transition: 'stroke-dashoffset 0.1s ease-out',
                    filter: `drop-shadow(0 0 8px ${currentGalaxy?.color ?? '#9D4EDD'})`,
                  }}
                />
              </svg>
              {/* Percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono text-white/90">
                  {Math.round(scanProgress * 100)}%
                </span>
              </div>
            </div>
            <div className="text-sm font-mono text-white/70">
              Scanning...
            </div>
          </div>
        )}

        {/* Scan prompt - when planet in range and not scanned */}
        {canScan && !isScanning && (
          <div
            className={`flex flex-col items-center animate-in fade-in duration-200 pointer-events-auto ${TOUCH_TARGET_SIZE}`}
          >
            <div
              className="rounded-xl px-5 py-3 backdrop-blur-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(157, 78, 221, 0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                {isTouch ? (
                  <>
                    <span className="text-sm font-mono text-white/80">[Hold]</span>
                    <span className="text-sm font-mono text-purple-400">to scan</span>
                  </>
                ) : (
                  <>
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm font-mono text-white">
                      Hold SPACE
                    </kbd>
                    <span className="text-sm font-mono text-purple-400">to scan</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Land prompt - after scan complete */}
        {canLand && !isScanning && (
          <div
            className={`flex flex-col items-center animate-in fade-in duration-200 pointer-events-auto ${TOUCH_TARGET_SIZE}`}
          >
            <div
              className="rounded-xl px-5 py-3 backdrop-blur-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(6, 255, 165, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 255, 165, 0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                {isTouch ? (
                  <>
                    <span className="text-sm font-mono text-white/80">[Tap]</span>
                    <span className="text-sm font-mono text-green-400">to land</span>
                  </>
                ) : (
                  <>
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm font-mono text-white">
                      ENTER
                    </kbd>
                    <span className="text-sm font-mono text-green-400">to land</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
