'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SupernovaEffectProps {
  position: [number, number, number]
  color: string
  size: number
}

/**
 * A simplified supernova effect with:
 * - Pulsing energy core
 * - Corona rings
 * - Orbiting energy particles
 * - No ugly rectangular light rays
 */
export function SupernovaEffect({ position, color, size }: SupernovaEffectProps) {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const waveRefs = useRef<THREE.Mesh[]>([])

  // Particle system for orbiting energy - increased count for more dramatic effect
  const particleData = useMemo(() => {
    const count = 250
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = size * 1.8 + Math.random() * size * 2.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      scales[i] = 0.3 + Math.random() * 0.7
    }

    return { positions, scales, count }
  }, [size])

  // Animate everything with more dramatic effects
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Animate core pulsing - more dramatic multi-frequency pulse
    if (coreRef.current) {
      const pulse1 = Math.sin(time * 2) * 0.08
      const pulse2 = Math.sin(time * 3.7) * 0.04
      const pulse3 = Math.sin(time * 0.8) * 0.06
      const scale = 1 + pulse1 + pulse2 + pulse3
      coreRef.current.scale.setScalar(scale)
    }

    // Rotate corona with varying speed
    if (coronaRef.current) {
      coronaRef.current.rotation.z += 0.004
      coronaRef.current.rotation.y += 0.003
      coronaRef.current.rotation.x += Math.sin(time * 0.5) * 0.001
    }

    // Animate expanding waves with varied timing
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const phase = (time * 0.5 + i * 0.33) % 1
        const scale = 1 + phase * 4
        wave.scale.setScalar(scale)
        const material = wave.material as THREE.MeshBasicMaterial
        material.opacity = (1 - phase) * 0.3
      }
    })

    // Animate orbiting particles with more dynamic motion
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleData.count; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const z = positions[i3 + 2]
        const angle = 0.005 + particleData.scales[i] * 0.005

        positions[i3] = x * Math.cos(angle) - z * Math.sin(angle)
        positions[i3 + 2] = x * Math.sin(angle) + z * Math.cos(angle)
        positions[i3 + 1] += Math.sin(time * 2.5 + i) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Blazing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
        />
      </mesh>

      {/* Hot inner glow */}
      <mesh scale={1.3}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow layers */}
      <mesh scale={1.8}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={2.5}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona rings - enhanced with multiple rings */}
      <group ref={coronaRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.6, size * 0.1, 16, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[size * 2.0, size * 0.08, 16, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Additional outer corona ring */}
        <mesh rotation={[Math.PI / 4, -Math.PI / 4, 0]}>
          <torusGeometry args={[size * 2.5, size * 0.06, 16, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Inner bright ring */}
        <mesh rotation={[Math.PI / 2.2, 0, Math.PI / 8]}>
          <torusGeometry args={[size * 1.3, size * 0.12, 16, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Expanding energy waves */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`wave-${i}`}
          ref={(el) => { if (el) waveRefs.current[i] = el }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[size * 1.4, size * 1.5, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Orbiting energy particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions}
            itemSize={3}
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color={color}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Point lights for illumination - enhanced for dramatic effect */}
      <pointLight color="#ffffff" intensity={20} distance={60} decay={2} />
      <pointLight color={color} intensity={15} distance={80} decay={1.5} />
      {/* Additional ambient colored light */}
      <pointLight color={color} intensity={8} distance={100} decay={1} />
    </group>
  )
}
