'use client'

import { useEffect } from 'react'
import { useViewStore } from '@/lib/store'

export function TouchGestures() {
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const galaxyOrder = [
      'enterprise',
      'creative',
      'ai-ml',
      'open-source',
      'experiments',
      'early-work',
    ]

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      touchEndY = e.changedTouches[0].screenY
      handleGesture()
    }

    const handleGesture = () => {
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const minSwipeDistance = 50

      // Horizontal swipe detection
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
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

      // Vertical swipe down to zoom out
      if (deltaY > minSwipeDistance * 2 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (view === 'galaxy' || view === 'project') {
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
  }, [view, selectedGalaxy, zoomToGalaxy, reset])

  return null
}
