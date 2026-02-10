'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { getGalaxyCenterPosition } from '@/lib/utils'

interface GalaxyCoreProps {
  position: [number, number, number]
  color: string
  scale?: number
}

// Individual galaxy core with luminous center and spiral arms
function GalaxyCoreSingle({ position, color, scale = 1 }: GalaxyCoreProps) {
  const coreRef = useRef<THREE.Mesh>(null)
  const armsRef = useRef<THREE.Points>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Core glow shader
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
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
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5);
          float dist = length(vUv - center);

          // Pulsing glow
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;

          // Radial gradient with soft falloff
          float glow = smoothstep(0.5, 0.0, dist) * pulse;

          // Add some noise for organic look
          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
          glow += noise * 0.05 * glow;

          // Brighter center
          float core = smoothstep(0.15, 0.0, dist) * 2.0;

          vec3 finalColor = uColor * (glow + core);
          float alpha = glow * 0.8;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [color])

  // Spiral arm particles
  const spiralData = useMemo(() => {
    const armCount = 2
    const particlesPerArm = 150
    const totalParticles = armCount * particlesPerArm

    const positions = new Float32Array(totalParticles * 3)
    const colors = new Float32Array(totalParticles * 3)
    const sizes = new Float32Array(totalParticles)

    const baseColor = new THREE.Color(color)
    const brightColor = new THREE.Color(color).multiplyScalar(1.5)

    for (let arm = 0; arm < armCount; arm++) {
      const armOffset = (arm / armCount) * Math.PI * 2

      for (let i = 0; i < particlesPerArm; i++) {
        const idx = arm * particlesPerArm + i

        // Spiral equation: r = a + b * theta
        const t = i / particlesPerArm
        const theta = t * Math.PI * 3 + armOffset // 1.5 rotations per arm
        const radius = 2 + t * 12 // Start at 2, extend to 14

        // Add some randomness for organic look
        const randRadius = radius + (Math.random() - 0.5) * 2
        const randTheta = theta + (Math.random() - 0.5) * 0.3
        const randY = (Math.random() - 0.5) * 1.5 // Slight thickness

        positions[idx * 3] = Math.cos(randTheta) * randRadius
        positions[idx * 3 + 1] = randY
        positions[idx * 3 + 2] = Math.sin(randTheta) * randRadius

        // Color gradient - brighter toward center
        const colorMix = 1 - t * 0.7
        const particleColor = baseColor.clone().lerp(brightColor, colorMix)
        colors[idx * 3] = particleColor.r
        colors[idx * 3 + 1] = particleColor.g
        colors[idx * 3 + 2] = particleColor.b

        // Size - larger toward center
        sizes[idx] = (1 - t * 0.5) * 0.3
      }
    }

    return { positions, colors, sizes, count: totalParticles }
  }, [color])

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Update core material
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }

    // Slowly rotate spiral arms
    if (armsRef.current) {
      armsRef.current.rotation.y = time * 0.05
    }

    // Pulse the glow
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.1
      glowRef.current.scale.setScalar(pulse * scale)
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Central luminous core */}
      <mesh ref={coreRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 6, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spiral arm particles */}
      <points ref={armsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[spiralData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[spiralData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[spiralData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Central point light for bloom effect */}
      <pointLight
        color={color}
        intensity={2}
        distance={20}
        decay={2}
      />
    </group>
  )
}

// Render cores for all galaxies
export function GalaxyCores() {
  const galaxyCores = useMemo(() => {
    return galaxies.map((galaxy, index) => {
      const [x, y, z] = getGalaxyCenterPosition(index)
      return {
        position: [x, y, z] as [number, number, number],
        color: galaxy.color,
        id: galaxy.id,
      }
    })
  }, [])

  return (
    <>
      {galaxyCores.map((core) => (
        <GalaxyCoreSingle
          key={core.id}
          position={core.position}
          color={core.color}
          scale={1.2}
        />
      ))}
    </>
  )
}
