'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition, getSizeMultiplier } from '@/lib/utils'
import { useViewStore } from '@/lib/store'
import * as THREE from 'three'
import { SupernovaEffect } from './SupernovaEffect'
import { AnimatedConstellation } from './AnimatedConstellation'

export function EnhancedProjectStars() {
  return (
    <group>
      {galaxies.map((galaxy, galaxyIndex) => (
        <GalaxyCluster
          key={galaxy.id}
          galaxy={galaxy}
          galaxyIndex={galaxyIndex}
        />
      ))}
    </group>
  )
}

function GalaxyCluster({ galaxy, galaxyIndex }: { galaxy: any; galaxyIndex: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const zoomToProject = useViewStore((state) => state.zoomToProject)

  return (
    <group ref={groupRef}>
      {galaxy.projects.map((project: any, projectIndex: number) => {
        const position = generateProjectPosition(
          project.id,
          galaxy.id,
          galaxyIndex,
          projectIndex,
          galaxy.projects.length
        )

        const sizeMultiplier = getSizeMultiplier(project.size)
        const isSupernova = project.id === 'coulson-one'

        return (
          <EnhancedPlanetStar
            key={project.id}
            project={project}
            position={position}
            sizeMultiplier={sizeMultiplier}
            isSupernova={isSupernova}
            onPlanetClick={() => zoomToProject(project.id)}
          />
        )
      })}

      {/* Animated Constellation for Flo Labs */}
      {galaxy.id === 'enterprise' && <AnimatedConstellation />}
    </group>
  )
}

function EnhancedPlanetStar({
  project,
  position,
  sizeMultiplier,
  isSupernova,
  onPlanetClick
}: {
  project: any
  position: [number, number, number]
  sizeMultiplier: number
  isSupernova: boolean
  onPlanetClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef<THREE.Mesh>(null)
  const planetGroupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const planetRingsRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Breathing animation scale
  const breatheScale = useRef(1)
  const breatheDirection = useRef(1)

  // Determine planet characteristics based on project
  const hasRings = ['coulson-one', 'portfolio-pro', 'quantum-forge'].includes(project.id)
  const hasClouds = sizeMultiplier > 1.0

  // Planet type affects appearance
  const isGasGiant = sizeMultiplier > 2.0
  const isIcePlanet = project.color.includes('00D9FF') || project.color.includes('06FFA5')

  // Memoize rotation speed to prevent recalculation
  const rotationSpeed = useMemo(() => 0.002 + Math.random() * 0.003, [])

  // Rotate everything
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Rotate planet
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed
    }

    // Rotate clouds faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.8
      cloudsRef.current.rotation.x = Math.sin(time * 0.5) * 0.05
    }

    // Rotate rings slowly
    if (planetRingsRef.current) {
      planetRingsRef.current.rotation.z += 0.0005
    }

    // Pulse glow on hover
    if (glowRef.current) {
      const pulse = hovered ? Math.sin(time * 3) * 0.1 + 1.0 : 1.0
      glowRef.current.scale.setScalar(pulse)
    }

    if (ringRef.current && hovered) {
      ringRef.current.rotation.x += delta * 0.5
      ringRef.current.rotation.y += delta * 0.3
    }

    // Breathing effect
    if (planetGroupRef.current) {
      if (hovered) {
        breatheScale.current += breatheDirection.current * delta * 0.5
        if (breatheScale.current > 1.15) {
          breatheScale.current = 1.15
          breatheDirection.current = -1
        } else if (breatheScale.current < 1.05) {
          breatheScale.current = 1.05
          breatheDirection.current = 1
        }
      } else {
        breatheScale.current += (1 - breatheScale.current) * delta * 3
      }

      planetGroupRef.current.scale.setScalar(breatheScale.current)
    }

    // Particle rotation on hover
    if (particlesRef.current && hovered) {
      particlesRef.current.rotation.y += delta * 2
      particlesRef.current.rotation.x += delta * 1
    }
  })

  // Create particle burst geometry for hover effect - memoized
  const particleGeometry = useMemo(() => {
    const particleCount = 20
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const radius = sizeMultiplier * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [sizeMultiplier])

  const handleClick = () => {
    onPlanetClick()
  }

  return (
    <group position={position} ref={planetGroupRef}>
      {/* Particle burst on hover */}
      <points ref={particlesRef} geometry={particleGeometry} visible={hovered}>
        <pointsMaterial
          size={0.15}
          color={project.color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Main planet */}
      <group
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Core planet with enhanced rendering */}
        <mesh ref={planetRef} castShadow receiveShadow>
          <sphereGeometry args={[sizeMultiplier, 64, 64]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.9 : 0.5}
            metalness={isIcePlanet ? 0.85 : (isGasGiant ? 0.2 : 0.45)}
            roughness={isGasGiant ? 0.2 : 0.5}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Cloud layer with animated movement */}
        {hasClouds && (
          <mesh ref={cloudsRef} scale={1.02}>
            <sphereGeometry args={[sizeMultiplier, 48, 48]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.3}
              roughness={1}
              metalness={0}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Inner atmospheric glow */}
        <mesh ref={glowRef} scale={1.08}>
          <sphereGeometry args={[sizeMultiplier, 32, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.45 : 0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Middle atmospheric layer */}
        <mesh scale={1.15}>
          <sphereGeometry args={[sizeMultiplier, 24, 24]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.3 : 0.2}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Outer atmospheric halo */}
        <mesh scale={1.25}>
          <sphereGeometry args={[sizeMultiplier, 16, 16]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.2 : 0.12}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Extended glow on hover */}
        {hovered && (
          <mesh scale={1.4}>
            <sphereGeometry args={[sizeMultiplier, 16, 16]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Planetary rings */}
        {hasRings && (
          <group ref={planetRingsRef} rotation={[Math.PI / 2.5, 0, 0]}>
            {/* Inner bright ring */}
            <mesh>
              <ringGeometry args={[sizeMultiplier * 1.5, sizeMultiplier * 1.8, 128]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* Outer faded ring */}
            <mesh>
              <ringGeometry args={[sizeMultiplier * 1.85, sizeMultiplier * 2.4, 128]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* Gap between rings */}
            <mesh>
              <ringGeometry args={[sizeMultiplier * 1.75, sizeMultiplier * 1.85, 64]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}

        {/* Enhanced lighting */}
        <pointLight
          color={project.color}
          intensity={isSupernova ? 8 : (hovered ? 4 : 3)}
          distance={sizeMultiplier * 15}
          decay={2}
        />

        {/* Rim light for depth */}
        <spotLight
          position={[sizeMultiplier * 4, sizeMultiplier * 2, sizeMultiplier * 4]}
          color={project.color}
          intensity={hovered ? 3 : 2}
          angle={Math.PI / 3}
          penumbra={1}
          distance={sizeMultiplier * 25}
          decay={2}
        />
      </group>

      {/* Orbital ring - enhanced on hover */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[sizeMultiplier * 1.8, 0.025, 16, 64]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered ? 0.9 : 0.4}
          transparent
          opacity={hovered ? 0.7 : 0.35}
        />
      </mesh>

      {/* Glow sphere on hover */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[sizeMultiplier * 2.2, 32, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Project label */}
      {hovered && (
        <Text
          position={[0, sizeMultiplier + 1.2, 0]}
          fontSize={0.45}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#000000"
        >
          {project.title}
        </Text>
      )}

      {/* Supernova badge for Coulson One */}
      {isSupernova && (
        <>
          {/* Dramatic supernova effect */}
          <SupernovaEffect
            position={[0, 0, 0]}
            color={project.color}
            size={sizeMultiplier * 0.8}
          />

          {/* Floating stats badge */}
          <group position={[0, sizeMultiplier + 2.5, 0]}>
            <Text
              fontSize={0.35}
              color="#FFD700"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
            >
              64,806 files
            </Text>
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
            >
              SUPERMASSIVE
            </Text>
          </group>
        </>
      )}
    </group>
  )
}
