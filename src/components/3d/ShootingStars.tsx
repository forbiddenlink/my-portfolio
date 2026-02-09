'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface ShootingStar {
  position: THREE.Vector3
  velocity: THREE.Vector3
  trail: THREE.Vector3[]
  active: boolean
  lifetime: number
  maxLifetime: number
  size: number
  color: THREE.Color
}

/**
 * Shooting stars that streak across the sky at random intervals
 * with glowing trails that fade over distance
 */
export function ShootingStars({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<ShootingStar[]>([])
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const trailObjectsRef = useRef<THREE.Line[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  // Don't render shooting stars if user prefers reduced motion
  if (prefersReducedMotion) {
    return null
  }

  // Initialize shooting stars and trail objects
  useEffect(() => {
    starsRef.current = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      trail: [],
      active: false,
      lifetime: 0,
      maxLifetime: 2 + Math.random() * 2,
      size: 0.3 + Math.random() * 0.4,
      color: new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.3, 0.9)
    }))

    // Create trail line objects
    trailObjectsRef.current = Array.from({ length: count }, () => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(90)
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setDrawRange(0, 0)

      const material = new THREE.LineBasicMaterial({
        color: '#ffcc88',
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })

      const line = new THREE.Line(geometry, material)
      line.visible = false
      return line
    })

    // Add trail objects to group
    if (groupRef.current) {
      trailObjectsRef.current.forEach(trail => {
        groupRef.current!.add(trail)
      })
    }

    return () => {
      // Cleanup
      trailObjectsRef.current.forEach(trail => {
        trail.geometry.dispose()
        ;(trail.material as THREE.Material).dispose()
      })
    }
  }, [count])

  // Spawn a shooting star
  const spawnStar = (star: ShootingStar) => {
    // Start from a random point on a sphere
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.5 + Math.PI * 0.25 // Upper hemisphere bias

    const radius = 150 + Math.random() * 100

    star.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )

    // Random direction, generally inward and downward
    const speed = 80 + Math.random() * 60
    star.velocity.set(
      -star.position.x * 0.5 + (Math.random() - 0.5) * 50,
      -20 - Math.random() * 30,
      -star.position.z * 0.5 + (Math.random() - 0.5) * 50
    ).normalize().multiplyScalar(speed)

    star.trail = [star.position.clone()]
    star.active = true
    star.lifetime = 0
    star.maxLifetime = 1.5 + Math.random() * 2
    star.size = 0.4 + Math.random() * 0.5
    star.color.setHSL(0.05 + Math.random() * 0.15, 0.5 + Math.random() * 0.3, 0.85 + Math.random() * 0.15)
  }

  useFrame((state, delta) => {
    starsRef.current.forEach((star, i) => {
      // Random spawn chance for inactive stars
      if (!star.active) {
        // Spawn based on time - roughly one every 2-5 seconds
        if (Math.random() < delta * 0.15) {
          spawnStar(star)
        }
        return
      }

      // Update active star
      star.lifetime += delta

      if (star.lifetime > star.maxLifetime) {
        star.active = false
        // Hide mesh
        if (meshRefs.current[i]) {
          meshRefs.current[i]!.visible = false
        }
        if (trailObjectsRef.current[i]) {
          trailObjectsRef.current[i].visible = false
        }
        return
      }

      // Move star
      star.position.add(star.velocity.clone().multiplyScalar(delta))

      // Add to trail (limit length)
      star.trail.push(star.position.clone())
      if (star.trail.length > 30) {
        star.trail.shift()
      }

      // Update mesh position
      if (meshRefs.current[i]) {
        meshRefs.current[i]!.position.copy(star.position)
        meshRefs.current[i]!.visible = true

        // Fade out near end of lifetime
        const lifeFactor = 1 - (star.lifetime / star.maxLifetime)
        const material = meshRefs.current[i]!.material as THREE.MeshBasicMaterial
        material.opacity = lifeFactor * 0.9
      }

      // Update trail
      const trail = trailObjectsRef.current[i]
      if (trail && star.trail.length > 1) {
        const geometry = trail.geometry as THREE.BufferGeometry
        const positions = geometry.attributes.position.array as Float32Array

        star.trail.forEach((pos, j) => {
          positions[j * 3] = pos.x
          positions[j * 3 + 1] = pos.y
          positions[j * 3 + 2] = pos.z
        })

        geometry.attributes.position.needsUpdate = true
        geometry.setDrawRange(0, star.trail.length)
        trail.visible = true

        // Fade trail
        const lineMaterial = trail.material as THREE.LineBasicMaterial
        lineMaterial.opacity = (1 - star.lifetime / star.maxLifetime) * 0.6
      }
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i}>
          {/* Star head */}
          <mesh
            ref={(el) => { meshRefs.current[i] = el }}
            visible={false}
          >
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Glow around head */}
          <mesh visible={false}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshBasicMaterial
              color="#ffaa44"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
