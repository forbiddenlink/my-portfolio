'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WormholeEffectProps {
  isActive: boolean
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  onComplete?: () => void
}

// Dramatic wormhole tunnel effect for galaxy transitions
export function WormholeEffect({
  isActive,
  startPosition,
  endPosition,
  onComplete
}: WormholeEffectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const tunnelRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const ringsRef = useRef<THREE.Group>(null)

  const [animationPhase, setAnimationPhase] = useState<'idle' | 'opening' | 'tunnel' | 'closing'>('idle')
  const animationTime = useRef(0)

  // Calculate midpoint for wormhole position
  const midpoint = useMemo(() => {
    return [
      (startPosition[0] + endPosition[0]) / 2,
      (startPosition[1] + endPosition[1]) / 2 + 10, // Slightly above
      (startPosition[2] + endPosition[2]) / 2
    ] as [number, number, number]
  }, [startPosition, endPosition])

  // Direction vector
  const direction = useMemo(() => {
    return new THREE.Vector3(
      endPosition[0] - startPosition[0],
      endPosition[1] - startPosition[1],
      endPosition[2] - startPosition[2]
    ).normalize()
  }, [startPosition, endPosition])

  // Tunnel shader material
  const tunnelMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor1: { value: new THREE.Color('#6B21A8') },
        uColor2: { value: new THREE.Color('#0EA5E9') },
        uColor3: { value: new THREE.Color('#A855F7') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uProgress;

        void main() {
          vUv = uv;
          vPosition = position;

          // Warp effect
          vec3 pos = position;
          float wave = sin(pos.y * 3.0 + uTime * 2.0) * 0.1 * uProgress;
          pos.x += wave;
          pos.z += cos(pos.y * 2.5 + uTime * 1.5) * 0.1 * uProgress;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        varying vec2 vUv;
        varying vec3 vPosition;

        // Noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          // Tunnel coordinates
          vec2 uv = vUv;
          float angle = atan(uv.y - 0.5, uv.x - 0.5);
          float dist = length(uv - 0.5);

          // Swirling pattern
          float swirl = angle + uTime * 2.0 + dist * 10.0;
          float pattern = sin(swirl * 5.0) * 0.5 + 0.5;

          // Energy bands
          float bands = sin(vPosition.y * 8.0 - uTime * 5.0) * 0.5 + 0.5;

          // Noise distortion
          float n = noise(vec2(angle * 2.0, vPosition.y * 0.5 + uTime));

          // Color mixing
          vec3 color = mix(uColor1, uColor2, pattern);
          color = mix(color, uColor3, bands * n);

          // Edge glow
          float edge = smoothstep(0.0, 0.3, dist) * smoothstep(0.5, 0.3, dist);
          color += vec3(0.3, 0.1, 0.5) * (1.0 - edge) * 2.0;

          // Intensity based on progress
          float alpha = uProgress * edge * (0.7 + pattern * 0.3);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  // Particle data for energy streaks
  const particleData = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)

    const colorOptions = [
      new THREE.Color('#A855F7'),
      new THREE.Color('#0EA5E9'),
      new THREE.Color('#6B21A8'),
      new THREE.Color('#FFFFFF'),
    ]

    for (let i = 0; i < count; i++) {
      // Distribute in a cylinder
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 3
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      speeds[i] = 0.5 + Math.random() * 1.5
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, speeds, phases, count }
  }, [])

  // Control animation phases
  useEffect(() => {
    if (isActive) {
      setAnimationPhase('opening')
      animationTime.current = 0
    } else {
      setAnimationPhase('closing')
    }
  }, [isActive])

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    animationTime.current += delta

    if (animationPhase === 'idle') return

    // Update tunnel material
    if (tunnelRef.current) {
      const material = tunnelRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time

      // Progress based on phase
      let targetProgress = 0
      if (animationPhase === 'opening') {
        targetProgress = Math.min(animationTime.current / 0.5, 1)
        if (targetProgress >= 1) {
          setAnimationPhase('tunnel')
          animationTime.current = 0
        }
      } else if (animationPhase === 'tunnel') {
        targetProgress = 1
        if (animationTime.current > 2) {
          setAnimationPhase('closing')
          animationTime.current = 0
          onComplete?.()
        }
      } else if (animationPhase === 'closing') {
        targetProgress = 1 - Math.min(animationTime.current / 0.5, 1)
        if (targetProgress <= 0) {
          setAnimationPhase('idle')
        }
      }

      material.uniforms.uProgress.value = targetProgress
    }

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleData.count; i++) {
        // Move particles along tunnel
        positions[i * 3 + 1] -= particleData.speeds[i] * delta * 10

        // Wrap around
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 10
        }

        // Spiral motion
        const angle = particleData.phases[i] + time * particleData.speeds[i]
        const radius = 2 + Math.sin(time + particleData.phases[i]) * 0.5
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 2] = Math.sin(angle) * radius
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = time * (0.5 + i * 0.2)
        const scale = 1 + Math.sin(time * 2 + i) * 0.1
        ring.scale.setScalar(scale)
      })
    }
  })

  if (animationPhase === 'idle') return null

  return (
    <group ref={groupRef} position={midpoint}>
      {/* Rotating alignment to face direction */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Tunnel mesh */}
        <mesh ref={tunnelRef}>
          <cylinderGeometry args={[5, 5, 20, 32, 1, true]} />
          <primitive object={tunnelMaterial} attach="material" />
        </mesh>

        {/* Energy particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particleData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[particleData.colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Concentric rings at entrance/exit */}
        <group ref={ringsRef}>
          {[0, 1, 2].map((i) => (
            <group key={i} position={[0, -10 + i * 0.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5 + i * 0.5, 0.1, 8, 64]} />
                <meshBasicMaterial
                  color={i === 0 ? '#A855F7' : i === 1 ? '#0EA5E9' : '#6B21A8'}
                  transparent
                  opacity={0.6}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          ))}
          {[0, 1, 2].map((i) => (
            <group key={`exit-${i}`} position={[0, 10 - i * 0.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5 + i * 0.5, 0.1, 8, 64]} />
                <meshBasicMaterial
                  color={i === 0 ? '#A855F7' : i === 1 ? '#0EA5E9' : '#6B21A8'}
                  transparent
                  opacity={0.6}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Central glow */}
        <pointLight color="#A855F7" intensity={5} distance={30} />
        <pointLight color="#0EA5E9" intensity={3} distance={20} position={[0, 5, 0]} />
        <pointLight color="#6B21A8" intensity={3} distance={20} position={[0, -5, 0]} />
      </group>
    </group>
  )
}

// Simpler portal effect for entering/exiting
export function PortalRing({
  position,
  scale = 1,
  color = '#A855F7',
  isActive = false
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  isActive?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.5
    }

    if (ringRef.current && isActive) {
      const pulse = 1 + Math.sin(time * 3) * 0.1
      ringRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 2, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.2 : 0.05}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {isActive && (
        <pointLight color={color} intensity={2} distance={10} />
      )}
    </group>
  )
}
