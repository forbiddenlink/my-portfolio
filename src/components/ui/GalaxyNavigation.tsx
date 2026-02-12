'use client'

import { useState } from 'react'
import { galaxies, narrativeTours } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function GalaxyNavigation() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const startJourney = useViewStore((state) => state.startJourney)
  const [showTourMenu, setShowTourMenu] = useState(false)

  // Hide during exploration mode and journey mode for immersion
  if (view === 'exploration' || isJourneyMode) return null

  return (
    <div className="fixed left-6 top-[380px] z-40 hidden lg:block">
      {/* Animated border container */}
      <div className="relative rounded-2xl p-[1px] overflow-hidden">
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.5), rgba(99, 102, 241, 0.5))',
            backgroundSize: '300% 100%',
            animation: 'gradient-border-flow 6s linear infinite',
          }}
        />

        {/* Inner content */}
        <div
          className="relative rounded-2xl shadow-2xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(10, 5, 30, 0.7) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            padding: '1rem'
          }}
        >
          {/* Glass morphism inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

          {/* Subtle animated glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            }}
          />

          <nav className="flex flex-col gap-1.5 relative z-10">
            {/* Universe view */}
            <button
              onClick={reset}
              className={cn(
                'ripple-button group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 relative overflow-hidden min-h-[44px]',
                view === 'universe'
                  ? 'bg-white/20 shadow-lg scale-105 backdrop-blur-sm'
                  : 'hover:bg-white/10 hover:scale-105'
              )}
              aria-label="View all galaxies"
            >
              <div className={cn(
                'w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-300',
                view === 'universe' ? 'animate-pulse' : 'group-hover:scale-125'
              )} />
              <span className="text-sm font-semibold text-white transition-all duration-300 whitespace-nowrap leading-none">
                All Galaxies
              </span>
            </button>

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-0" />

            {/* Galaxy buttons */}
            {galaxies.map((galaxy) => (
              <button
                key={galaxy.id}
                onClick={() => zoomToGalaxy(galaxy.id)}
                className={cn(
                  'ripple-button group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 relative overflow-hidden min-h-[44px]',
                  selectedGalaxy === galaxy.id
                    ? 'bg-white/20 shadow-lg scale-105 backdrop-blur-sm'
                    : 'hover:bg-white/10 hover:scale-105'
                )}
                aria-label={`View ${galaxy.name}`}
              >
                <div
                  className={cn(
                    'w-3 h-3 rounded-full shadow-lg transition-all duration-300',
                    selectedGalaxy === galaxy.id ? 'animate-pulse' : 'group-hover:scale-125'
                  )}
                  style={{
                    backgroundColor: galaxy.color,
                    boxShadow: `0 0 ${selectedGalaxy === galaxy.id ? 15 : 10}px ${galaxy.color}`
                  }}
                />
                <span className="text-sm font-semibold text-white transition-all duration-300 whitespace-nowrap leading-none">
                  {galaxy.id === 'ai' ? 'AI' : galaxy.id === 'experimental' ? 'Lab' : galaxy.name.split(' ')[0]}
                </span>
              </button>
            ))}

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-0" />

            {/* Tours Section */}
            <div className="relative">
              {/* Tour Toggle Button */}
              <button
                onClick={() => setShowTourMenu(!showTourMenu)}
                className={cn(
                  'ripple-button group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 relative overflow-hidden min-h-[44px] w-full',
                  showTourMenu
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                    : 'hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:scale-105'
                )}
                aria-label="Show tour options"
                aria-expanded={showTourMenu}
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors"
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
                </div>
                <span className="text-sm font-semibold text-indigo-300 group-hover:text-indigo-200 transition-all duration-300 whitespace-nowrap leading-none flex-1 text-left">
                  Guided Tours
                </span>
                <svg
                  className={cn(
                    'w-4 h-4 text-indigo-400 transition-transform duration-300',
                    showTourMenu ? 'rotate-180' : ''
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tour Options Menu */}
              {showTourMenu && (
                <div className="mt-2 space-y-1 animate-fade-in">
                  {/* Default Galaxy Tour */}
                  <button
                    onClick={() => {
                      startJourney()
                      setShowTourMenu(false)
                    }}
                    className="w-full group flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 text-left"
                  >
                    <span className="text-lg">🌌</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/90">Galaxy Overview</div>
                      <div className="text-xs text-white/50 truncate">Visit each galaxy&apos;s highlights</div>
                    </div>
                  </button>

                  {/* Narrative Tours */}
                  {narrativeTours.map((tour) => (
                    <button
                      key={tour.id}
                      onClick={() => {
                        startJourney(tour.id)
                        setShowTourMenu(false)
                      }}
                      className="w-full group flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 text-left"
                    >
                      <span className="text-lg">{tour.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: tour.color }}>{tour.name}</div>
                        <div className="text-xs text-white/50 truncate">{tour.tagline}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
