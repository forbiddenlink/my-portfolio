'use client'

import { useEffect, useRef } from 'react'
import { useViewStore } from '@/lib/store'

export function TouchGestures() {
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  // Journey mode state
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const nextJourneyStop = useViewStore((state) => state.nextJourneyStop)
  const prevJourneyStop = useViewStore((state) => state.prevJourneyStop)
  const journeyStep = useViewStore((state) => state.journeyStep)
  const endJourney = useViewStore((state) => state.endJourney)

  // Ref to track swipe state
  const swipeRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
  })

  useEffect(() => {
    const galaxyOrder = [
      'enterprise',
      'creative',
      'ai-ml',
      'open-source',
      'experiments',
      'early-work',
    ]

    // Get the total number of tour stops (approximate for swipe bounds checking)
    const maxJourneyStops = 6 // One featured project per galaxy

    const handleTouchStart = (e: TouchEvent) => {
      swipeRef.current = {
        startX: e.changedTouches[0].screenX,
        startY: e.changedTouches[0].screenY,
        startTime: Date.now(),
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX
      const touchEndY = e.changedTouches[0].screenY
      const touchEndTime = Date.now()

      const deltaX = touchEndX - swipeRef.current.startX
      const deltaY = touchEndY - swipeRef.current.startY
      const deltaTime = touchEndTime - swipeRef.current.startTime

      // Swipe detection thresholds
      const minSwipeDistance = 50
      const maxSwipeTime = 500 // ms - for quick flick detection
      const minSwipeVelocity = 0.3 // pixels per ms

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      const velocity = absX / deltaTime

      // Horizontal swipe detection
      const isHorizontalSwipe = absX > absY && absX > minSwipeDistance
      const isQuickSwipe = deltaTime < maxSwipeTime || velocity > minSwipeVelocity

      if (isHorizontalSwipe && isQuickSwipe) {
        // Journey mode swipe navigation
        if (isJourneyMode) {
          if (deltaX < 0) {
            // Swipe left - next stop
            if (journeyStep < maxJourneyStops - 1) {
              nextJourneyStop()
            }
          } else if (deltaX > 0) {
            // Swipe right - previous stop
            if (journeyStep > 0) {
              prevJourneyStop()
            }
          }
          return
        }

        // Galaxy view swipe navigation
        if (view === 'galaxy' && selectedGalaxy) {
          const currentIndex = galaxyOrder.indexOf(selectedGalaxy)

          if (deltaX > 0 && currentIndex > 0) {
            // Swipe right - previous galaxy
            zoomToGalaxy(galaxyOrder[currentIndex - 1])
          } else if (deltaX < 0 && currentIndex < galaxyOrder.length - 1) {
            // Swipe left - next galaxy
            zoomToGalaxy(galaxyOrder[currentIndex + 1])
          }
        }
      }

      // Vertical swipe down to zoom out or exit journey
      if (absY > minSwipeDistance * 2 && absY > absX && deltaY > 0) {
        if (isJourneyMode) {
          // Swipe down exits journey mode
          endJourney()
        } else if (view === 'galaxy' || view === 'project') {
          reset()
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [view, selectedGalaxy, zoomToGalaxy, reset, isJourneyMode, nextJourneyStop, prevJourneyStop, journeyStep, endJourney])

  return null
}
