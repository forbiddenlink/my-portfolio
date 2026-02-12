'use client'

import { useMotionStore, usePrefersReducedMotion } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MotionToggle() {
  const reducedMotion = usePrefersReducedMotion()
  const manualOverride = useMotionStore((state) => state.manualReducedMotion)
  const setManualReducedMotion = useMotionStore((state) => state.setManualReducedMotion)

  const cycleMotionPreference = () => {
    if (manualOverride === null) {
      // Currently following OS → force reduced motion
      setManualReducedMotion(true)
    } else if (manualOverride === true) {
      // Currently forced reduced → force full motion
      setManualReducedMotion(false)
    } else {
      // Currently forced full → back to OS preference
      setManualReducedMotion(null)
    }
  }

  const getLabel = () => {
    if (manualOverride === null) return 'Auto'
    if (manualOverride) return 'Reduced'
    return 'Full'
  }

  const getIcon = () => {
    if (reducedMotion) {
      // Reduced motion - static icon
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    }
    // Full motion - animated icon
    return (
      <svg
        className="w-4 h-4 animate-spin-slow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    )
  }

  return (
    <button
      onClick={cycleMotionPreference}
      className={cn(
        'fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full',
        'bg-black/60 backdrop-blur-md border border-white/10',
        'text-white/80 hover:text-white hover:bg-black/70',
        'transition-all duration-200 text-xs font-medium',
        'shadow-lg hover:shadow-xl'
      )}
      aria-label={`Motion preference: ${getLabel()}. Click to cycle through options.`}
      title={`Motion: ${getLabel()} (click to change)`}
    >
      {getIcon()}
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  )
}
