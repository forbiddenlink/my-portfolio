'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface Comet {
  position: THREE.Vector3
  velocity: THREE.Vector3
  trail: THREE.Vector3[]
  active: boolean
  lifetime: number
  maxLifetime: number
  size: number
  color: THREE.Color
  tailLength: number
}

/**
 * Majestic comets that streak across the cosmic scene with
 * beautiful glowing tails that respond to camera movement
 */
export function CosmicComets({ count = 3 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const cometsRef = useRef<Comet[]>([])
  const headMeshesRef = useRef<(THREE.Mesh | null)[]>([])
  const tailMeshesRef = useRef<(THREE.Mesh | null)[]>([])
  const { camera } = useThree()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null
  }

  // Initialize comets
  useMemo(() => {
    cometsRef.current = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      trail: [],
      active: false,
      lifetime: 0,
      maxLifetime: 8 + Math.random() * 6,
      size: 0.8 + Math.random() * 0.6,
      color: new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.6, 0.8),
      tailLength: 15 + Math.random() * 10
    }))
  }, [count])

  // Spawn a comet with dramatic entrance
  const spawnComet = (comet: Comet) => {
    // Start from edge of visible area
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.4 + Math.PI * 0.3

    const radius = 180 + Math.random() * 80

    comet.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.5,
      radius * Math.sin(phi) * Math.sin(theta)
    )

    // Velocity toward center with some variation
    const speed = 25 + Math.random() * 20
    comet.velocity.set(
      -comet.position.x * 0.3 + (Math.random() - 0.5) * 30,
      -10 - Math.random() * 15,
      -comet.position.z * 0.3 + (Math.random() - 0.5) * 30
    ).normalize().multiplyScalar(speed)

    comet.trail = []
    comet.active = true
    comet.lifetime = 0
    comet.maxLifetime = 8 + Math.random() * 6
    comet.size = 0.8 + Math.random() * 0.6
    comet.tailLength = 15 + Math.random() * 10

    // Varied comet colors - icy blues, cyans, and white
    const colorChoice = Math.random()
    if (colorChoice < 0.4) {
      comet.color.setHSL(0.55, 0.7, 0.85) // Cyan
    } else if (colorChoice < 0.7) {
      comet.color.setHSL(0.6, 0.5, 0.9) // Ice blue
    } else {
      comet.color.setHSL(0.15, 0.3, 0.95) // Warm white
    }
  }

  // Tail shader material
  const tailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00FFFF') },
        uOpacity: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // Fade from head to tail
          float fade = 1.0 - vUv.x;
          fade = pow(fade, 1.5);

          // Add shimmer
          float shimmer = sin(vUv.x * 20.0 - uTime * 5.0) * 0.1 + 0.9;

          // Taper width toward tail
          float width = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          width *= (1.0 - vUv.x * 0.8);

          float alpha = fade * width * shimmer * uOpacity;

          // Color gradient - brighter at head
          vec3 color = mix(uColor, vec3(1.0), (1.0 - vUv.x) * 0.5);

          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    cometsRef.current.forEach((comet, i) => {
      // Random spawn for inactive comets
      if (!comet.active) {
        // Spawn roughly every 10-20 seconds per comet slot
        if (Math.random() < delta * 0.08) {
          spawnComet(comet)
        }
        return
      }

      // Update lifetime
      comet.lifetime += delta

      if (comet.lifetime > comet.maxLifetime) {
        comet.active = false
        if (headMeshesRef.current[i]) {
          headMeshesRef.current[i]!.visible = false
        }
        if (tailMeshesRef.current[i]) {
          tailMeshesRef.current[i]!.visible = false
        }
        return
      }

      // Move comet
      comet.position.add(comet.velocity.clone().multiplyScalar(delta))

      // Slight curve due to gravity toward center
      const toCenter = new THREE.Vector3().sub(comet.position).normalize()
      comet.velocity.add(toCenter.multiplyScalar(delta * 2))

      // Update trail
      comet.trail.push(comet.position.clone())
      if (comet.trail.length > 50) {
        comet.trail.shift()
      }

      // Update head mesh
      const headMesh = headMeshesRef.current[i]
      if (headMesh) {
        headMesh.position.copy(comet.position)
        headMesh.visible = true

        // Fade out near end
        const lifeFactor = 1 - Math.pow(comet.lifetime / comet.maxLifetime, 2)
        const material = headMesh.material as THREE.MeshBasicMaterial
        material.opacity = lifeFactor * 0.95
        material.color.copy(comet.color)

        // Face camera
        headMesh.lookAt(camera.position)
      }

      // Update tail
      const tailMesh = tailMeshesRef.current[i]
      if (tailMesh && comet.trail.length > 2) {
        // Create curved tail geometry
        const curve = new THREE.CatmullRomCurve3(comet.trail.slice(-30))
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, comet.size * 0.3, 8, false)

        // Dispose old geometry
        if (tailMesh.geometry) {
          tailMesh.geometry.dispose()
        }
        tailMesh.geometry = tubeGeometry
        tailMesh.visible = true

        // Update material
        const material = tailMesh.material as THREE.ShaderMaterial
        material.uniforms.uTime.value = time
        material.uniforms.uColor.value.copy(comet.color)
        material.uniforms.uOpacity.value = 1 - Math.pow(comet.lifetime / comet.maxLifetime, 3)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i}>
          {/* Comet head - bright glowing sphere */}
          <mesh
            ref={(el) => { headMeshesRef.current[i] = el }}
            visible={false}
          >
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Inner glow */}
          <mesh visible={false}>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshBasicMaterial
              color="#88CCFF"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Comet tail */}
          <mesh
            ref={(el) => { tailMeshesRef.current[i] = el }}
            visible={false}
          >
            <bufferGeometry />
            <primitive object={tailMaterial.clone()} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
