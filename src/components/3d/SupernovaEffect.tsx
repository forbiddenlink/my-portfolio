'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SupernovaEffectProps {
  position: [number, number, number]
  color: string
  size: number
}

/**
 * A dramatic supernova effect with:
 * - Pulsing energy core
 * - Expanding corona waves
 * - Volumetric light rays
 * - Orbiting energy particles
 * - Lens flare streaks
 */
export function SupernovaEffect({ position, color, size }: SupernovaEffectProps) {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Group>(null)
  const raysRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const waveRefs = useRef<THREE.Mesh[]>([])
  const flareRef = useRef<THREE.Group>(null)

  // Particle system for orbiting energy
  const particleData = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute in spherical shell around supernova
      const radius = size * 2 + Math.random() * size * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random orbital velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      scales[i] = 0.3 + Math.random() * 0.7
    }

    return { positions, velocities, scales, count }
  }, [size])

  // Core shader for pulsing energy
  const coreVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      // Subtle vertex displacement for organic feel
      vec3 pos = position;
      float displacement = sin(position.x * 10.0 + time * 3.0) *
                          sin(position.y * 10.0 + time * 2.0) *
                          sin(position.z * 10.0 + time * 4.0) * 0.05;
      pos += normal * displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const coreFragmentShader = `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Noise functions for texture
    float hash(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p, p.yxz + 19.19);
      return fract((p.x + p.y) * p.z);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      // Animated plasma texture
      vec3 pos = vPosition * 3.0;
      float plasma = fbm(pos + vec3(time * 0.5, time * 0.3, time * 0.4));
      float plasma2 = fbm(pos * 1.5 - vec3(time * 0.4, time * 0.6, time * 0.2));

      // Core color with hot center
      vec3 hotColor = vec3(1.0, 0.95, 0.8); // Near white
      vec3 midColor = color * 1.5;
      vec3 edgeColor = color;

      // Fresnel for edge darkening
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

      // Mix colors based on plasma and fresnel
      vec3 surfaceColor = mix(hotColor, midColor, plasma * 0.7);
      surfaceColor = mix(surfaceColor, edgeColor, fresnel * 0.5);

      // Pulsing brightness
      float pulse = sin(time * 2.0) * 0.15 + 1.0;
      float pulse2 = sin(time * 3.5 + 1.0) * 0.1 + 1.0;

      // Add bright plasma veins
      float veins = smoothstep(0.4, 0.6, plasma2) * 0.5;
      surfaceColor += vec3(veins) * pulse2;

      // Final intensity
      float intensity = 2.5 * pulse;

      gl_FragColor = vec4(surfaceColor * intensity, 1.0);
    }
  `

  // Animate everything
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Animate core
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = time

      // Subtle scale pulsing
      const scale = 1 + Math.sin(time * 2) * 0.05
      coreRef.current.scale.setScalar(scale)
    }

    // Rotate corona
    if (coronaRef.current) {
      coronaRef.current.rotation.z += 0.002
      coronaRef.current.rotation.y += 0.001
    }

    // Animate rays
    if (raysRef.current) {
      raysRef.current.rotation.z -= 0.001
      raysRef.current.children.forEach((ray, i) => {
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7
        ray.scale.x = pulse
      })
    }

    // Animate expanding waves
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const phase = (time * 0.3 + i * 0.3) % 1
        const scale = 1 + phase * 4
        wave.scale.setScalar(scale)
        const material = wave.material as THREE.MeshBasicMaterial
        material.opacity = (1 - phase) * 0.4
      }
    })

    // Animate orbiting particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleData.count; i++) {
        const i3 = i * 3

        // Orbital motion
        const x = positions[i3]
        const z = positions[i3 + 2]
        const angle = 0.005 + particleData.scales[i] * 0.005

        positions[i3] = x * Math.cos(angle) - z * Math.sin(angle)
        positions[i3 + 2] = x * Math.sin(angle) + z * Math.cos(angle)

        // Vertical oscillation
        positions[i3 + 1] += Math.sin(time * 2 + i) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate flare
    if (flareRef.current) {
      flareRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Blazing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={{
            color: { value: new THREE.Color(color) },
            time: { value: 0 }
          }}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.2}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Corona layers */}
      <group ref={coronaRef}>
        {/* Hot corona ring 1 */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.8, size * 0.15, 16, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Corona ring 2 - tilted */}
        <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[size * 2.2, size * 0.12, 16, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Corona ring 3 - perpendicular */}
        <mesh rotation={[0, Math.PI / 2, Math.PI / 4]}>
          <torusGeometry args={[size * 2.0, size * 0.1, 16, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Volumetric light rays */}
      <group ref={raysRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[0, 0, 0]}
              rotation={[0, 0, angle]}
            >
              <planeGeometry args={[size * 15, size * 0.3]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )
        })}
      </group>

      {/* Expanding energy waves */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`wave-${i}`}
          ref={(el) => { if (el) waveRefs.current[i] = el }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[size * 1.5, size * 1.6, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Orbiting energy particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions}
            itemSize={3}
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Lens flare effect */}
      <group ref={flareRef}>
        {/* Main horizontal flare */}
        <mesh>
          <planeGeometry args={[size * 20, size * 0.8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Vertical flare */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[size * 15, size * 0.5]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Diagonal flares */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[size * 12, size * 0.3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <planeGeometry args={[size * 12, size * 0.3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Hexagonal aperture flare */}
        <mesh scale={2.5}>
          <ringGeometry args={[size * 3, size * 3.5, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Outer volumetric glow */}
      <mesh scale={3.5}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Extended halo */}
      <mesh scale={5.0}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Very bright point lights */}
      <pointLight color="#ffffff" intensity={20} distance={60} decay={2} />
      <pointLight color={color} intensity={15} distance={80} decay={1.5} />
    </group>
  )
}
