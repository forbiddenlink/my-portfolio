'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface JellyfishProps {
  position: [number, number, number]
  color?: string
  scale?: number
}

/**
 * Single bioluminescent space jellyfish with flowing tentacles
 */
function SingleJellyfish({ position, color = '#FF00FF', scale = 1 }: JellyfishProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const tentaclesRef = useRef<THREE.Group>(null)

  const jellyfishColor = useMemo(() => new THREE.Color(color), [color])
  const glowColor = useMemo(() => jellyfishColor.clone().multiplyScalar(1.5), [jellyfishColor])

  // Body shader for pulsing bioluminescence
  const bodyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: jellyfishColor },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normal;

          vec3 pos = position;

          // Breathing/pulsing effect
          float pulse = sin(uTime * 2.0) * 0.1 + 1.0;
          pos.x *= pulse;
          pos.z *= pulse;

          // Undulation
          pos.y += sin(uTime * 1.5 + position.x * 2.0) * 0.05;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Rim lighting effect
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.0);

          // Pulsing glow
          float pulse = sin(uTime * 3.0) * 0.3 + 0.7;

          // Bioluminescent patterns
          float pattern = sin(vUv.x * 10.0 + uTime) * sin(vUv.y * 8.0 - uTime * 0.5);
          pattern = pattern * 0.2 + 0.8;

          vec3 color = uColor * pattern * pulse;
          color += vec3(1.0) * rim * 0.5;

          float alpha = 0.4 + rim * 0.4 + pulse * 0.1;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [jellyfishColor])

  // Tentacle configurations
  const tentacles = useMemo(() => {
    const tentacleCount = 8
    return Array.from({ length: tentacleCount }, (_, i) => {
      const angle = (i / tentacleCount) * Math.PI * 2
      return {
        angle,
        length: 2 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        radius: 0.4 + Math.random() * 0.2,
      }
    })
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.5
      groupRef.current.position.x = position[0] + Math.sin(time * 0.3) * 0.3
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.2
    }

    if (bodyRef.current) {
      const material = bodyRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }

    // Animate tentacles
    if (tentaclesRef.current) {
      tentaclesRef.current.children.forEach((tentacle, i) => {
        const config = tentacles[i]

        // Wave motion along tentacle
        if (tentacle instanceof THREE.Mesh) {
          const geometry = tentacle.geometry
          const positions = geometry.attributes.position.array as Float32Array

          for (let j = 0; j < positions.length / 3; j++) {
            const y = positions[j * 3 + 1]
            const t = -y / config.length // 0 at top, 1 at bottom

            // Sinuous movement
            const wave = Math.sin(time * 2 + t * 4 + config.phase) * 0.3 * t
            const wave2 = Math.cos(time * 1.5 + t * 3 + config.phase) * 0.2 * t

            const baseX = Math.cos(config.angle) * config.radius * (1 - t * 0.3)
            const baseZ = Math.sin(config.angle) * config.radius * (1 - t * 0.3)

            positions[j * 3] = baseX + wave
            positions[j * 3 + 2] = baseZ + wave2
          }

          geometry.attributes.position.needsUpdate = true
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main bell/body */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[1, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Inner glow */}
      <mesh scale={0.85}>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh scale={1.4}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={jellyfishColor}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Tentacles */}
      <group ref={tentaclesRef} position={[0, -0.3, 0]}>
        {tentacles.map((config, i) => (
          <mesh key={i}>
            <cylinderGeometry args={[0.03, 0.01, config.length, 8, 16]} />
            <meshBasicMaterial
              color={jellyfishColor}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Point light for bioluminescence */}
      <pointLight
        color={jellyfishColor}
        intensity={1}
        distance={8}
        decay={2}
      />
    </group>
  )
}

interface CosmicJellyfishProps {
  count?: number
}

/**
 * Multiple cosmic jellyfish floating through space
 */
export function CosmicJellyfish({ count = 5 }: CosmicJellyfishProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Generate jellyfish positions and configs
  const jellyfishConfigs = useMemo(() => {
    const colors = ['#FF00FF', '#00FFFF', '#FF66AA', '#AA88FF', '#66FFCC']

    return Array.from({ length: count }, (_, i) => {
      // Distribute in a rough sphere around the scene
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.6 + Math.PI * 0.2
      const radius = 60 + Math.random() * 80

      return {
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi) * 0.5 + 20,
          radius * Math.sin(phi) * Math.sin(theta)
        ] as [number, number, number],
        color: colors[i % colors.length],
        scale: 1.5 + Math.random() * 2,
      }
    })
  }, [count])

  // Simpler static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <group>
        {jellyfishConfigs.map((config, i) => (
          <mesh key={i} position={config.position} scale={config.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group>
      {jellyfishConfigs.map((config, i) => (
        <SingleJellyfish
          key={i}
          position={config.position}
          color={config.color}
          scale={config.scale}
        />
      ))}
    </group>
  )
}
