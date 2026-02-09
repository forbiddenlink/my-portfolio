'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Floating space dust particles for depth and realism
 */
export function SpaceDust() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, sizes, colors } = useMemo(() => {
    const count = 3000 // Increased particle count
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 50 + Math.random() * 300 // Larger spread

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random slow velocities with variation
      velocities[i * 3] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003

      // Variable particle sizes for depth
      sizes[i] = Math.random() * 0.2 + 0.05

      // Subtle color variation (mostly blue-white with hints of other colors)
      const colorVariation = Math.random()
      if (colorVariation < 0.7) {
        // Blue-white dust (most common)
        colors[i * 3] = 0.6 + Math.random() * 0.4
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 2] = 1.0
      } else if (colorVariation < 0.9) {
        // Warm dust particles (nebula influence)
        colors[i * 3] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3
      } else {
        // Purple-tinted particles
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
      }
    }

    return { positions, velocities, sizes, colors }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Wrap around boundaries
      const radius = 200
      if (Math.abs(pos[i * 3]) > radius) velocities[i * 3] *= -1
      if (Math.abs(pos[i * 3 + 1]) > radius) velocities[i * 3 + 1] *= -1
      if (Math.abs(pos[i * 3 + 2]) > radius) velocities[i * 3 + 2] *= -1
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          args={[sizes, 1]}
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          args={[colors, 3]}
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
