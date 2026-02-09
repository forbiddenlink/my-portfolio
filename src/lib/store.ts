'use client'

import { create } from 'zustand'
import type { ViewState } from './types'

interface ViewStore {
  // Core state machine
  view: ViewState
  selectedGalaxy: string | null
  selectedProject: string | null
  isLanding: boolean // Track landing animation state
  hasEntered: boolean // New: Track if user has entered the experience

  // Journey Mode state
  isJourneyMode: boolean
  journeyStep: number
  isJourneyPaused: boolean

  // Actions
  setView: (view: ViewState) => void
  selectGalaxy: (galaxyId: string) => void
  selectProject: (projectId: string) => void
  enter: () => void // New: Enter action
  reset: () => void

  // Navigation helpers
  zoomToGalaxy: (galaxyId: string) => void
  zoomToProject: (projectId: string) => void
  exploreProject: (projectId: string) => void
  exitExploration: () => void
  zoomOut: () => void

  // Journey Mode actions
  startJourney: () => void
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

  // Journey Mode initial state
  isJourneyMode: false,
  journeyStep: 0,
  isJourneyPaused: false,

  // Basic setters
  setView: (view) => set({ view }),

  selectGalaxy: (galaxyId) =>
    set({ selectedGalaxy: galaxyId }),

  selectProject: (projectId) =>
    set({ selectedProject: projectId }),

  enter: () => set({ hasEntered: true }),

  reset: () =>
    set({ view: 'universe', selectedGalaxy: null, selectedProject: null, isLanding: false, hasEntered: false }),

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

  // Journey Mode actions
  startJourney: () => set({
    isJourneyMode: true,
    journeyStep: 0,
    isJourneyPaused: false,
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

// Reduced motion preference detection
export function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
