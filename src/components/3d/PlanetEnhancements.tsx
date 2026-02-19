'use client'

import { useMemo, useRef } from 'react'
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

  // Use refs for group visibility - avoids React re-renders that cause flickering
  const asteroidRefs = useRef<(THREE.Group | null)[]>([])
  const moonRefs = useRef<(THREE.Group | null)[]>([])
  const binaryRefs = useRef<(THREE.Group | null)[]>([])

  // Pre-compute position vectors to avoid creating new objects every frame
  const positionVectors = useRef<{
    asteroids: THREE.Vector3[]
    moons: THREE.Vector3[]
    binaries: THREE.Vector3[]
  } | null>(null)

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

    // Initialize position vectors for distance calculations
    positionVectors.current = {
      asteroids: asteroidFields.map(f => new THREE.Vector3(...f.position)),
      moons: moons.map(m => new THREE.Vector3(...m.position)),
      binaries: binaryStars.map(b => new THREE.Vector3(...b.position)),
    }

    return { asteroidFields, moons, binaryStars }
  }, [])

  // Update visibility imperatively in useFrame - no setState, no re-renders
  useFrame(() => {
    const vectors = positionVectors.current
    if (!vectors) return

    // Update asteroid field visibility
    vectors.asteroids.forEach((pos, index) => {
      const group = asteroidRefs.current[index]
      if (group) {
        const dist = camera.position.distanceTo(pos)
        group.visible = dist < ENHANCEMENT_RENDER_DISTANCE
      }
    })

    // Update moon visibility
    vectors.moons.forEach((pos, index) => {
      const group = moonRefs.current[index]
      if (group) {
        const dist = camera.position.distanceTo(pos)
        group.visible = dist < ENHANCEMENT_RENDER_DISTANCE
      }
    })

    // Update binary star visibility
    vectors.binaries.forEach((pos, index) => {
      const group = binaryRefs.current[index]
      if (group) {
        const dist = camera.position.distanceTo(pos)
        group.visible = dist < ENHANCEMENT_RENDER_DISTANCE
      }
    })
  })

  return (
    <>
      {/* Asteroid fields around supermassive planets - always render, control visibility via ref */}
      {enhancements.asteroidFields.map((field, index) => (
        <group
          key={`asteroid-${index}`}
          ref={(el) => { asteroidRefs.current[index] = el }}
          visible={false}
        >
          <AsteroidField
            position={field.position}
            innerRadius={field.innerRadius}
            outerRadius={field.outerRadius}
            color={field.color}
            count={80}
            rotationSpeed={0.08}
          />
        </group>
      ))}

      {/* Moons orbiting large featured planets - always render, control visibility via ref */}
      {enhancements.moons.map((moon, index) => (
        <group
          key={`moon-${index}`}
          ref={(el) => { moonRefs.current[index] = el }}
          visible={false}
        >
          <OrbitingMoon
            planetPosition={moon.position}
            orbitRadius={moon.orbitRadius}
            moonSize={0.25}
            orbitSpeed={0.4}
            color={moon.color}
          />
        </group>
      ))}

      {/* Binary companions for special projects - always render, control visibility via ref */}
      {enhancements.binaryStars.map((binary, index) => (
        <group
          key={`binary-${index}`}
          ref={(el) => { binaryRefs.current[index] = el }}
          visible={false}
        >
          <BinaryCompanion
            primaryPosition={binary.position}
            orbitRadius={3}
            starSize={0.5}
            orbitSpeed={0.25}
            color={binary.color}
          />
        </group>
      ))}
    </>
  )
}
