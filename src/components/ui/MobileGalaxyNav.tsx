'use client'

import { galaxies } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MobileGalaxyNav() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const startJourney = useViewStore((state) => state.startJourney)

  // Hide during exploration mode and journey mode
  if (view === 'exploration' || isJourneyMode) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-bottom">
      {/* Background with blur */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      />

      {/* Navigation content */}
      <nav className="relative flex items-center justify-around px-2 py-3">
        {/* All Galaxies */}
        <button
          onClick={reset}
          className={cn(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
            view === 'universe'
              ? 'bg-white/20 scale-105'
              : 'hover:bg-white/10 active:scale-95'
          )}
          aria-label="View all galaxies"
        >
          <div className={cn(
            'w-3 h-3 rounded-full bg-white shadow-lg',
            view === 'universe' && 'animate-pulse'
          )} />
          <span className="text-[10px] font-medium text-white/80">All</span>
        </button>

        {/* Galaxy buttons - scrollable */}
        <div className="flex items-center gap-1 overflow-x-auto px-2 max-w-[calc(100%-140px)] scrollbar-hide">
          {galaxies.map((galaxy) => (
            <button
              key={galaxy.id}
              onClick={() => zoomToGalaxy(galaxy.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[50px] flex-shrink-0',
                selectedGalaxy === galaxy.id
                  ? 'bg-white/20 scale-105'
                  : 'hover:bg-white/10 active:scale-95'
              )}
              aria-label={`View ${galaxy.name}`}
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full shadow-lg',
                  selectedGalaxy === galaxy.id && 'animate-pulse'
                )}
                style={{
                  backgroundColor: galaxy.color,
                  boxShadow: `0 0 ${selectedGalaxy === galaxy.id ? 12 : 8}px ${galaxy.color}`
                }}
              />
              <span className="text-[10px] font-medium text-white/80 truncate max-w-[40px]">
                {galaxy.id === 'ai' ? 'AI' : galaxy.id === 'experimental' ? 'Lab' : galaxy.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Tour button */}
        <button
          onClick={startJourney}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] hover:bg-white/10 active:scale-95"
          aria-label="Take the guided tour"
        >
          <svg
            className="w-4 h-4 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[10px] font-medium text-indigo-300">Tour</span>
        </button>
      </nav>
    </div>
  )
}
