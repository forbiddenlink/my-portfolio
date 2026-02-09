'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GodRaysProps {
  position: [number, number, number]
  color: string
  count?: number
  length?: number
  spread?: number
}

export function GodRays({
  position,
  color,
  count = 12,
  length = 20,
  spread = 0.5
}: GodRaysProps) {
  const groupRef = useRef<THREE.Group>(null)

  const rays = useMemo(() => {
    const raysArray = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * spread
      const z = Math.sin(angle) * spread
      raysArray.push({
        direction: new THREE.Vector3(x, -1, z).normalize(),
        offset: Math.random() * Math.PI * 2
      })
    }
    return raysArray
  }, [count, spread])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow rotation for dynamic effect
      groupRef.current.rotation.y = clock.elapsedTime * 0.1
      
      // Subtle scale pulse
      const pulse = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.05
      groupRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[
            Math.atan2(
              Math.sqrt(ray.direction.x ** 2 + ray.direction.z ** 2),
              -ray.direction.y
            ),
            Math.atan2(ray.direction.x, ray.direction.z),
            0
          ]}
        >
          <coneGeometry args={[0.05, length, 4, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
