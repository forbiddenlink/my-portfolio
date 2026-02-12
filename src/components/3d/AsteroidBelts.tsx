'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { getGalaxyCenterPosition, seededRandom, hashCode } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/store'

interface AsteroidBeltProps {
  position: [number, number, number]
  innerRadius?: number
  outerRadius?: number
  count?: number
  color?: string
  seed: number
}

/**
 * Single asteroid belt around a galaxy core using instanced meshes for performance
 */
function SingleAsteroidBelt({
  position,
  innerRadius = 12,
  outerRadius = 18,
  count = 400,
  color = '#8B7355',
  seed,
}: AsteroidBeltProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Generate asteroid data
  const asteroidData = useMemo(() => {
    const rng = seededRandom(seed)
    const data: {
      position: THREE.Vector3
      rotation: THREE.Euler
      scale: number
      orbitSpeed: number
      tumbleSpeed: THREE.Vector3
      orbitAngle: number
      orbitRadius: number
      orbitTilt: number
    }[] = []

    for (let i = 0; i < count; i++) {
      // Distribute in ring with slight thickness
      const angle = rng() * Math.PI * 2
      const radius = innerRadius + rng() * (outerRadius - innerRadius)
      const height = (rng() - 0.5) * 3 // Some vertical spread

      // Add clustering for more natural look
      const clusterNoise = Math.sin(angle * 3) * 2 + Math.cos(angle * 7) * 1.5
      const adjustedRadius = radius + clusterNoise

      const x = Math.cos(angle) * adjustedRadius
      const z = Math.sin(angle) * adjustedRadius
      const y = height

      // Random sizes - mostly small with occasional larger ones
      const sizeRoll = rng()
      let scale: number
      if (sizeRoll > 0.98) {
        scale = 0.4 + rng() * 0.3 // Large asteroids (2%)
      } else if (sizeRoll > 0.9) {
        scale = 0.2 + rng() * 0.2 // Medium asteroids (8%)
      } else {
        scale = 0.05 + rng() * 0.15 // Small asteroids (90%)
      }

      // Orbit and tumble speeds
      const orbitSpeed = 0.02 + rng() * 0.03 // Varies for natural look
      const tumbleSpeed = new THREE.Vector3(
        (rng() - 0.5) * 0.5,
        (rng() - 0.5) * 0.5,
        (rng() - 0.5) * 0.5
      )

      // Initial rotation
      const rotation = new THREE.Euler(
        rng() * Math.PI * 2,
        rng() * Math.PI * 2,
        rng() * Math.PI * 2
      )

      // Orbit tilt for 3D effect
      const orbitTilt = (rng() - 0.5) * 0.2

      data.push({
        position: new THREE.Vector3(x, y, z),
        rotation,
        scale,
        orbitSpeed,
        tumbleSpeed,
        orbitAngle: angle,
        orbitRadius: adjustedRadius,
        orbitTilt,
      })
    }

    return data
  }, [count, innerRadius, outerRadius, seed])

  // Create irregular asteroid geometry
  const asteroidGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1)

    // Deform vertices for irregular rocky shape
    const positions = geo.attributes.position
    const rng = seededRandom(seed + 12345)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      const noise = 0.7 + rng() * 0.6 // Random per-vertex scale
      positions.setXYZ(i, x * noise, y * noise, z * noise)
    }

    geo.computeVertexNormals()
    return geo
  }, [seed])

  // Asteroid material with color variation
  const asteroidMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color)
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    })
  }, [color])

  // Initialize instance matrices
  useMemo(() => {
    if (!instancedMeshRef.current) return

    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()

    asteroidData.forEach((asteroid, i) => {
      quaternion.setFromEuler(asteroid.rotation)
      matrix.compose(
        asteroid.position,
        quaternion,
        new THREE.Vector3(asteroid.scale, asteroid.scale, asteroid.scale)
      )
      instancedMeshRef.current!.setMatrixAt(i, matrix)
    })

    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  }, [asteroidData])

  useFrame((state) => {
    if (!instancedMeshRef.current || prefersReducedMotion) return

    const time = state.clock.getElapsedTime()
    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()

    asteroidData.forEach((asteroid, i) => {
      // Orbit around the belt center
      const newAngle = asteroid.orbitAngle + time * asteroid.orbitSpeed

      // Calculate new position with orbit tilt
      const x = Math.cos(newAngle) * asteroid.orbitRadius
      const z = Math.sin(newAngle) * asteroid.orbitRadius
      const y = asteroid.position.y + Math.sin(newAngle * 2) * asteroid.orbitTilt * 2

      // Tumble rotation
      const tumbleRotation = new THREE.Euler(
        asteroid.rotation.x + time * asteroid.tumbleSpeed.x,
        asteroid.rotation.y + time * asteroid.tumbleSpeed.y,
        asteroid.rotation.z + time * asteroid.tumbleSpeed.z
      )

      quaternion.setFromEuler(tumbleRotation)
      matrix.compose(
        new THREE.Vector3(x, y, z),
        quaternion,
        new THREE.Vector3(asteroid.scale, asteroid.scale, asteroid.scale)
      )
      instancedMeshRef.current!.setMatrixAt(i, matrix)
    })

    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[asteroidGeometry, asteroidMaterial, count]}
        castShadow={false}
        receiveShadow={false}
        frustumCulled={true}
      />

      {/* Subtle dust particles around the belt */}
      {!prefersReducedMotion && (
        <AsteroidDust
          innerRadius={innerRadius - 1}
          outerRadius={outerRadius + 2}
          count={100}
          seed={seed + 999}
        />
      )}
    </group>
  )
}

