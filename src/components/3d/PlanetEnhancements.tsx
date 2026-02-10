'use client'

import { useMemo } from 'react'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import { AsteroidField, OrbitingMoon, BinaryCompanion } from './AsteroidField'

// Add visual enhancements to specific planets based on their properties
export function PlanetEnhancements() {
  // Find projects that should have special effects
  const enhancements = useMemo(() => {
    const asteroidFields: Array<{
      position: [number, number, number]
      innerRadius: number
      outerRadius: number
      color: string
    }> = []

    const moons: Array<{
      position: [number, number, number]
      orbitRadius: number
      color: string
    }> = []

    const binaryStars: Array<{
      position: [number, number, number]
      color: string
    }> = []

    galaxies.forEach((galaxy, galaxyIndex) => {
      galaxy.projects.forEach((project, projectIndex) => {
        const [x, y, z] = generateProjectPosition(
          project.id,
          galaxy.id,
          galaxyIndex,
          projectIndex,
          galaxy.projects.length
        )
        const position: [number, number, number] = [x, y, z]

        // Supermassive planets get asteroid fields
        if (project.size === 'supermassive') {
          asteroidFields.push({
            position,
            innerRadius: 6,
            outerRadius: 8,
            color: galaxy.color,
          })
        }

        // Large featured planets get moons
        if (project.size === 'large' && project.featured) {
          moons.push({
            position,
            orbitRadius: 4,
            color: '#C0C0C0',
          })
        }

        // Specific special projects get binary companions
        // (projects with AI tag in Enterprise galaxy)
        if (
          galaxy.id === 'ai' &&
          project.featured &&
          project.size !== 'supermassive'
        ) {
          binaryStars.push({
            position,
            color: '#00D9FF',
          })
        }
      })
    })

    return { asteroidFields, moons, binaryStars }
  }, [])

  return (
    <>
      {/* Asteroid fields around supermassive planets */}
      {enhancements.asteroidFields.map((field, index) => (
        <AsteroidField
          key={`asteroid-${index}`}
          position={field.position}
          innerRadius={field.innerRadius}
          outerRadius={field.outerRadius}
          color={field.color}
          count={80}
          rotationSpeed={0.08}
        />
      ))}

      {/* Moons orbiting large featured planets */}
      {enhancements.moons.map((moon, index) => (
        <OrbitingMoon
          key={`moon-${index}`}
          planetPosition={moon.position}
          orbitRadius={moon.orbitRadius}
          moonSize={0.25}
          orbitSpeed={0.4}
          color={moon.color}
        />
      ))}

      {/* Binary companions for special projects */}
      {enhancements.binaryStars.map((binary, index) => (
        <BinaryCompanion
          key={`binary-${index}`}
          primaryPosition={binary.position}
          orbitRadius={3}
          starSize={0.5}
          orbitSpeed={0.25}
          color={binary.color}
        />
      ))}
    </>
  )
}
