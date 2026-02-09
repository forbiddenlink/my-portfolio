'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LensFlareProps {
  position: [number, number, number]
  color: string
  intensity?: number
}

export function LensFlare({ position, color, intensity = 1 }: LensFlareProps) {
  const flareRefs = useRef<THREE.Mesh[]>([])

  useFrame(({ camera }) => {
    // Calculate screen position for lens flare effect
    const flarePos = new THREE.Vector3(...position)
    const screenPos = flarePos.project(camera)
    
    // Update flare positions based on screen space
    flareRefs.current.forEach((flare, i) => {
      if (flare) {
        const offset = (i + 1) * 0.3
        flare.position.set(
          position[0] + screenPos.x * offset * 2,
          position[1] + screenPos.y * offset * 2,
          position[2] - 5 - i * 2
        )
        
        // Fade based on distance from center
        const distFromCenter = Math.sqrt(screenPos.x ** 2 + screenPos.y ** 2)
        const opacity = Math.max(0, 1 - distFromCenter * 0.5) * intensity
        ;(flare.material as THREE.MeshBasicMaterial).opacity = opacity * (0.3 - i * 0.05)
      }
    })
  })

  return (
    <group>
      {/* Primary glow */}
      <sprite position={position} scale={[4, 4, 1]}>
        <spriteMaterial
          color={color}
          transparent
          opacity={0.4 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Lens flare elements */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) flareRefs.current[i] = el
          }}
        >
          <circleGeometry args={[0.3 - i * 0.05, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3 - i * 0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Hexagonal flares */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`hex-${i}`}
          position={[
            position[0] + i * 1.5,
            position[1] - i * 0.5,
            position[2] - 3
          ]}
          rotation={[0, 0, (Math.PI / 6) * i]}
        >
          <circleGeometry args={[0.4, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
