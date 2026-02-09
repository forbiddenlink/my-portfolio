import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'
import { z } from 'zod'

export const galaxyIntroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
})

export type GalaxyIntroProps = z.infer<typeof galaxyIntroSchema>

// Simple starfield for Remotion (no useFrame - driven by useCurrentFrame)
function StarField({ frame }: { frame: number }) {
  const stars = React.useMemo(() =>
    Array.from({ length: 200 }, (_, i) => {
      const x = (Math.sin(i * 0.1) * 50) + Math.cos(i * 0.2) * 30
      const y = (Math.cos(i * 0.15) * 50) + Math.sin(i * 0.25) * 30
      const z = -100 + (i % 100) * 2
      return { x, y, z, size: 0.1 + (i % 10) * 0.02 }
    }), []
  )

  return (
    <group rotation={[0, frame * 0.001, 0]}>
      {stars.map((star, i) => (
        <mesh key={i} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

// Animated planet for intro
function IntroPlanet({ frame, color }: { frame: number; color: string }) {
  const scale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 15, stiffness: 80 },
  })

  const rotation = frame * 0.01

  return (
    <group scale={scale}>
      <mesh rotation={[0.2, rotation, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      {/* Glow */}
      <mesh scale={1.2}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export const GalaxyIntro: React.FC<GalaxyIntroProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  // Title animation
  const titleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const titleY = interpolate(frame, [30, 60], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Subtitle animation (delayed)
  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Camera zoom
  const cameraZ = interpolate(frame, [0, 150], [80, 20], {
    extrapolateRight: 'clamp',
  })

  // Suppress unused variable warning
  void fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#000010' }}>
      {/* 3D Scene */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, cameraZ], fov: 50 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />

        <StarField frame={frame} />
        <IntroPlanet frame={frame} color="#6366f1" />
      </ThreeCanvas>

      {/* Overlay Text */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              margin: '20px 0 0 0',
              opacity: subtitleOpacity,
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}
          >
            {subtitle}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
