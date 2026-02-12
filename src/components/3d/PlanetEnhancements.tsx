'use client'

import { useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import { AsteroidField, OrbitingMoon, BinaryCompanion } from './AsteroidField'
import * as THREE from 'three'

// Distance threshold for rendering enhancements
const ENHANCEMENT_RENDER_DISTANCE = 50

// Add visual enhancements to specific planets based on their properties
export function PlanetEnhancements() {
  const { camera } = useThree()
  const [visibleEnhancements, setVisibleEnhancements] = useState<Set<string>>(new Set())
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

  // Check distances every few frames and update visibility
  useFrame(() => {
    const newVisible = new Set<string>()

    // Check asteroid fields
    enhancements.asteroidFields.forEach((field, index) => {
      const dist = camera.position.distanceTo(new THREE.Vector3(...field.position))
      if (dist < ENHANCEMENT_RENDER_DISTANCE) {
        newVisible.add(`asteroid-${index}`)
      }
    })

    // Check moons
    enhancements.moons.forEach((moon, index) => {
      const dist = camera.position.distanceTo(new THREE.Vector3(...moon.position))
      if (dist < ENHANCEMENT_RENDER_DISTANCE) {
        newVisible.add(`moon-${index}`)
      }
    })

    // Check binary stars
    enhancements.binaryStars.forEach((binary, index) => {
      const dist = camera.position.distanceTo(new THREE.Vector3(...binary.position))
      if (dist < ENHANCEMENT_RENDER_DISTANCE) {
        newVisible.add(`binary-${index}`)
      }
    })

    // Only update state if changed
    if (newVisible.size !== visibleEnhancements.size ||
        ![...newVisible].every(key => visibleEnhancements.has(key))) {
      setVisibleEnhancements(newVisible)
    }
  })

  return (
    <>
      {/* Asteroid fields around supermassive planets - only render when close */}
      {enhancements.asteroidFields.map((field, index) =>
        visibleEnhancements.has(`asteroid-${index}`) ? (
          <AsteroidField
            key={`asteroid-${index}`}
            position={field.position}
            innerRadius={field.innerRadius}
            outerRadius={field.outerRadius}
            color={field.color}
            count={80}
            rotationSpeed={0.08}
          />
        ) : null
      )}

      {/* Moons orbiting large featured planets - only render when close */}
      {enhancements.moons.map((moon, index) =>
        visibleEnhancements.has(`moon-${index}`) ? (
          <OrbitingMoon
            key={`moon-${index}`}
            planetPosition={moon.position}
            orbitRadius={moon.orbitRadius}
            moonSize={0.25}
            orbitSpeed={0.4}
            color={moon.color}
          />
        ) : null
      )}

      {/* Binary companions for special projects - only render when close */}
      {enhancements.binaryStars.map((binary, index) =>
        visibleEnhancements.has(`binary-${index}`) ? (
          <BinaryCompanion
            key={`binary-${index}`}
            primaryPosition={binary.position}
            orbitRadius={3}
            starSize={0.5}
            orbitSpeed={0.25}
            color={binary.color}
          />
        ) : null
      )}
    </>
  )
}
