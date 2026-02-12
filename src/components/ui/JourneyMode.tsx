'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewStore } from '@/lib/store'
import { galaxies, narrativeTours, getProjectById, getGalaxyById, type NarrativeTour } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import type { Project } from '@/lib/types'
import gsap from 'gsap'

interface TourStop {
  galaxyId: string
  galaxyName: string
  galaxyColor: string
  galaxyPosition: { x: number; y: number; z: number }
  project: Project
  projectPosition: { x: number; y: number; z: number }
  narrativeIntro?: string
}

// Default tour: one featured project per galaxy
function getDefaultTourStops(): TourStop[] {
  return galaxies.map((galaxy, galaxyIndex) => {
    const featuredProject = galaxy.projects.find(p => p.featured) || galaxy.projects[0]

    const galaxyAngle = (galaxyIndex / 6) * Math.PI * 2
    const galaxyRadius = 25
    const galaxyPosition = {
      x: Math.cos(galaxyAngle) * galaxyRadius,
      y: 0,
      z: Math.sin(galaxyAngle) * galaxyRadius
    }

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
}

// Generate tour stops for a narrative tour
function getNarrativeTourStops(tourId: string): TourStop[] {
  const tour = narrativeTours.find(t => t.id === tourId)
  if (!tour) return getDefaultTourStops()

  const stops: TourStop[] = []

  for (const projectId of tour.projectIds) {
    const project = getProjectById(projectId)
    if (!project) continue

    const galaxy = getGalaxyById(project.galaxy)
    if (!galaxy) continue

    const galaxyIndex = galaxies.findIndex(g => g.id === galaxy.id)
    const projectIndex = galaxy.projects.findIndex(p => p.id === projectId)

    const galaxyAngle = (galaxyIndex / 6) * Math.PI * 2
    const galaxyRadius = 25
    const galaxyPosition = {
      x: Math.cos(galaxyAngle) * galaxyRadius,
      y: 0,
      z: Math.sin(galaxyAngle) * galaxyRadius
    }

    const [px, py, pz] = generateProjectPosition(
      project.id,
      galaxy.id,
      galaxyIndex,
      projectIndex,
      galaxy.projects.length
    )

    stops.push({
      galaxyId: galaxy.id,
      galaxyName: galaxy.name,
      galaxyColor: tour.color,
      galaxyPosition,
      project,
      projectPosition: { x: px, y: py, z: pz },
      narrativeIntro: tour.narrativeIntros[projectId]
    })
  }

  return stops
}

// Hook to get current tour stops based on active tour
function useTourStops(): TourStop[] {
  const activeTourId = useViewStore((state) => state.activeTourId)

  return useMemo(() => {
    if (!activeTourId) return getDefaultTourStops()
    return getNarrativeTourStops(activeTourId)
  }, [activeTourId])
}

// Hook to get active tour info
function useActiveTour(): NarrativeTour | null {
  const activeTourId = useViewStore((state) => state.activeTourId)
  return useMemo(() => {
    if (!activeTourId) return null
    return narrativeTours.find(t => t.id === activeTourId) || null
  }, [activeTourId])
}

// Camera controller for journey - runs inside Canvas
export function JourneyCameraController() {
  const { camera } = useThree()
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const journeyStep = useViewStore((state) => state.journeyStep)
  const isJourneyPaused = useViewStore((state) => state.isJourneyPaused)
  const nextJourneyStop = useViewStore((state) => state.nextJourneyStop)
  const endJourney = useViewStore((state) => state.endJourney)

  const tourStops = useTourStops()
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null)

  // Animate to current stop
  useEffect(() => {
    if (!isJourneyMode) return

    const stop = tourStops[journeyStep]
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
  }, [isJourneyMode, journeyStep, camera, endJourney, tourStops])

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
      if (journeyStep < tourStops.length - 1) {
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
  }, [isJourneyMode, isJourneyPaused, journeyStep, nextJourneyStop, endJourney, tourStops.length])

  return null
}

// Touch target minimum size (44x44px for accessibility)
const TOUCH_TARGET_SIZE = 'min-h-[44px] min-w-[44px]'

// Detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
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

  const tourStops = useTourStops()
  const activeTour = useActiveTour()
  const isMobile = useIsMobile()
  const [showInfoCard, setShowInfoCard] = useState(true)

  const handleNext = useCallback(() => {
    if (journeyStep < tourStops.length - 1) {
      nextJourneyStop()
    } else {
      endJourney()
    }
  }, [journeyStep, tourStops.length, nextJourneyStop, endJourney])

  const handlePrev = useCallback(() => {
    if (journeyStep > 0) {
      prevJourneyStop()
    }
  }, [journeyStep, prevJourneyStop])

  if (!isJourneyMode) return null

  const currentStop = tourStops[journeyStep]
  if (!currentStop) return null

  // Mobile layout - optimized for thumb reach
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Collapsible Info Card - Top area, tap to toggle */}
        <div
          key={`mobile-${journeyStep}`}
          className="absolute top-4 left-4 right-4 pointer-events-auto"
        >
          <button
            onClick={() => setShowInfoCard(!showInfoCard)}
            className="w-full text-left"
            aria-expanded={showInfoCard}
            aria-label={showInfoCard ? 'Collapse info' : 'Expand info'}
          >
            <div
              className="rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 5, 30, 0.85) 100%)',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px ${currentStop.galaxyColor}15`,
                border: `1px solid ${currentStop.galaxyColor}30`,
              }}
            >
              {/* Always visible header */}
              <div className="flex items-center gap-3 p-4">
                {/* Tour badge or galaxy indicator */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${currentStop.galaxyColor}20`,
                    border: `2px solid ${currentStop.galaxyColor}50`
                  }}
                >
                  {activeTour ? (
                    <span className="text-lg">{activeTour.icon}</span>
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentStop.galaxyColor }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentStop.galaxyColor }}
                  >
                    {currentStop.galaxyName}
                  </div>
                  <h3 className="text-base font-bold text-white truncate">
                    {currentStop.project.title}
                  </h3>
                </div>

                {/* Expand/collapse indicator */}
                <svg
                  className={`w-5 h-5 text-white/50 transition-transform duration-200 ${showInfoCard ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expandable content */}
              {showInfoCard && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-sm text-white/70 leading-relaxed mb-3">
                    {currentStop.narrativeIntro || (
                      <>
                        {currentStop.project.description.slice(0, 100)}
                        {currentStop.project.description.length > 100 ? '...' : ''}
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentStop.project.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Bottom Controls - Thumb-friendly zone */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto pb-safe">
          {/* Glass background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(10, 5, 30, 0.9) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          />

          {/* Top border glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${currentStop.galaxyColor}60 50%, transparent 100%)`
            }}
          />

          <div className="relative px-4 py-4">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-white/50 font-medium min-w-[2rem]">
                {journeyStep + 1}/{tourStops.length}
              </span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((journeyStep + 1) / tourStops.length) * 100}%`,
                    backgroundColor: currentStop.galaxyColor
                  }}
                />
              </div>
            </div>

            {/* Main control buttons - Large touch targets */}
            <div className="flex items-center justify-between gap-3">
              {/* Exit button */}
              <button
                onClick={endJourney}
                className={`flex items-center justify-center p-3 rounded-xl bg-white/5 active:bg-white/15 transition-all duration-200 ${TOUCH_TARGET_SIZE}`}
                aria-label="Exit tour"
              >
                <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Prev button */}
              <button
                onClick={handlePrev}
                disabled={journeyStep === 0}
                className={`flex items-center justify-center p-4 rounded-xl transition-all duration-200 ${TOUCH_TARGET_SIZE} ${
                  journeyStep === 0
                    ? 'bg-white/5 text-white/20'
                    : 'bg-white/10 text-white active:scale-95 active:bg-white/20'
                }`}
                aria-label="Previous stop"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Play/Pause button - Largest target */}
              <button
                onClick={toggleJourneyPause}
                className="flex items-center justify-center p-5 rounded-2xl transition-all duration-200 active:scale-95 min-h-[56px] min-w-[56px]"
                style={{
                  background: `linear-gradient(135deg, ${currentStop.galaxyColor}40 0%, ${currentStop.galaxyColor}20 100%)`,
                  border: `1px solid ${currentStop.galaxyColor}50`,
                  boxShadow: `0 4px 20px ${currentStop.galaxyColor}30`
                }}
                aria-label={isJourneyPaused ? 'Resume tour' : 'Pause tour'}
              >
                {isJourneyPaused ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              {/* Next button */}
              <button
                onClick={handleNext}
                className={`flex items-center justify-center p-4 rounded-xl bg-white/10 text-white active:scale-95 active:bg-white/20 transition-all duration-200 ${TOUCH_TARGET_SIZE}`}
                aria-label={journeyStep === tourStops.length - 1 ? 'End tour' : 'Next stop'}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Step selector (tap to jump) */}
              <button
                onClick={() => {
                  // Cycle through stops on tap
                  const nextStep = (journeyStep + 1) % tourStops.length
                  setJourneyStep(nextStep)
                }}
                className={`flex items-center justify-center p-3 rounded-xl bg-white/5 active:bg-white/15 transition-all duration-200 ${TOUCH_TARGET_SIZE}`}
                aria-label="Jump to next section"
              >
                <div className="flex items-center gap-1">
                  {tourStops.slice(0, Math.min(6, tourStops.length)).map((_: TourStop, index: number) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        index === journeyStep
                          ? 'scale-150'
                          : index < journeyStep
                          ? 'opacity-100'
                          : 'opacity-30'
                      }`}
                      style={{
                        backgroundColor: index <= journeyStep ? currentStop.galaxyColor : 'white'
                      }}
                    />
                  ))}
                </div>
              </button>
            </div>

            {/* Swipe hint for mobile */}
            <p className="text-center text-xs text-white/40 mt-3">
              Swipe left/right to navigate
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout - original design
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
          {/* Tour name badge (for narrative tours) */}
          {activeTour && (
            <div
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${activeTour.color}20`, color: activeTour.color }}
            >
              <span>{activeTour.icon}</span>
              <span>{activeTour.name}</span>
            </div>
          )}

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

          {/* Narrative intro (for narrative tours) or description */}
          <p className="text-sm text-white/70 leading-relaxed">
            {currentStop.narrativeIntro || (
              <>
                {currentStop.project.description.slice(0, 120)}
                {currentStop.project.description.length > 120 ? '...' : ''}
              </>
            )}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {currentStop.project.tags.slice(0, 3).map((tag: string) => (
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
            {tourStops.map((_: TourStop, index: number) => (
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
            aria-label={journeyStep === tourStops.length - 1 ? 'End tour' : 'Next stop'}
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

// Export for external use
export { narrativeTours }
