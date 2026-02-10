'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TourCometProps {
  isActive: boolean
  startPosition?: [number, number, number]
  endPosition?: [number, number, number]
  color?: string
  speed?: number
  onComplete?: () => void
}

// Dramatic comet that flies across during tour transitions
export function TourComet({
  isActive,
  startPosition,
  endPosition,
  color = '#00D4FF',
  speed = 40,
  onComplete
}: TourCometProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isFlying, setIsFlying] = useState(false)
  const progressRef = useRef(0)

  // Generate random path if not specified
  const path = useMemo(() => {
    const start = startPosition || [
      (Math.random() - 0.5) * 200,
      50 + Math.random() * 50,
      (Math.random() - 0.5) * 200
    ] as [number, number, number]

    const end = endPosition || [
      (Math.random() - 0.5) * 200,
      -20 + Math.random() * 20,
      (Math.random() - 0.5) * 200
    ] as [number, number, number]

    return { start, end }
  }, [startPosition, endPosition])

  // Calculate direction and distance
  const pathData = useMemo(() => {
    const direction = new THREE.Vector3(
      path.end[0] - path.start[0],
      path.end[1] - path.start[1],
      path.end[2] - path.start[2]
    )
    const distance = direction.length()
    direction.normalize()

    return { direction, distance }
  }, [path])

  // Trail line object (created once)
  const trailLine = useMemo(() => {
    const positions = new Float32Array(60 * 3) // 60 trail points
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    return new THREE.Line(geometry, material)
  }, [color])

  // Comet colors
  const cometColor = useMemo(() => new THREE.Color(color), [color])
  const coreColor = useMemo(() => new THREE.Color('#FFFFFF'), [])

  // Start flying when activated
  useEffect(() => {
    if (isActive && !isFlying) {
      setIsFlying(true)
      progressRef.current = 0
    }
  }, [isActive, isFlying])

  // Animation loop
  useFrame((state, delta) => {
    if (!isFlying || !groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Update progress
    progressRef.current += (delta * speed) / pathData.distance

    if (progressRef.current >= 1) {
      setIsFlying(false)
      progressRef.current = 0
      onComplete?.()
      return
    }

    // Calculate current position
    const t = progressRef.current
    const currentPos = new THREE.Vector3(
      path.start[0] + (path.end[0] - path.start[0]) * t,
      path.start[1] + (path.end[1] - path.start[1]) * t,
      path.start[2] + (path.end[2] - path.start[2]) * t
    )

    // Add slight wobble
    currentPos.x += Math.sin(time * 10) * 0.5
    currentPos.y += Math.cos(time * 8) * 0.3

    groupRef.current.position.copy(currentPos)

    // Orient towards movement direction
    groupRef.current.lookAt(
      currentPos.x + pathData.direction.x,
      currentPos.y + pathData.direction.y,
      currentPos.z + pathData.direction.z
    )

    // Update trail
    if (trailLine) {
      const positions = trailLine.geometry.attributes.position.array as Float32Array
      const trailLength = 60

      // Shift all positions back
      for (let i = trailLength - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3]
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1]
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2]
      }

      // Add current position at front
      positions[0] = currentPos.x
      positions[1] = currentPos.y
      positions[2] = currentPos.z

      trailLine.geometry.attributes.position.needsUpdate = true
    }
  })

  if (!isFlying) return null

  return (
    <>
      {/* Comet head */}
      <group ref={groupRef}>
        {/* Bright core */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color={coreColor} />
        </mesh>

        {/* Inner glow */}
        <mesh scale={1.5}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial
            color={cometColor}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Outer glow */}
        <mesh scale={3}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshBasicMaterial
            color={cometColor}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Coma (fuzzy halo) */}
        <mesh scale={5}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshBasicMaterial
            color={cometColor}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Point light */}
        <pointLight color={cometColor} intensity={3} distance={30} />
        <pointLight color={coreColor} intensity={2} distance={15} />
      </group>

      {/* Trail */}
      <primitive object={trailLine} />
    </>
  )
}

// Manager for multiple comets during tour
export function TourCometManager({
  isJourneyMode,
  journeyStep
}: {
  isJourneyMode: boolean
  journeyStep: number
}) {
  const [activeComets, setActiveComets] = useState<number[]>([])
  const lastStepRef = useRef(journeyStep)

  // Spawn comet on step change
  useEffect(() => {
    if (isJourneyMode && journeyStep !== lastStepRef.current) {
      lastStepRef.current = journeyStep

      // Random chance to spawn comet on transition
      if (Math.random() > 0.3) {
        const cometId = Date.now()
        setActiveComets(prev => [...prev, cometId])

        // Remove after animation completes
        setTimeout(() => {
          setActiveComets(prev => prev.filter(id => id !== cometId))
        }, 5000)
      }
    }
  }, [isJourneyMode, journeyStep])

  // Clear comets when journey ends
  useEffect(() => {
    if (!isJourneyMode) {
      setActiveComets([])
    }
  }, [isJourneyMode])

  const colors = ['#00D4FF', '#FF6B9D', '#A855F7', '#FFD700', '#00FF88']

  return (
    <>
      {activeComets.map((id, index) => (
        <TourComet
          key={id}
          isActive={true}
          color={colors[index % colors.length]}
          speed={30 + Math.random() * 30}
        />
      ))}
    </>
  )
}
