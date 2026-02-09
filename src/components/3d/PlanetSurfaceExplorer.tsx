'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Float, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { Project } from '@/lib/types'

interface PlanetSurfaceExplorerProps {
  project: Project
  planetColor: string
  planetType: 'rocky' | 'gas' | 'ice' | 'desert'
  onExit: () => void
}

export function PlanetSurfaceExplorer({
  project,
  planetColor,
  planetType,
  onExit
}: PlanetSurfaceExplorerProps) {
  const { camera, gl } = useThree()
  const [position, setPosition] = useState(new THREE.Vector3(0, 2, 0))
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 })
  const [footprints, setFootprints] = useState<Array<{ x: number; z: number; rotation: number }>>([])
  const [nearBeacon, setNearBeacon] = useState(false)

  const keys = useRef<Set<string>>(new Set())
  const lastFootprintPos = useRef(new THREE.Vector3())

  // Beacon pulse ref
  const beaconRef = useRef<THREE.Group>(null)

  // Movement controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase())
      if (e.key === 'Escape') onExit()
    }
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())

    // Mouse look with pointer lock
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        setRotation(prev => ({
          yaw: prev.yaw - e.movementX * 0.002,
          pitch: Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, prev.pitch - e.movementY * 0.002))
        }))
      }
    }
    const handleClick = () => gl.domElement.requestPointerLock()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('click', handleClick)
      if (document.pointerLockElement === gl.domElement) document.exitPointerLock()
    }
  }, [gl.domElement, onExit])

  // Update loop
  useFrame((state, delta) => {
    // 1. Handle Movement
    const moveSpeed = (keys.current.has('shift') ? 12 : 6) * delta
    const direction = new THREE.Vector3()
    const isMoving = keys.current.has('w') || keys.current.has('s') || keys.current.has('a') || keys.current.has('d')

    if (keys.current.has('w')) direction.z -= 1
    if (keys.current.has('s')) direction.z += 1
    if (keys.current.has('a')) direction.x -= 1
    if (keys.current.has('d')) direction.x += 1

    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.yaw).normalize().multiplyScalar(moveSpeed)

    const newPosition = position.clone().add(direction)
    newPosition.y = 2 // Keep attached to ground
    setPosition(newPosition)

    // 2. Footprints
    if (isMoving && newPosition.distanceTo(lastFootprintPos.current) > 1.5) {
      setFootprints(prev => [
        ...prev.slice(-40),
        { x: newPosition.x, z: newPosition.z, rotation: rotation.yaw }
      ])
      lastFootprintPos.current.copy(newPosition)
    }

    // 3. Check Beacon Proximity (Beacon at 0, 0, -15)
    const beaconPos = new THREE.Vector3(0, 0, -15)
    setNearBeacon(newPosition.distanceTo(beaconPos) < 8)

    // 4. Update Camera
    camera.position.lerp(newPosition, 0.5) // Smooth follow
    camera.rotation.set(rotation.pitch, rotation.yaw, 0, 'YXZ')

    // 5. Animate Beacon
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 0.5
    }
  })

  // Theme configuration
  const theme = {
    groundColor: new THREE.Color(planetColor).multiplyScalar(0.2).getStyle(),
    fogColor: new THREE.Color(planetColor).multiplyScalar(0.1).getStyle(),
    skyColor: new THREE.Color(planetColor).multiplyScalar(0.05).getStyle(),
  }

  // Generate random terrain features
  const features = useRef(Array.from({ length: 80 }, () => ({
    x: (Math.random() - 0.5) * 100,
    z: (Math.random() - 0.5) * 100,
    scale: 0.5 + Math.random() * 2,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
    type: Math.random() > 0.7 ? 'crystal' : 'rock'
  }))).current

  return (
    <>
      <fog attach="fog" args={[theme.fogColor, 10, 60]} />
      <color attach="background" args={[theme.skyColor]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[50, 100, 50]} intensity={1.5} castShadow />

      {/* Infinite Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 64, 64]} />
        <meshStandardMaterial
          color={theme.groundColor}
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Grid Overlay for "Sci-Fi" Ground Feel */}
      <gridHelper args={[200, 200, planetColor, planetColor]} position={[0, 0.05, 0]} />

      {/* Procedural Features */}
      {features.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]} rotation={new THREE.Euler(...f.rotation)}>
          {f.type === 'crystal' ? (
            <mesh castShadow>
              <octahedronGeometry args={[f.scale]} />
              <meshStandardMaterial
                color={planetColor}
                emissive={planetColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          ) : (
            <mesh castShadow position={[0, f.scale / 2, 0]}>
              <dodecahedronGeometry args={[f.scale]} />
              <meshStandardMaterial color="#333" roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}

      {/* Footprints */}
      {footprints.map((fp, i) => (
        <mesh key={i} position={[fp.x, 0.02, fp.z]} rotation={[-Math.PI / 2, 0, fp.rotation]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshBasicMaterial color={planetColor} transparent opacity={0.4 * (i / footprints.length)} />
        </mesh>
      ))}

      {/* THE DATA BEACON */}
      <group position={[0, 0, -15]}>
        {/* Pillar of Light */}
        <mesh position={[0, 15, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 30, 32, 1, true]} />
          <meshBasicMaterial
            color={planetColor}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Floating Core */}
        <group ref={beaconRef} position={[0, 3, 0]}>
          <mesh>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial
              color={planetColor}
              wireframe
              emissive={planetColor}
              emissiveIntensity={2}
            />
          </mesh>

          {/* Orbiting rings */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[3, 0.1, 16, 100]} />
            <meshStandardMaterial color="#fff" emissive="#fff" />
          </mesh>
        </group>

        {/* Tech Stack Floating Text */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          {project.tags.map((tag, i) => {
            const angle = (i / project.tags.length) * Math.PI * 2
            return (
              <Billboard key={tag} position={[Math.sin(angle) * 5, 4 + (i % 2), Math.cos(angle) * 5]}>
                <Text
                  fontSize={0.6}
                  color="#ffffff"
                  outlineWidth={0.05}
                  outlineColor={planetColor}
                >
                  {tag}
                </Text>
              </Billboard>
            )
          })}
        </Float>

        {/* Interaction Radius Indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[7.8, 8, 64]} />
          <meshBasicMaterial color={planetColor} opacity={0.5} transparent />
        </mesh>
      </group>

      {/* Near Beacon: Holographic Overlay */}
      {nearBeacon && (
        <group position={[0, 2, -10]}>
          <Billboard>
            <Text
              position={[0, 2, 0]}
              fontSize={1}
              color={planetColor}
              outlineWidth={0.05}
              outlineColor="white"
            >
              PROJECT TRANSMISSION
            </Text>
            <Text
              position={[0, 1, 0]}
              fontSize={0.5}
              color="white"
              maxWidth={6}
              textAlign="center"
            >
              {project.description}
            </Text>
          </Billboard>
        </group>
      )}
    </>
  )
}
