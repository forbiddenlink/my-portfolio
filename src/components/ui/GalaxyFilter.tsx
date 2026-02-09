'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GalaxyFilterProps {
  galaxies: { id: string; name: string; color: string }[]
  selectedGalaxy: string | null
  onFilterChange: (galaxyId: string | null) => void
}

export function GalaxyFilter({ galaxies, selectedGalaxy, onFilterChange }: GalaxyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        onClick={() => onFilterChange(null)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm transition-all duration-200 border',
          selectedGalaxy === null
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
        )}
        aria-pressed={selectedGalaxy === null}
      >
        All
      </button>
      {galaxies.map((galaxy) => (
        <button
          key={galaxy.id}
          onClick={() => onFilterChange(galaxy.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm transition-all duration-200 border flex items-center gap-2',
            selectedGalaxy === galaxy.id
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
          )}
          aria-pressed={selectedGalaxy === galaxy.id}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: galaxy.color }}
            aria-hidden="true"
          />
          {galaxy.name}
        </button>
      ))}
    </div>
  )
}
