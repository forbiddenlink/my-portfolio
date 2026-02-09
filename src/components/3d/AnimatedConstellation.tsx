'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'

interface ConstellationLine {
  start: THREE.Vector3
  end: THREE.Vector3
  length: number
}

/**
 * Animated constellation lines connecting Flo Labs projects
 * with flowing particles, pulsing glow, and dynamic width
 */
export function AnimatedConstellation() {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Line[]>([])
  const particlesRef = useRef<THREE.Points>(null)

  // Get Flo Labs project positions
  const constellationData = useMemo(() => {
    const floLabsProjects = galaxies
      .find(g => g.id === 'enterprise')
      ?.projects.filter(p =>
        p.id.includes('flo-labs') ||
        p.id.includes('caipo') ||
        p.id.includes('flostudios') ||
        p.id.includes('moodchanger') ||
        p.id.includes('hephaestus') ||
        p.id.includes('robocollective') ||
        p.id.includes('space-ventures') ||
        p.id.includes('tarrl')
      ) || []

    if (floLabsProjects.length < 2) return { lines: [], particleCount: 0 }

    const lines: ConstellationLine[] = []

    // Create lines between consecutive projects
    floLabsProjects.forEach((project, idx) => {
      if (idx === floLabsProjects.length - 1) return

      const nextProject = floLabsProjects[idx + 1]
      const start = new THREE.Vector3(...generateProjectPosition(
        project.id, 'enterprise', 0, idx, floLabsProjects.length
      ))
      const end = new THREE.Vector3(...generateProjectPosition(
        nextProject.id, 'enterprise', 0, idx + 1, floLabsProjects.length
      ))

      lines.push({
        start,
        end,
        length: start.distanceTo(end)
      })
    })

    // Also connect last to first for a closed loop
    if (floLabsProjects.length > 2) {
      const firstProject = floLabsProjects[0]
      const lastProject = floLabsProjects[floLabsProjects.length - 1]
      const start = new THREE.Vector3(...generateProjectPosition(
        lastProject.id, 'enterprise', 0, floLabsProjects.length - 1, floLabsProjects.length
      ))
      const end = new THREE.Vector3(...generateProjectPosition(
        firstProject.id, 'enterprise', 0, 0, floLabsProjects.length
      ))

      lines.push({
        start,
        end,
        length: start.distanceTo(end)
      })
    }

    // Calculate total particles for flowing effect (more particles on longer lines)
    const particlesPerUnit = 3
    const totalParticles = lines.reduce((sum, line) =>
      sum + Math.ceil(line.length * particlesPerUnit), 0
    )

    return { lines, particleCount: totalParticles }
  }, [])

  // Create flowing particles along lines
  const particleData = useMemo(() => {
    const { lines, particleCount } = constellationData
    if (particleCount === 0) return null

    const positions = new Float32Array(particleCount * 3)
    const lineIndices = new Float32Array(particleCount)
    const progress = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)
    const sizes = new Float32Array(particleCount)

    let particleIndex = 0

    lines.forEach((line, lineIdx) => {
      const particlesOnLine = Math.ceil(line.length * 3)

      for (let i = 0; i < particlesOnLine && particleIndex < particleCount; i++) {
        const t = i / particlesOnLine

        // Initial position along line
        const pos = new THREE.Vector3().lerpVectors(line.start, line.end, t)
        positions[particleIndex * 3] = pos.x
        positions[particleIndex * 3 + 1] = pos.y
        positions[particleIndex * 3 + 2] = pos.z

        lineIndices[particleIndex] = lineIdx
        progress[particleIndex] = t
        speeds[particleIndex] = 0.15 + Math.random() * 0.1 // Varied speeds
        sizes[particleIndex] = 0.8 + Math.random() * 0.6

        particleIndex++
      }
    })

    return { positions, lineIndices, progress, speeds, sizes, count: particleCount }
  }, [constellationData])

  // Create line objects
  useEffect(() => {
    if (!groupRef.current) return

    // Clear existing lines
    linesRef.current.forEach(line => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
      groupRef.current?.remove(line)
    })
    linesRef.current = []

    // Create new lines
    constellationData.lines.forEach((line) => {
      // Main glowing line
      const curve = new THREE.LineCurve3(line.start, line.end)
      const points = curve.getPoints(50)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      const material = new THREE.LineBasicMaterial({
        color: '#FF6B35',
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      })

      const lineObj = new THREE.Line(geometry, material)
      groupRef.current?.add(lineObj)
      linesRef.current.push(lineObj)
    })
  }, [constellationData])

  // Animate particles and lines
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Animate line opacity (pulsing)
    linesRef.current.forEach((line, i) => {
      const material = line.material as THREE.LineBasicMaterial
      const pulse = Math.sin(time * 1.5 + i * 0.5) * 0.15 + 0.45
      material.opacity = pulse
    })

    // Animate flowing particles
    if (particlesRef.current && particleData) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleData.count; i++) {
        // Update progress along line
        particleData.progress[i] += particleData.speeds[i] * 0.01

        // Wrap around
        if (particleData.progress[i] > 1) {
          particleData.progress[i] = 0
        }

        // Get line for this particle
        const lineIdx = Math.floor(particleData.lineIndices[i])
        const line = constellationData.lines[lineIdx]

        if (line) {
          // Interpolate position along line
          const t = particleData.progress[i]
          positions[i * 3] = line.start.x + (line.end.x - line.start.x) * t
          positions[i * 3 + 1] = line.start.y + (line.end.y - line.start.y) * t
          positions[i * 3 + 2] = line.start.z + (line.end.z - line.start.z) * t

          // Add slight wave motion perpendicular to line
          const perpX = -(line.end.z - line.start.z)
          const perpZ = line.end.x - line.start.x
          const perpLen = Math.sqrt(perpX * perpX + perpZ * perpZ)

          if (perpLen > 0) {
            const wave = Math.sin(time * 3 + i * 0.5) * 0.3
            positions[i * 3] += (perpX / perpLen) * wave
            positions[i * 3 + 2] += (perpZ / perpLen) * wave
          }
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (constellationData.lines.length === 0) return null

  return (
    <group ref={groupRef}>
      {/* Flowing particles */}
      {particleData && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleData.count}
              array={particleData.positions}
              itemSize={3}
              args={[particleData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-size"
              count={particleData.count}
              array={particleData.sizes}
              itemSize={1}
              args={[particleData.sizes, 1]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.5}
            color="#FF6B35"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      )}

      {/* Glow spheres at each node */}
      {constellationData.lines.map((line, i) => (
        <group key={i}>
          <mesh position={line.start}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial
              color="#FF6B35"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
