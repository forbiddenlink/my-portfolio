'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AlienCharacterProps {
  position: [number, number, number]
  color?: string
  scale?: number
  isWaving?: boolean
}

// Cute stylized alien that waves during tour
export function AlienCharacter({
  position,
  color = '#00FF88',
  scale = 1,
  isWaving = true
}: AlienCharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Mesh>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Group>(null)

  // Alien body color variations
  const colors = useMemo(() => {
    const baseColor = new THREE.Color(color)
    return {
      body: baseColor,
      bodyDark: baseColor.clone().multiplyScalar(0.6),
      glow: baseColor.clone().multiplyScalar(1.5),
      eye: new THREE.Color('#FFFFFF'),
      pupil: new THREE.Color('#000000'),
      antenna: new THREE.Color('#FFD700'),
    }
  }, [color])

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1

      // Slight body sway
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05
    }

    // Waving animation
    if (armRef.current && isWaving) {
      armRef.current.rotation.z = Math.sin(time * 4) * 0.5 + 0.3
    }

    // Eye blinking (occasional)
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(time * 0.5)
      const shouldBlink = blinkCycle > 0.95
      const blinkScale = shouldBlink ? 0.1 : 1
      eyeLeftRef.current.scale.y = blinkScale
      eyeRightRef.current.scale.y = blinkScale
    }

    // Antenna wobble
    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(time * 3) * 0.2
      antennaRef.current.rotation.z = Math.cos(time * 2.5) * 0.15
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body - oval shaped */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={colors.body}
          emissive={colors.body}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Body glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Head - larger oval */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={colors.body}
          emissive={colors.body}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Head glow */}
      <mesh position={[0, 0.6, 0]} scale={1.2}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.15, 0.7, 0.3]}>
        <mesh ref={eyeLeftRef}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color={colors.eye} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={colors.pupil} />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.03, 0.03, 0.1]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.15, 0.7, 0.3]}>
        <mesh ref={eyeRightRef}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color={colors.eye} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={colors.pupil} />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.03, 0.03, 0.1]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Smile */}
      <mesh position={[0, 0.5, 0.35]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshBasicMaterial color={colors.bodyDark} />
      </mesh>

      {/* Antenna */}
      <group ref={antennaRef} position={[0, 1.0, 0]}>
        {/* Antenna stalk */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color={colors.body} metalness={0.3} />
        </mesh>
        {/* Antenna ball - glowing */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={colors.antenna} />
        </mesh>
        {/* Antenna glow */}
        <mesh position={[0, 0.15, 0]} scale={2}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            color={colors.antenna}
            transparent
            opacity={0.3}
          />
        </mesh>
        <pointLight
          position={[0, 0.15, 0]}
          color={colors.antenna}
          intensity={0.5}
          distance={2}
        />
      </group>

      {/* Left Arm (waving) */}
      <group position={[-0.45, 0.1, 0]}>
        <mesh ref={armRef} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial
            color={colors.body}
            emissive={colors.body}
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.25, 0.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={colors.body}
            emissive={colors.body}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.45, 0.1, 0]}>
        <mesh rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial
            color={colors.body}
            emissive={colors.body}
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[0.2, -0.15, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={colors.body}
            emissive={colors.body}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Feet */}
      <mesh position={[-0.2, -0.55, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={colors.bodyDark} />
      </mesh>
      <mesh position={[0.2, -0.55, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={colors.bodyDark} />
      </mesh>
    </group>
  )
}

// Multiple alien types for variety
export function AlienVariant1(props: Omit<AlienCharacterProps, 'color'>) {
  return <AlienCharacter {...props} color="#00FF88" /> // Green
}

export function AlienVariant2(props: Omit<AlienCharacterProps, 'color'>) {
  return <AlienCharacter {...props} color="#FF6B9D" /> // Pink
}

export function AlienVariant3(props: Omit<AlienCharacterProps, 'color'>) {
  return <AlienCharacter {...props} color="#00D4FF" /> // Cyan
}

export function AlienVariant4(props: Omit<AlienCharacterProps, 'color'>) {
  return <AlienCharacter {...props} color="#FFB800" /> // Gold
}

export function AlienVariant5(props: Omit<AlienCharacterProps, 'color'>) {
  return <AlienCharacter {...props} color="#A855F7" /> // Purple
}
