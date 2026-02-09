'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewStore } from '@/lib/store'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import gsap from 'gsap'
import * as THREE from 'three'

// Define tour stops - one featured project per galaxy
const TOUR_STOPS = galaxies.map((galaxy, galaxyIndex) => {
  // Find featured project or first project
  const featuredProject = galaxy.projects.find(p => p.featured) || galaxy.projects[0]

  // Calculate galaxy center position
  const galaxyAngle = (galaxyIndex / 6) * Math.PI * 2
  const galaxyRadius = 25
  const galaxyPosition = {
    x: Math.cos(galaxyAngle) * galaxyRadius,
    y: 0,
    z: Math.sin(galaxyAngle) * galaxyRadius
  }

  // Calculate project position
  const [px, py, pz] = generateProjectPosition(
    featuredProject.id,
    galaxy.id,
    galaxyIndex,
    0,
    galaxy.projects.length
  )

  return {
    galaxyId: galaxy.id,
    galaxyName: galaxy.name,
    galaxyColor: galaxy.color,
    galaxyPosition,
    project: featuredProject,
    projectPosition: { x: px, y: py, z: pz }
  }
})

// Camera controller for journey - runs inside Canvas
export function JourneyCameraController() {
  const { camera } = useThree()
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const journeyStep = useViewStore((state) => state.journeyStep)
  const isJourneyPaused = useViewStore((state) => state.isJourneyPaused)
  const nextJourneyStop = useViewStore((state) => state.nextJourneyStop)
  const endJourney = useViewStore((state) => state.endJourney)

  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null)

  // Animate to current stop
  useEffect(() => {
    if (!isJourneyMode) return

    const stop = TOUR_STOPS[journeyStep]
    if (!stop) {
      endJourney()
      return
    }

    // Kill any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const tl = gsap.timeline()
    timelineRef.current = tl

    // First: fly to galaxy overview
    tl.to(camera.position, {
      x: stop.galaxyPosition.x,
      y: stop.galaxyPosition.y + 20,
      z: stop.galaxyPosition.z + 30,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(stop.galaxyPosition.x, stop.galaxyPosition.y, stop.galaxyPosition.z)
      }
    })

    // Brief pause
    tl.to({}, { duration: 0.5 })

    // Then: zoom to featured project
    tl.to(camera.position, {
      x: stop.projectPosition.x + 5,
      y: stop.projectPosition.y + 3,
      z: stop.projectPosition.z + 10,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(stop.projectPosition.x, stop.projectPosition.y, stop.projectPosition.z)
      }
    })

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isJourneyMode, journeyStep, camera, endJourney])

  // Auto-advance timer
  useEffect(() => {
    if (!isJourneyMode || isJourneyPaused) {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current)
      }
      return
    }

    // Wait for camera animation (4.5s) + hold time (5s)
    autoAdvanceRef.current = setTimeout(() => {
      if (journeyStep < TOUR_STOPS.length - 1) {
        nextJourneyStop()
      } else {
        endJourney()
      }
    }, 9500)

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current)
      }
    }
  }, [isJourneyMode, isJourneyPaused, journeyStep, nextJourneyStop, endJourney])

  return null
}

// UI overlay for journey controls
export function JourneyOverlay() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const journeyStep = useViewStore((state) => state.journeyStep)
  const isJourneyPaused = useViewStore((state) => state.isJourneyPaused)
  const nextJourneyStop = useViewStore((state) => state.nextJourneyStop)
  const prevJourneyStop = useViewStore((state) => state.prevJourneyStop)
  const setJourneyStep = useViewStore((state) => state.setJourneyStep)
  const toggleJourneyPause = useViewStore((state) => state.toggleJourneyPause)
  const endJourney = useViewStore((state) => state.endJourney)

  const handleNext = useCallback(() => {
    if (journeyStep < TOUR_STOPS.length - 1) {
      nextJourneyStop()
    } else {
      endJourney()
    }
  }, [journeyStep, nextJourneyStop, endJourney])

  const handlePrev = useCallback(() => {
    if (journeyStep > 0) {
      prevJourneyStop()
    }
  }, [journeyStep, prevJourneyStop])

  if (!isJourneyMode) return null

  const currentStop = TOUR_STOPS[journeyStep]
  if (!currentStop) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Info Card - Upper left to avoid Minimap overlap */}
      <div
        key={journeyStep}
        className="absolute top-8 left-8 pointer-events-auto max-w-sm animate-fade-in-up"
      >
        <div
          className="rounded-2xl p-6 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 5, 30, 0.8) 100%)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px ${currentStop.galaxyColor}20`,
            border: `1px solid ${currentStop.galaxyColor}40`,
          }}
        >
          {/* Galaxy label */}
          <div
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: currentStop.galaxyColor }}
          >
            {currentStop.galaxyName}
          </div>

          {/* Project title */}
          <h3 className="text-xl font-bold text-white mb-2">
            {currentStop.project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/70 leading-relaxed">
            {currentStop.project.description.slice(0, 120)}
            {currentStop.project.description.length > 120 ? '...' : ''}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {currentStop.project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar - Bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div
          className="flex items-center gap-6 rounded-full px-6 py-3 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(10, 5, 30, 0.7) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {TOUR_STOPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setJourneyStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === journeyStep
                    ? 'bg-white scale-125'
                    : index < journeyStep
                    ? 'bg-white/50'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to stop ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-white/20" />

          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={journeyStep === 0}
            className="text-white/70 hover:text-white disabled:text-white/30 transition-colors"
            aria-label="Previous stop"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause button */}
          <button
            onClick={toggleJourneyPause}
            className="text-white hover:text-white/80 transition-colors"
            aria-label={isJourneyPaused ? 'Resume tour' : 'Pause tour'}
          >
            {isJourneyPaused ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="text-white/70 hover:text-white transition-colors"
            aria-label={journeyStep === TOUR_STOPS.length - 1 ? 'End tour' : 'Next stop'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="w-px h-6 bg-white/20" />

          {/* Skip button */}
          <button
            onClick={endJourney}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

    </div>
  )
}

// Export tour stops for external use
export { TOUR_STOPS }
