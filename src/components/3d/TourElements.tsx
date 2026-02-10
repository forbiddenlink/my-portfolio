'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useViewStore } from '@/lib/store'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition, getGalaxyCenterPosition } from '@/lib/utils'
import { AlienCharacter, AlienVariant1, AlienVariant2, AlienVariant3, AlienVariant4, AlienVariant5 } from './AlienCharacter'
import { SpaceStation, Satellite } from './SpaceStation'
import { TourCometManager } from './TourComet'
import { JourneyTrail } from './JourneyTrail'
import { WormholeEffect } from './WormholeEffect'

// Generate tour stops data (matching JourneyMode.tsx)
const TOUR_STOPS = galaxies.map((galaxy, galaxyIndex) => {
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

// Alien color variants based on galaxy
const ALIEN_VARIANTS = [
  AlienVariant1, // Green - Enterprise
  AlienVariant3, // Cyan - AI
  AlienVariant2, // Pink - Creative
  AlienVariant4, // Gold - Gaming
  AlienVariant5, // Purple - Learning
  AlienVariant1, // Green - Personal
]

// Main tour elements component
export function TourElements() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const journeyStep = useViewStore((state) => state.journeyStep)

  // Track previous step to detect galaxy-to-galaxy transitions
  const prevStepRef = useRef(journeyStep)
  const [wormholeActive, setWormholeActive] = useState(false)
  const [wormholePositions, setWormholePositions] = useState<{
    start: [number, number, number]
    end: [number, number, number]
  } | null>(null)

  // Detect galaxy transitions and trigger wormhole
  useEffect(() => {
    if (!isJourneyMode) {
      setWormholeActive(false)
      setWormholePositions(null)
      prevStepRef.current = 0
      return
    }

    const prevStep = prevStepRef.current
    const currentStop = TOUR_STOPS[journeyStep]
    const prevStop = TOUR_STOPS[prevStep]

    // Check if we're transitioning between different galaxies
    if (prevStop && currentStop && prevStop.galaxyId !== currentStop.galaxyId) {
      // Set wormhole positions between galaxy centers
      setWormholePositions({
        start: [
          prevStop.galaxyPosition.x,
          prevStop.galaxyPosition.y,
          prevStop.galaxyPosition.z
        ],
        end: [
          currentStop.galaxyPosition.x,
          currentStop.galaxyPosition.y,
          currentStop.galaxyPosition.z
        ]
      })
      setWormholeActive(true)
    }

    prevStepRef.current = journeyStep
  }, [journeyStep, isJourneyMode])

  // Handle wormhole completion
  const handleWormholeComplete = () => {
    setWormholeActive(false)
  }

  // Calculate alien positions - near featured projects
  const alienPositions = useMemo(() => {
    return TOUR_STOPS.map((stop, index) => {
      // Position alien slightly to the side and above the planet
      const planetSize = stop.project.size === 'supermassive' ? 5 :
                        stop.project.size === 'large' ? 3 : 2
      return {
        position: [
          stop.projectPosition.x + planetSize + 1,
          stop.projectPosition.y + planetSize * 0.5,
          stop.projectPosition.z
        ] as [number, number, number],
        scale: planetSize * 0.3,
        galaxyId: stop.galaxyId
      }
    })
  }, [])

  // Space stations for enterprise projects
  const stationPositions = useMemo(() => {
    return TOUR_STOPS
      .filter(stop => stop.galaxyId === 'enterprise')
      .map(stop => ({
        position: [
          stop.projectPosition.x,
          stop.projectPosition.y,
          stop.projectPosition.z
        ] as [number, number, number],
        orbitRadius: 4,
        color: stop.galaxyColor
      }))
  }, [])

  // Satellites for AI projects
  const satellitePositions = useMemo(() => {
    return TOUR_STOPS
      .filter(stop => stop.galaxyId === 'ai')
      .map(stop => ({
        position: [
          stop.projectPosition.x,
          stop.projectPosition.y,
          stop.projectPosition.z
        ] as [number, number, number],
        orbitRadius: 3
      }))
  }, [])

  if (!isJourneyMode) return null

  return (
    <>
      {/* Wormhole effect for galaxy-to-galaxy transitions */}
      {wormholePositions && (
        <WormholeEffect
          isActive={wormholeActive}
          startPosition={wormholePositions.start}
          endPosition={wormholePositions.end}
          onComplete={handleWormholeComplete}
        />
      )}

      {/* Journey trail showing path */}
      <JourneyTrail
        isJourneyMode={isJourneyMode}
        journeyStep={journeyStep}
        tourStops={TOUR_STOPS}
      />

      {/* Comets during transitions */}
      <TourCometManager
        isJourneyMode={isJourneyMode}
        journeyStep={journeyStep}
      />

      {/* Aliens waving at each tour stop */}
      {alienPositions.map((alien, index) => {
        // Only show alien when we're at or past their stop
        const isVisible = journeyStep >= index
        const AlienComponent = ALIEN_VARIANTS[index % ALIEN_VARIANTS.length]

        return isVisible ? (
          <AlienComponent
            key={`alien-${index}`}
            position={alien.position}
            scale={alien.scale}
            isWaving={journeyStep === index} // Only wave when we're at this stop
          />
        ) : null
      })}

      {/* Space stations orbiting enterprise projects */}
      {stationPositions.map((station, index) => (
        <SpaceStation
          key={`station-${index}`}
          position={station.position}
          orbitRadius={station.orbitRadius}
          color={station.color}
          scale={0.5}
        />
      ))}

      {/* Satellites orbiting AI projects */}
      {satellitePositions.map((satellite, index) => (
        <Satellite
          key={`satellite-${index}`}
          position={satellite.position}
          orbitRadius={satellite.orbitRadius}
          orbitSpeed={0.4 + index * 0.1}
          scale={0.4}
        />
      ))}
    </>
  )
}

// Export tour stops for other components
export { TOUR_STOPS }
