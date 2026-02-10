'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidFieldProps {
  position: [number, number, number]
  innerRadius?: number
  outerRadius?: number
  count?: number
  color?: string
  rotationSpeed?: number
}

// Asteroid field ring around a planet
export function AsteroidField({
  position,
  innerRadius = 3,
  outerRadius = 5,
  count = 100,
  color = '#8B8B8B',
  rotationSpeed = 0.1,
}: AsteroidFieldProps) {
  const groupRef = useRef<THREE.Group>(null)
  const asteroidsRef = useRef<THREE.InstancedMesh>(null)

  // Generate asteroid positions in a ring
  const asteroidData = useMemo(() => {
    const dummy = new THREE.Object3D()
    const matrices = []
    const scales = []

    for (let i = 0; i < count; i++) {
      // Position in a ring
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const height = (Math.random() - 0.5) * 0.5 // Slight vertical spread

      dummy.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )

      // Random rotation
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      // Random scale (small asteroids)
      const scale = 0.02 + Math.random() * 0.06
      dummy.scale.setScalar(scale)
      scales.push(scale)

      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }

    return { matrices, scales }
  }, [count, innerRadius, outerRadius])

  // Set initial transforms
  useMemo(() => {
    if (asteroidsRef.current) {
      asteroidData.matrices.forEach((matrix, i) => {
        asteroidsRef.current!.setMatrixAt(i, matrix)
      })
      asteroidsRef.current.instanceMatrix.needsUpdate = true
    }
  }, [asteroidData])

  // Rotate the entire field
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <instancedMesh
        ref={asteroidsRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </instancedMesh>
    </group>
  )
}

// Orbiting moon component
interface MoonProps {
  planetPosition: [number, number, number]
  orbitRadius?: number
  moonSize?: number
  orbitSpeed?: number
  color?: string
  orbitTilt?: number
}

export function OrbitingMoon({
  planetPosition,
  orbitRadius = 2,
  moonSize = 0.3,
  orbitSpeed = 0.5,
  color = '#C0C0C0',
  orbitTilt = 0.3,
}: MoonProps) {
  const moonRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (moonRef.current && orbitRef.current) {
      // Orbit around planet
      const angle = time * orbitSpeed
      moonRef.current.position.x = Math.cos(angle) * orbitRadius
      moonRef.current.position.z = Math.sin(angle) * orbitRadius
      moonRef.current.position.y = Math.sin(angle * 0.5) * orbitRadius * 0.2 // Slight wobble

      // Slow rotation
      moonRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={planetPosition}>
      <group ref={orbitRef} rotation={[orbitTilt, 0, 0]}>
        {/* Orbit path (subtle) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Moon */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[moonSize, 16, 16]} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

// Binary star companion (for special projects)
interface BinaryCompanionProps {
  primaryPosition: [number, number, number]
  orbitRadius?: number
  starSize?: number
  orbitSpeed?: number
  color?: string
}

export function BinaryCompanion({
  primaryPosition,
  orbitRadius = 3,
  starSize = 0.8,
  orbitSpeed = 0.3,
  color = '#FFD700',
}: BinaryCompanionProps) {
  const starRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (starRef.current) {
      const angle = time * orbitSpeed
      starRef.current.position.x = primaryPosition[0] + Math.cos(angle) * orbitRadius
      starRef.current.position.y = primaryPosition[1] + Math.sin(angle * 0.3) * 0.5
      starRef.current.position.z = primaryPosition[2] + Math.sin(angle) * orbitRadius
    }

    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.1
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={starRef}>
      {/* Core star */}
      <mesh>
        <sphereGeometry args={[starSize, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[starSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color={color}
        intensity={1}
        distance={10}
        decay={2}
      />
    </group>
  )
}
