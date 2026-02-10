'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition, getGalaxyCenterPosition } from '@/lib/utils'

interface JourneyTrailProps {
  isJourneyMode: boolean
  journeyStep: number
  tourStops: Array<{
    galaxyId: string
    projectPosition: { x: number; y: number; z: number }
    galaxyPosition: { x: number; y: number; z: number }
  }>
}

// Visual trail showing the journey path through galaxies
export function JourneyTrail({
  isJourneyMode,
  journeyStep,
  tourStops
}: JourneyTrailProps) {
  const trailRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const progressRef = useRef(0)

  // Calculate all waypoints for the journey
  const waypoints = useMemo(() => {
    const points: THREE.Vector3[] = []

    tourStops.forEach((stop, index) => {
      // Galaxy center
      points.push(new THREE.Vector3(
        stop.galaxyPosition.x,
        stop.galaxyPosition.y + 10,
        stop.galaxyPosition.z
      ))

      // Project position
      points.push(new THREE.Vector3(
        stop.projectPosition.x,
        stop.projectPosition.y,
        stop.projectPosition.z
      ))
    })

    return points
  }, [tourStops])

  // Create smooth curve through waypoints
  const curve = useMemo(() => {
    if (waypoints.length < 2) return null
    return new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5)
  }, [waypoints])

  // Trail particle data
  const particleData = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      // Gradient from cyan to purple
      const t = i / count
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#00D4FF'),
        new THREE.Color('#A855F7'),
        t
      )
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.3 + Math.random() * 0.4
      speeds[i] = 0.5 + Math.random() * 0.5
    }

    return { positions, colors, sizes, speeds, count }
  }, [])

  // Trail line geometry
  const trailLine = useMemo(() => {
    if (!curve) return null

    const points = curve.getPoints(100)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // Add vertex colors for gradient
    const colors = new Float32Array(points.length * 3)
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#00D4FF'),
        new THREE.Color('#A855F7'),
        t
      )
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })

    return new THREE.Line(geometry, material)
  }, [curve])

  // Animated glow line
  const glowLine = useMemo(() => {
    if (!curve) return null

    const points = curve.getPoints(100)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const material = new THREE.LineBasicMaterial({
      color: '#00D4FF',
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      linewidth: 2
    })

    return new THREE.Line(geometry, material)
  }, [curve])

  // Calculate how much of the trail to show based on journey progress
  const getVisibleProgress = () => {
    if (!isJourneyMode) return 0
    // Each stop has 2 waypoints (galaxy + project)
    const totalWaypoints = tourStops.length * 2
    const currentWaypoint = journeyStep * 2 + 1 // +1 for being at the project
    return Math.min(currentWaypoint / totalWaypoints, 1)
  }

  // Animation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (!isJourneyMode || !curve || !particlesRef.current) return

    const visibleProgress = getVisibleProgress()
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, visibleProgress, 0.02)

    // Animate particles along the visible portion of the trail
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleData.count; i++) {
      // Calculate position along curve
      const baseT = (i / particleData.count) * progressRef.current
      const animatedT = (baseT + time * 0.02 * particleData.speeds[i]) % progressRef.current

      if (animatedT > 0 && animatedT <= progressRef.current) {
        const point = curve.getPoint(animatedT)

        // Add some wiggle
        const wiggle = Math.sin(time * 3 + i) * 0.3
        positions[i * 3] = point.x + wiggle
        positions[i * 3 + 1] = point.y + Math.cos(time * 2 + i) * 0.2
        positions[i * 3 + 2] = point.z + wiggle
      } else {
        // Hide particles beyond visible portion
        positions[i * 3] = 0
        positions[i * 3 + 1] = -1000
        positions[i * 3 + 2] = 0
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true

    // Pulse the trail line opacity
    if (trailLine) {
      const mat = trailLine.material as THREE.LineBasicMaterial
      mat.opacity = 0.3 + Math.sin(time * 2) * 0.1
    }
  })

  if (!isJourneyMode || !curve) return null

  return (
    <group ref={trailRef}>
      {/* Main trail line */}
      {trailLine && <primitive object={trailLine} />}

      {/* Glow line */}
      {glowLine && <primitive object={glowLine} />}

      {/* Animated particles along trail */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Waypoint markers */}
      {waypoints.slice(0, Math.ceil(journeyStep * 2) + 2).map((point, index) => (
        <group key={index} position={point}>
          {/* Marker dot */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? '#00D4FF' : '#A855F7'}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Marker glow */}
          <mesh scale={2}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? '#00D4FF' : '#A855F7'}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Pulse ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.6, 32]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? '#00D4FF' : '#A855F7'}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