/**
 * Dust particles around asteroid belt for atmospheric effect
 */
function AsteroidDust({
  innerRadius,
  outerRadius,
  count,
  seed,
}: {
  innerRadius: number
  outerRadius: number
  count: number
  seed: number
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, sizes } = useMemo(() => {
    const rng = seededRandom(seed)
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2
      const radius = innerRadius + rng() * (outerRadius - innerRadius)
      const height = (rng() - 0.5) * 4

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius

      sizes[i] = 0.02 + rng() * 0.05
    }

    return { positions, sizes }
  }, [count, innerRadius, outerRadius, seed])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [positions, sizes])

  useFrame((state) => {
    if (!pointsRef.current) return
    // Slow rotation
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01
  })

  return (
    <points ref={pointsRef}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        size={0.08}
        color="#8B8B7A"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Asteroid belts around selected galaxy cores
 */
export function AsteroidBelts() {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Select 3 galaxies to have asteroid belts
  // Using Enterprise (0), AI (1), and FullStack (2) galaxies
  const beltConfigs = useMemo(() => {
    const selectedGalaxies = [0, 2, 4] // Enterprise, FullStack, Design

    return selectedGalaxies.map((galaxyIndex) => {
      const [x, y, z] = getGalaxyCenterPosition(galaxyIndex)
      const galaxy = galaxies[galaxyIndex]
      const seed = hashCode(galaxy.id + 'asteroids')

      // Vary belt properties per galaxy
      let innerRadius: number
      let outerRadius: number
      let count: number
      let color: string

      switch (galaxyIndex) {
        case 0: // Enterprise - large professional belt
          innerRadius = 14
          outerRadius = 20
          count = prefersReducedMotion ? 100 : 500
          color = '#9D8B7A'
          break
        case 2: // FullStack - medium purple-tinted belt
          innerRadius = 12
          outerRadius = 17
          count = prefersReducedMotion ? 80 : 400
          color = '#7A6B8A'
          break
        case 4: // Design - colorful scattered belt
          innerRadius = 10
          outerRadius = 15
          count = prefersReducedMotion ? 60 : 350
          color = '#8A7A6B'
          break
        default:
          innerRadius = 12
          outerRadius = 18
          count = prefersReducedMotion ? 80 : 400
          color = '#8B7355'
      }

      return {
        position: [x, y, z] as [number, number, number],
        innerRadius,
        outerRadius,
        count,
        color,
        seed,
      }
    })
  }, [prefersReducedMotion])

  return (
    <group>
      {beltConfigs.map((config, i) => (
        <SingleAsteroidBelt
          key={i}
          position={config.position}
          innerRadius={config.innerRadius}
          outerRadius={config.outerRadius}
          count={config.count}
          color={config.color}
          seed={config.seed}
        />
      ))}
    </group>
  )
}
