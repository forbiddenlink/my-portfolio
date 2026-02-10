'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SpaceStationProps {
  position: [number, number, number]
  orbitRadius?: number
  orbitSpeed?: number
  scale?: number
  color?: string
}

// Orbiting space station with rotating sections
export function SpaceStation({
  position,
  orbitRadius = 3,
  orbitSpeed = 0.3,
  scale = 0.5,
  color = '#4A90D9'
}: SpaceStationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const solarPanelRef = useRef<THREE.Group>(null)
  const antennaRef = useRef<THREE.Mesh>(null)
  const lightsRef = useRef<THREE.Group>(null)

  const stationColor = useMemo(() => new THREE.Color(color), [color])
  const accentColor = useMemo(() => new THREE.Color('#FFD700'), [])
  const lightColor = useMemo(() => new THREE.Color('#00FF88'), [])

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Orbit around the planet position
      const orbitAngle = time * orbitSpeed
      groupRef.current.position.x = position[0] + Math.cos(orbitAngle) * orbitRadius
      groupRef.current.position.y = position[1] + Math.sin(orbitAngle * 0.5) * (orbitRadius * 0.3)
      groupRef.current.position.z = position[2] + Math.sin(orbitAngle) * orbitRadius

      // Slight rotation to always face somewhat forward
      groupRef.current.rotation.y = -orbitAngle + Math.PI / 2
    }

    // Rotating habitat ring
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.005
    }

    // Solar panels tracking (slow rotation)
    if (solarPanelRef.current) {
      solarPanelRef.current.rotation.y = Math.sin(time * 0.2) * 0.3
    }

    // Antenna rotation
    if (antennaRef.current) {
      antennaRef.current.rotation.y = time * 0.5
    }

    // Blinking lights
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, i) => {
        const phase = (time * 2 + i * 1.5) % 2
        const mesh = light as THREE.Mesh
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = phase < 1 ? 0.3 : 1
        }
      })
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Central Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
        <meshStandardMaterial
          color={stationColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Central Hub Detail Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.42, 0.05, 8, 32]} />
        <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rotating Habitat Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.15, 8, 48]} />
        <meshStandardMaterial
          color={stationColor}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Ring Support Spokes */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, (i / 6) * Math.PI * 2]}
        >
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color={stationColor} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Solar Panel Array */}
      <group ref={solarPanelRef} position={[0, 0.6, 0]}>
        {/* Left Panel */}
        <group position={[-1.5, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.02, 0.8]} />
            <meshStandardMaterial
              color="#1a237e"
              metalness={0.3}
              roughness={0.1}
              emissive="#1a237e"
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Panel frame */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.85, 0.02, 0.02]} />
            <meshStandardMaterial color={accentColor} metalness={0.9} />
          </mesh>
        </group>

        {/* Right Panel */}
        <group position={[1.5, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.02, 0.8]} />
            <meshStandardMaterial
              color="#1a237e"
              metalness={0.3}
              roughness={0.1}
              emissive="#1a237e"
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Panel frame */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.85, 0.02, 0.02]} />
            <meshStandardMaterial color={accentColor} metalness={0.9} />
          </mesh>
        </group>

        {/* Panel Support Arm */}
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.5]} />
          <meshStandardMaterial color={stationColor} metalness={0.7} />
        </mesh>
      </group>

      {/* Communication Antenna */}
      <group position={[0, -0.6, 0]}>
        <mesh ref={antennaRef}>
          {/* Dish */}
          <mesh position={[0, -0.3, 0]} rotation={[0.5, 0, 0]}>
            <coneGeometry args={[0.4, 0.2, 16, 1, true]} />
            <meshStandardMaterial
              color="#CCCCCC"
              metalness={0.9}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Antenna arm */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
            <meshStandardMaterial color={stationColor} metalness={0.8} />
          </mesh>
        </mesh>
      </group>

      {/* Docking Ports */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={`dock-${i}`}
          position={[
            Math.cos(angle) * 0.5,
            0,
            Math.sin(angle) * 0.5
          ]}
          rotation={[0, -angle, 0]}
        >
          <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Blinking Navigation Lights */}
      <group ref={lightsRef}>
        {/* Top light - green */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={lightColor} transparent opacity={1} />
        </mesh>
        {/* Bottom light - red */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#FF4444" transparent opacity={1} />
        </mesh>
        {/* Side lights - white */}
        <mesh position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={1} />
        </mesh>
        <mesh position={[-1.2, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={1} />
        </mesh>
      </group>

      {/* Window lights on habitat ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <pointLight
            key={`window-${i}`}
            position={[
              Math.cos(angle) * 1.2,
              0,
              Math.sin(angle) * 1.2
            ]}
            color="#FFE4B5"
            intensity={0.1}
            distance={1}
          />
        )
      })}

      {/* Ambient glow */}
      <pointLight position={[0, 0, 0]} color={stationColor} intensity={0.3} distance={5} />
    </group>
  )
}

// Mini satellite variant
export function Satellite({
  position,
  orbitRadius = 2,
  orbitSpeed = 0.5,
  scale = 0.3
}: Omit<SpaceStationProps, 'color'>) {
  const groupRef = useRef<THREE.Group>(null)
  const panelRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      const orbitAngle = time * orbitSpeed
      groupRef.current.position.x = position[0] + Math.cos(orbitAngle) * orbitRadius
      groupRef.current.position.y = position[1] + Math.sin(orbitAngle * 0.3) * (orbitRadius * 0.2)
      groupRef.current.position.z = position[2] + Math.sin(orbitAngle) * orbitRadius
      groupRef.current.rotation.y = -orbitAngle
    }

    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(time * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Solar panels */}
      <group ref={panelRef}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1, 0.02, 0.4]} />
          <meshStandardMaterial color="#1a237e" metalness={0.3} emissive="#1a237e" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[1, 0.02, 0.4]} />
          <meshStandardMaterial color="#1a237e" metalness={0.3} emissive="#1a237e" emissiveIntensity={0.1} />
        </mesh>
      </group>

      {/* Antenna dish */}
      <mesh position={[0, 0.3, 0]} rotation={[-0.5, 0, 0]}>
        <coneGeometry args={[0.2, 0.1, 16, 1, true]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Blinking light */}
      <mesh position={[0, -0.25, 0.35]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
    </group>
  )
}
