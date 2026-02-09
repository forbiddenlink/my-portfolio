import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'
import { z } from 'zod'

export const planetShowcaseSchema = z.object({
  projectId: z.string(),
  color: z.string(),
})

type PlanetShowcaseProps = z.infer<typeof planetShowcaseSchema>

// Rotating planet showcase
function ShowcasePlanet({ frame, color, size }: { frame: number; color: string; size: number }) {
  const rotation = frame * 0.02

  const scale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 60 },
  })

  return (
    <group scale={scale}>
      {/* Main planet */}
      <mesh rotation={[0.3, rotation, 0]}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={1.35}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rings */}
      <group rotation={[Math.PI / 2.5, 0, rotation * 0.5]}>
        <mesh>
          <ringGeometry args={[size * 1.5, size * 1.9, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[size * 2.0, size * 2.4, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Point light */}
      <pointLight color={color} intensity={5} distance={20} />
    </group>
  )
}

export const PlanetShowcase: React.FC<PlanetShowcaseProps> = ({ projectId, color }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  // Camera orbit
  const cameraX = Math.sin(frame * 0.02) * 8
  const cameraZ = Math.cos(frame * 0.02) * 8 + 15

  // Title animation
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#000008' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [cameraX, 2, cameraZ], fov: 45 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        <ShowcasePlanet frame={frame} color={color} size={3} />
      </ThreeCanvas>

      {/* Project label */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 80,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: 'white',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            {projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
