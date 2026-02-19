'use client'

import { create } from 'zustand'
import type { ViewState } from './types'

interface ViewStore {
  // Core state machine
  view: ViewState
  selectedGalaxy: string | null
  selectedProject: string | null
  isLanding: boolean // Track landing animation state
  hasEntered: boolean // Track if user has entered the experience

  // Scan state (Explorer Phase 1)
  scannedPlanets: Set<string>
  scanningPlanet: string | null
  scanProgress: number // 0-1

  // Journey Mode state
  isJourneyMode: boolean
  journeyStep: number
  isJourneyPaused: boolean
  activeTourId: string | null // null = default galaxy tour, string = narrative tour ID

  // Actions
  setView: (view: ViewState) => void
  selectGalaxy: (galaxyId: string) => void
  selectProject: (projectId: string) => void
  enter: () => void
  reset: () => void

  // Navigation helpers
  zoomToGalaxy: (galaxyId: string) => void
  zoomToProject: (projectId: string) => void
  exploreProject: (projectId: string) => void
  exitExploration: () => void
  zoomOut: () => void

  // Scan actions (Explorer Phase 1)
  startScan: (planetId: string) => void
  updateScanProgress: (progress: number) => void
  completeScan: (planetId: string) => void
  cancelScan: () => void

  // Journey Mode actions
  startJourney: (tourId?: string) => void
  endJourney: () => void
  nextJourneyStop: () => void
  prevJourneyStop: () => void
  setJourneyStep: (step: number) => void
  toggleJourneyPause: () => void
}

export const useViewStore = create<ViewStore>((set, get) => ({
  // Initial state
  view: 'universe',
  selectedGalaxy: null,
  selectedProject: null,
  isLanding: false,
  hasEntered: false,

  // Scan initial state
  scannedPlanets: new Set<string>(),
  scanningPlanet: null,
  scanProgress: 0,

  // Journey Mode initial state
  isJourneyMode: false,
  journeyStep: 0,
  isJourneyPaused: false,
  activeTourId: null,

  // Basic setters
  setView: (view) => set({ view }),

  selectGalaxy: (galaxyId) =>
    set({ selectedGalaxy: galaxyId }),

  selectProject: (projectId) =>
    set({ selectedProject: projectId }),

  enter: () => set({ hasEntered: true }),

  reset: () =>
    set({ view: 'universe', selectedGalaxy: null, selectedProject: null, isLanding: false }),

  // Navigation with state transitions
  zoomToGalaxy: (galaxyId) => {
    set({
      view: 'galaxy',
      selectedGalaxy: galaxyId,
      selectedProject: null,
      isLanding: false
    })
  },

  zoomToProject: (projectId) => {
    const state = get()
    // If not in a galaxy view, we need to figure out which galaxy this project belongs to
    set({
      view: 'project',
      selectedProject: projectId,
      isLanding: false
    })
  },

  // New: Enter exploration mode with landing animation
  exploreProject: (projectId) => {
    set({
      view: 'exploration',
      selectedProject: projectId,
      isLanding: true
    })
  },

  // New: Exit exploration mode
  exitExploration: () => {
    const state = get()
    set({
      view: state.selectedGalaxy ? 'galaxy' : 'universe',
      selectedProject: null,
      isLanding: false
    })
  },

  zoomOut: () => {
    const state = get()
    if (state.view === 'exploration') {
      // From exploration back to galaxy
      set({ view: 'galaxy', selectedProject: null, isLanding: false })
    } else if (state.view === 'project') {
      // From project back to galaxy
      set({ view: 'galaxy', selectedProject: null, isLanding: false })
    } else if (state.view === 'galaxy') {
      // From galaxy back to universe
      set({ view: 'universe', selectedGalaxy: null, isLanding: false })
    }
  },

  // Scan actions
  startScan: (planetId) => set({
    scanningPlanet: planetId,
    scanProgress: 0
  }),

  updateScanProgress: (progress) => set({
    scanProgress: Math.min(1, Math.max(0, progress))
  }),

  completeScan: (planetId) => set((state) => ({
    scannedPlanets: new Set([...state.scannedPlanets, planetId]),
    scanningPlanet: null,
    scanProgress: 0
  })),

  cancelScan: () => set({
    scanningPlanet: null,
    scanProgress: 0
  }),

  // Journey Mode actions
  startJourney: (tourId?: string) => set({
    isJourneyMode: true,
    journeyStep: 0,
    isJourneyPaused: false,
    activeTourId: tourId ?? null,
    view: 'universe'
  }),

  endJourney: () => set({
    isJourneyMode: false,
    journeyStep: 0,
    isJourneyPaused: false
  }),

  nextJourneyStop: () => set((state) => ({
    journeyStep: state.journeyStep + 1
  })),

  prevJourneyStop: () => set((state) => ({
    journeyStep: Math.max(0, state.journeyStep - 1)
  })),

  setJourneyStep: (step) => set({ journeyStep: step }),

  toggleJourneyPause: () => set((state) => ({
    isJourneyPaused: !state.isJourneyPaused
  })),
}))

// Motion preferences store - combines OS preference with manual toggle
import { useState, useEffect } from 'react'

interface MotionStore {
  manualReducedMotion: boolean | null // null = follow OS, true/false = override
  setManualReducedMotion: (value: boolean | null) => void
}

export const useMotionStore = create<MotionStore>((set) => ({
  manualReducedMotion: null,
  setManualReducedMotion: (value) => set({ manualReducedMotion: value }),
}))

export function usePrefersReducedMotion() {
  const [osPreference, setOsPreference] = useState(false)
  const manualOverride = useMotionStore((state) => state.manualReducedMotion)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setOsPreference(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setOsPreference(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Manual override takes precedence over OS preference
  return manualOverride !== null ? manualOverride : osPreference
}
